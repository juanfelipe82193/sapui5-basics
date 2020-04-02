// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.test.adapters.lrep.AppVariantPersonalizationAdapter
 */

/* global sap, sinon, Promise, QUnit */

sap.ui.require([
    "sap/ushell/adapters/AppVariantPersonalizationAdapter",
    "sap/ui/fl/apply/api/UI2PersonalizationApplyAPI",
    "sap/ui/fl/write/api/UI2PersonalizationWriteAPI"
],
function (
    AppVariantPersonalizationAdapter,
    UI2PersonalizationApplyAPI,
    UI2PersonalizationWriteAPI
) {
    "use strict";

    var sandbox = sinon.sandbox.create();

    QUnit.module("Given an AppVariantAdapter is instantiated", {
        beforeEach: function() {
            this.oAppVariantAdapter = new AppVariantPersonalizationAdapter();
        },
        afterEach: function() {
            sandbox.restore();
        }
    });

    QUnit.test("When getAdapterContainer() is called", function(assert) {
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        var oAdapterContainer = this.oAppVariantAdapter.getAdapterContainer('sap.ushell.personalization#ContainerKey', oScope, 'MyApp');
        assert.strictEqual(oAdapterContainer.getMap().category, "U", "then the category is correct");
        assert.equal(oAdapterContainer.getMap().component, undefined, "then the component is not passed as scope's property");
        assert.deepEqual(oAdapterContainer.getMap().scope, oScope, "then the scope is correctly contained in the container");
        assert.strictEqual(oAdapterContainer.getMap().containerKey, 'ContainerKey', "then the key is properly rectified");
    });

    QUnit.test("When delAdapterContainer() is called", function(assert) {
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false,
            appVarId: 'AppVarId',
            appVersion: '1.2.3'
        };

        var mPropertyBag = {
            selector: {
                appId: "AppVarId",
                appVersion: "1.2.3"
            },
            containerKey: "ContainerKey"
        };

        var loadPersonalizationSpy = sandbox.stub(UI2PersonalizationApplyAPI, "load").returns(Promise.resolve([]));

        return this.oAppVariantAdapter.delAdapterContainer('sap.ushell.personalization#ContainerKey', oScope).then(function() {
            assert.equal(loadPersonalizationSpy.callCount, 1, "then the UI2PersonalizationApplyAPI's load method is called once");
            assert.deepEqual(loadPersonalizationSpy.firstCall.args[0], mPropertyBag, "then the first argument is correct");
        });
    });

    QUnit.module("Given an AppVariantAdapterContainer is instantiated", {
        beforeEach: function() {
            var oScope = {
                validity: 1,
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false,
                appVarId: 'AppVarId',
                appVersion: '1.2.3'
            };

            this.oAppVariantAdapter = new AppVariantPersonalizationAdapter();
            this.oAppVariantAdapterContainer = this.oAppVariantAdapter.getAdapterContainer('sap.ushell.personalization#ContainerKey', oScope, "TestApp");
        },
        afterEach: function() {
            sandbox.restore();
        }
    });

    QUnit.test("When a setItemValue() method is called with item members", function(assert) {
        // write
        this.oAppVariantAdapterContainer.setItemValue("ITEM#A23456789B123456789C123456789D1234567890ABC", "TestValue");

        assert.strictEqual("U", this.oAppVariantAdapterContainer.getMap().container[0].containerCategory, "then the container category is correct");
        assert.strictEqual("ContainerKey", this.oAppVariantAdapterContainer.getMap().container[0].containerKey, "then the container key is correct");
        assert.strictEqual("I", this.oAppVariantAdapterContainer.getMap().container[0].category, "then the item category is correct");
        assert.strictEqual("A23456789B123456789C123456789D1234567890", this.oAppVariantAdapterContainer.getMap().container[0].itemName, "then the item name is correct");
        assert.strictEqual('AppVarId', this.oAppVariantAdapterContainer.getMap().container[0].reference, "then the reference is correct");
        assert.strictEqual('TestValue', this.oAppVariantAdapterContainer.getMap().container[0].content, "then the content is correct");
        // read
        var sItemValue = this.oAppVariantAdapterContainer.getItemValue("ITEM#A23456789B123456789C123456789D1234567890ABC");
        assert.strictEqual(sItemValue, 'TestValue', "correct item value was read from container");
    });

    QUnit.test("When a setItemValue() method is called with VariantSet members", function(assert) {
        // write
        this.oAppVariantAdapterContainer.setItemValue("VARIANTSET#ABC", "VariantSetValue");

        assert.strictEqual("U", this.oAppVariantAdapterContainer.getMap().container[0].containerCategory, "then the container category is correct");
        assert.strictEqual("ContainerKey", this.oAppVariantAdapterContainer.getMap().container[0].containerKey, "then the container key is correct");
        assert.strictEqual("V", this.oAppVariantAdapterContainer.getMap().container[0].category, "then the variant set category is correct");
        assert.strictEqual("ABC", this.oAppVariantAdapterContainer.getMap().container[0].itemName, "then the variant set name is correct");
        assert.strictEqual('AppVarId', this.oAppVariantAdapterContainer.getMap().container[0].reference, "then the reference is correct");
        assert.strictEqual('VariantSetValue', this.oAppVariantAdapterContainer.getMap().container[0].content, "then the content is correct");
        // read
        var sVariantSetValue = this.oAppVariantAdapterContainer.getItemValue("VARIANTSET#ABC");
        assert.strictEqual(sVariantSetValue, 'VariantSetValue', "correct variant set value was read from container");
    });

    QUnit.test("When delItem() is called when the item is available in a container", function(assert) {
        var oItem = {
            "reference": 'AppVarId',
            "content" : 'TestValue',
            "itemName" : 'A23456789B123456789C123456789D1234567890',
            "category" : 'I',
            "containerKey" : 'ContainerKey',
            "containerCategory" : 'U'
        };
        this.oAppVariantAdapterContainer.getMap().container.push(oItem);
        assert.strictEqual(this.oAppVariantAdapterContainer.getMap().container.length, 1, "then the container has one item inside");
        assert.strictEqual("U", this.oAppVariantAdapterContainer.getMap().container[0].containerCategory, "then the container category is correct");
        assert.strictEqual("ContainerKey", this.oAppVariantAdapterContainer.getMap().container[0].containerKey, "then the container key is correct");
        assert.strictEqual("I", this.oAppVariantAdapterContainer.getMap().container[0].category, "then the item category is correct");
        assert.strictEqual("A23456789B123456789C123456789D1234567890", this.oAppVariantAdapterContainer.getMap().container[0].itemName, "then the item name is correct");
        assert.strictEqual('AppVarId', this.oAppVariantAdapterContainer.getMap().container[0].reference, "then the reference is correct");
        assert.strictEqual('TestValue', this.oAppVariantAdapterContainer.getMap().container[0].content, "then the content is correct");

        this.oAppVariantAdapterContainer.delItem("ITEM#A23456789B123456789C123456789D1234567890ABC");
        assert.equal(this.oAppVariantAdapterContainer.getMap().container.length, 0, "then one item inside the container is deleted");
    });

    QUnit.test("When delItem() is called when the item is not available in a container", function(assert) {
        this.oAppVariantAdapterContainer.delItem("ITEM#A23456789B123456789C123456789D1234567890ABC");
        assert.equal(this.oAppVariantAdapterContainer.getMap().container.length, 0, "then there is no item to be deleted in a container");
    });

    QUnit.test("When containsItem() is called when the item is contained in a container", function(assert) {
        var oItem = {
            "reference": 'AppVarId',
			"content" : 'TestValue',
            "itemName" : 'A23456789B123456789C123456789D1234567890',
            "category" : 'I',
            "containerKey" : 'ContainerKey',
            "containerCategory" : 'U'
        };
        this.oAppVariantAdapterContainer.getMap().container.push(oItem);
        assert.equal(this.oAppVariantAdapterContainer.containsItem('ITEM#A23456789B123456789C123456789D1234567890'), true, 'then the container contains an item');
    });

    QUnit.test("When containsItem() is called when the item is not contained in a container", function(assert) {
        assert.equal(this.oAppVariantAdapterContainer.containsItem('ITEM#A23456789B123456789C123456789D1234567890'), false, 'then the container contains an item');
    });

    QUnit.test("When load() is called", function(assert) {
        var oContainer = [{
            itemName: 'A23456789B123456789C123456789D1234567890'
        }];
        sandbox.stub(UI2PersonalizationApplyAPI, 'load').returns(Promise.resolve(oContainer));

        return this.oAppVariantAdapterContainer.load().then(function() {
            assert.strictEqual("A23456789B123456789C123456789D1234567890", this.oAppVariantAdapterContainer.getMap().container[0].itemName, "then the item name is correct");
        }.bind(this));

    });

    QUnit.test("When load() is called and the backend call gets failed", function(assert) {
        sandbox.stub(UI2PersonalizationApplyAPI, 'load').returns(Promise.reject('lala'));

        var resetSpy = sandbox.spy(this.oAppVariantAdapterContainer, "_reset");

        return this.oAppVariantAdapterContainer.load()
            .catch(function(sErrorMessage) {
                assert.ok(true, "a rejection took place");
                assert.equal(resetSpy.callCount, 1, "then the _reset method is called once");
                assert.strictEqual(sErrorMessage, 'lala', "then the error message is correct");
                return Promise.resolve();
            });
    });

    QUnit.test("When save() is called", function(assert) {
		this.oAppVariantAdapterContainer.setItemValue("ITEM#A23456789B123456789C123456789D1234567890ABC", "TestValue");
		var fnSetPersonalizationSpy = sandbox.stub(UI2PersonalizationWriteAPI, "create").returns(Promise.resolve());

		return this.oAppVariantAdapterContainer.save().then(function() {
            assert.ok(true, "a promise gets resolved");
            assert.equal(fnSetPersonalizationSpy.callCount, 1, 'then the setPersonalization is called once');
			assert.deepEqual({}, this.oAppVariantAdapterContainer.getMap().changedKeys, "then the changed keys have been written to layered repository and empty");
		}.bind(this));
    });

    QUnit.test("When save() is called and the backend call gets failed", function(assert) {
        this.oAppVariantAdapterContainer.setItemValue("ITEM#A23456789B123456789C123456789D1234567890ABC", "TestValue");
        sandbox.stub(UI2PersonalizationWriteAPI, 'create').returns(Promise.reject('lala'));

        return this.oAppVariantAdapterContainer.save()
            .catch(function(sErrorMessage) {
                assert.ok(true, "a rejection took place");
                assert.strictEqual(sErrorMessage, 'lala', "then the error message is correct");
                return Promise.resolve();
            });
    });

    QUnit.test("When del() is called", function(assert) {
        var oContainer = [{
            itemName: 'A23456789B123456789C123456789D1234567890'
        }];
        var fnLoadPersonalizationStub = sandbox.stub(UI2PersonalizationApplyAPI, "load").returns(Promise.resolve(oContainer));

        var fnDeletePersonalizationStub = sandbox.stub(UI2PersonalizationWriteAPI, "deletePersonalization").returns(Promise.resolve());

        var mPropertyBagForLoadPersonalization = {
            selector: {
                appId: "AppVarId",
                appVersion: "1.2.3"
            },
            containerKey: "ContainerKey"
        };

        var mPropertyBagForDeletePersonalization = {
            selector: {
                appId: "AppVarId"
            },
            containerKey: "ContainerKey",
            itemName: oContainer[0].itemName
        };

        return this.oAppVariantAdapterContainer.del().then(function() {

            assert.equal(fnLoadPersonalizationStub.callCount, 1, 'then the getPersonalization is called once');
            assert.deepEqual(fnLoadPersonalizationStub.firstCall.args[0], mPropertyBagForLoadPersonalization, "then the first argument is correct");

            assert.equal(fnDeletePersonalizationStub.callCount, 1, 'then the deletePersonalization is called once');
            assert.deepEqual(fnDeletePersonalizationStub.firstCall.args[0], mPropertyBagForDeletePersonalization, "then the first argument is correct");
        }.bind(this));
    });

    QUnit.test("When del() is called and the backend call gets failed", function(assert) {
        var oContainer = [{
            itemName: 'A23456789B123456789C123456789D1234567890'
        }];
        var fnLoadPersonalizationStub = sandbox.stub(UI2PersonalizationApplyAPI, "load").returns(Promise.resolve(oContainer));

        var mPropertyBagForLoadPersonalization = {
            selector: {
                appId: "AppVarId",
                appVersion: "1.2.3"
            },
            containerKey: "ContainerKey"
        };

        sandbox.stub(UI2PersonalizationWriteAPI, "deletePersonalization").returns(Promise.reject('lala'));

        return this.oAppVariantAdapterContainer.del()
            .catch(function(sErrorMessage) {
                assert.equal(fnLoadPersonalizationStub.callCount, 1, 'then the getPersonalization is called once');
                assert.deepEqual(fnLoadPersonalizationStub.firstCall.args[0], mPropertyBagForLoadPersonalization, "then the first argument is correct");

                assert.ok(true, "a rejection took place");
                assert.strictEqual(sErrorMessage, 'lala', "then the error message is correct");
                return Promise.resolve();
            });
    });
});