// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ContentExtensionAdapterFactory
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/ContentExtensionAdapterFactory",
    "sap/ushell/test/services/_ContentExtensionAdapterFactory/FeaturedGroupConfig",
    "sap/ushell/services/_ContentExtensionAdapterFactory/ContentExtensionAdapterConfig",
    "sap/ushell/Config",
    "sap/ushell/System",
    "sap/ushell/resources"
], function (ContentExtensionAdapterFactory, FeaturedGroupMock, ContentExtensionAdapterConfig, Config, System) {
    "use strict";

    /*global Promise sinon jQuery window QUnit*/
    QUnit.start();
    QUnit.module("The function getAdapters", {
        beforeEach: function () {
            this.oConfig = {
                contentProviderName: "feature-test"
            };

            this.oGetAdapterStub = sinon.stub(ContentExtensionAdapterFactory, "_getAdapter");
            this.oConfigLastStub = sinon.stub(Config, "last").returns(true);
            this.oGetConfigAdaptersStub = sinon.stub(ContentExtensionAdapterFactory, "_getConfigAdapters").returns([]);
        },

        afterEach: function () {
            this.oConfig = null;
            this.oGetAdapterStub.restore();
            this.oGetAdapterStub = null;
            this.oConfigLastStub.restore();
            this.oConfigLastStub = null;
            this.oGetConfigAdaptersStub.restore();
            this.oGetConfigAdaptersStub = null;
        }
    });

    QUnit.test("Calls the function _getConfigAdapters", function (assert) {
        // Arrange
        var done = assert.async();
        var aConfigs = [];
        this.oGetConfigAdaptersStub.returns(aConfigs);

        // Act
        var oPromise = ContentExtensionAdapterFactory.getAdapters(aConfigs);

        // Assert
        oPromise.then(function () {
            assert.strictEqual(this.oGetConfigAdaptersStub.callCount, 1, "The function _getConfigAdapters has been called once.");
            assert.strictEqual(this.oGetConfigAdaptersStub.firstCall.args[0], aConfigs, "The function _getConfigAdapters has been called with the correct parameter.");
            assert.strictEqual(this.oGetAdapterStub.callCount, 0, "The function _getAdapter has not been called.");
            done();
        }.bind(this));
    });

    QUnit.test("Returns a map of content provider names and adapters if called with one config object", function (assert){
        // Arrange
        var done = assert.async();
        var oAdapter = {};
        var oAdapterPromise = Promise.resolve(oAdapter);
        this.oGetAdapterStub.returns(oAdapterPromise);
        this.oGetConfigAdaptersStub.returns([ this.oConfig ]);

        // Act
        var oPromise = ContentExtensionAdapterFactory.getAdapters();

        // Assert
        oPromise.then(function (oAdapters) {
            assert.strictEqual(oAdapters["feature-test"], oAdapter, "The correct reference has been found.");
            assert.strictEqual(this.oGetAdapterStub.callCount, 1, "The function _getAdapter has been called once.");
            assert.strictEqual(this.oGetAdapterStub.firstCall.args[0], this.oConfig, "The function _getAdapter has been called with the correct parameter.");

            done();
        }.bind(this));
    });

    QUnit.test("Returns an empty map if all content providers are disabled via configuration", function (assert){
        // Arrange
        var done = assert.async();
        this.oConfigLastStub.returns(false);
        this.oGetConfigAdaptersStub.returns([ this.oConfig, this.oConfig ]);

        // Act
        var oPromise = ContentExtensionAdapterFactory.getAdapters();

        // Assert
        oPromise.then(function (oAdapters) {
            assert.strictEqual(oAdapters.hasOwnProperty("feature-test"), false, "The object does not contain the feature-test field.");
            assert.strictEqual(this.oGetAdapterStub.callCount, 0, "The function _getAdapter has not been called.");

            done();
        }.bind(this));
    });

    QUnit.module("The function _getConfigAdapters");

    QUnit.test("Returns the same object reference if an array is passed", function (assert) {
        // Arrange
        var aConfigs = [];

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters(aConfigs);

        // Assert
        assert.strictEqual(oResult, aConfigs, "The correct reference has been found.");
    });

    QUnit.test("Returns the given object reference wrapped in an array", function (assert) {
        // Arrange
        var oConfig = {};

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters(oConfig);

        // Assert
        assert.strictEqual(oResult[0], oConfig, "The correct reference has been found.");
    });

    QUnit.test("Returns the return value of ContentExtensionAdapterConfig._getConfigAdapters if no value is passed", function (assert) {
        // Arrange
        var aConfigs = [];
        var oStub = sinon.stub(ContentExtensionAdapterConfig, "_getConfigAdapters").returns(aConfigs);

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters();

        // Assert
        assert.strictEqual(oResult, aConfigs, "The correct reference has been found.");
        assert.strictEqual(oStub.callCount, 1, "The function _getConfigAdapters has been called.");

        // Cleanup
        oStub.restore();
    });

    QUnit.test("Returns the return value of ContentExtensionAdapterConfig._getConfigAdapters wrapped in an array", function (assert) {
        // Arrange
        var aConfigs = {};
        var oStub = sinon.stub(ContentExtensionAdapterConfig, "_getConfigAdapters").returns(aConfigs);

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters();

        // Assert
        assert.strictEqual(oResult[0], aConfigs, "The correct reference has been found.");
        assert.strictEqual(oStub.callCount, 1, "The function _getConfigAdapters has been called.");

        // Cleanup
        oStub.restore();
    });

    QUnit.module("The function _getAdapter", {
        beforeEach: function () {
            this.oRequireStub = sinon.stub(window.sap.ui, "require");

            this.oInstance = {};
            this.oAdapterInstanceStub = sinon.stub(ContentExtensionAdapterFactory, "_getAdapterInstance").returns(this.oInstance);
        },
        afterEach: function () {
            this.oRequireStub.restore();
            this.oRequireStub = null;
            this.oAdapterInstanceStub.restore();
            this.oAdapterInstanceStub = null;
            this.oInstance = null;
        }
    });

    QUnit.test("Calls sap.ui.require to load the adapter's module", function (assert) {
        // Arrange
        var oConfig = {
            adapter: "some.adapter.module"
        };

        // Act
        ContentExtensionAdapterFactory._getAdapter(oConfig);

        // Assert
        assert.strictEqual(this.oRequireStub.callCount, 1, "The function sap.ui.require has been called once.");
        assert.deepEqual(this.oRequireStub.firstCall.args[0], [ "some/adapter/module" ], "The function sap.ui.require has been called with the correct module name.");
        assert.strictEqual(typeof this.oRequireStub.firstCall.args[1], "function", "The function sap.ui.require has been provided with a callback function.");
    });

    QUnit.test("Returns a promise that is resolved to an adapter instance when the adapter's module is loaded", function (assert) {
        // Arrange
        var done = assert.async();
        var oConfig = {
            adapter: "some.adapter.module",
            system: {}
        };

        var oPromise = ContentExtensionAdapterFactory._getAdapter(oConfig);
        var fnCallback = this.oRequireStub.firstCall.args[1];

        // Act
        fnCallback();

        // Assert
        oPromise.then(function (oResult) {
            assert.strictEqual(oResult, this.oInstance, "The correct reference has been found.");
            assert.strictEqual(this.oAdapterInstanceStub.callCount, 1, "The function _getAdapterInstance has been called once.");
            assert.strictEqual(this.oAdapterInstanceStub.firstCall.args[0], oConfig.adapter, "The function _getAdapterInstance has been called with the correct parameter.");
            assert.strictEqual(this.oAdapterInstanceStub.firstCall.args[1], oConfig.system, "The function _getAdapterInstance has been called with the correct parameter.");
            assert.strictEqual(this.oAdapterInstanceStub.firstCall.args[2], null, "The function _getAdapterInstance has been called with the correct parameter.");
            assert.deepEqual(this.oAdapterInstanceStub.firstCall.args[3], {}, "The function _getAdapterInstance has been called with the correct parameter.");

            done();
        }.bind(this));
    });

    QUnit.test("Calls the configHandler from the given config object and passes the return value to the adapter instance", function (assert) {
        // Arrange
        var done = assert.async();
        var oAdapterConfig = {};
        var oConfig = {
            adapter: "",
            configHandler: sinon.stub().returns(oAdapterConfig)
        };

        var oPromise = ContentExtensionAdapterFactory._getAdapter(oConfig);
        var fnCallback = this.oRequireStub.firstCall.args[1];

        // Act
        fnCallback();

        // Assert
        oPromise.then(function (oResult) {
            assert.strictEqual(this.oAdapterInstanceStub.callCount, 1, "The function _getAdapterInstance has been called once.");
            assert.strictEqual(this.oAdapterInstanceStub.firstCall.args[3], oAdapterConfig, "The correct reference has been found.");

            done();
        }.bind(this));
    });

    QUnit.module("The function _getAdapterInstance", {
        beforeEach: function () {
            this.oGetObjectStub = sinon.stub(jQuery.sap, "getObject");
        },
        afterEach: function () {
            this.oGetObjectStub.restore();
            this.oGetObjectStub = null;
        }
    });

    QUnit.test("Returns null if no adapter name is passed", function (assert) {
        // Arrange
        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance();

        // Assert
        assert.strictEqual(this.oGetObjectStub.callCount, 1, "The function jQuery.sap.getObject has been called once.");
        assert.strictEqual(oResult, null, "The correct value has been found.");
    });

    QUnit.test("Returns null if the adapter's constructor cannot be found", function (assert) {
        // Arrange
        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance("some.adapter.module");

        // Assert
        assert.strictEqual(this.oGetObjectStub.callCount, 1, "The function jQuery.sap.getObject has been called once.");
        assert.strictEqual(this.oGetObjectStub.firstCall.args[0], "some.adapter.module", "The function jQuery.sap.getObject has been called with the correct parameter.");
        assert.strictEqual(oResult, null, "The correct value has been found.");
    });

    QUnit.test("Creates an instance of the given module and returns it", function (assert) {
        // Arrange
        var oConstructor = sinon.stub();
        this.oGetObjectStub.returns(oConstructor);

        var oSystem = {};
        var oParameter = {};
        var oConfig = {};

        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance("some.adapter.name", oSystem, oParameter, oConfig);

        // Assert
        assert.strictEqual(oConstructor.callCount, 1, "The constructor function has been called once.");
        assert.strictEqual(oConstructor.firstCall.calledWithNew(), true, "The constructor function has been called with 'new'.");
        assert.strictEqual(oConstructor.firstCall.args[0], oSystem, "The constructor function has been called with the correct parameter.");
        assert.strictEqual(oConstructor.firstCall.args[1], oParameter, "The constructor function has been called with the correct parameter.");
        assert.deepEqual(oConstructor.firstCall.args[2], { config: oConfig }, "The constructor function has been called with the correct parameter.");
        assert.ok(oResult instanceof oConstructor, "The correct constructor has been used.");
    });

    QUnit.test("Uses a default config object if none is given", function (assert) {
        // Arrange
        var oConstructor = sinon.stub();
        this.oGetObjectStub.returns(oConstructor);

        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance();

        // Assert
        assert.strictEqual(oConstructor.callCount, 1, "The constructor function has been called once.");
        assert.strictEqual(oConstructor.firstCall.calledWithNew(), true, "The constructor function has been called with 'new'.");
        assert.notOk(oConstructor.firstCall.args[0], "The constructor function has been called with the correct parameter.");
        assert.notOk(oConstructor.firstCall.args[1], "The constructor function has been called with the correct parameter.");
        assert.deepEqual(oConstructor.firstCall.args[2], { config: {} }, "The constructor function has been called with the correct parameter.");
        assert.ok(oResult instanceof oConstructor, "The correct constructor has been used.");
    });
});
