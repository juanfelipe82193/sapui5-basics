// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell_abap.adapters.abap.PagePersistence
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/NavigationDataProvider",
    "sap/ushell/resources"
], function (NavigationDataProvider, resources) {
    "use strict";

    QUnit.start();

    QUnit.module("NavigationDataProvider: _init");

    QUnit.test("is correctly called and sets the correct adapter", function (assert) {
        // Arrange
        var oTestAdapter = { foo: "bar" },
            oNavigationDataProvider,
            oInitSpy;

        // Act
        oInitSpy = sinon.spy(NavigationDataProvider.prototype, "_init");
        oNavigationDataProvider = new NavigationDataProvider(oTestAdapter);

        // Assert
        assert.deepEqual(oNavigationDataProvider.oAdapter, oTestAdapter, "Correct adapter was set");
        assert.ok(oInitSpy.called, "Init was called");
        assert.equal(oNavigationDataProvider.S_COMPONENT_NAME, "sap.ushell.services.NavigationDataProvider", "The component name is set correctly.");

        // Cleanup
        oInitSpy.restore();
    });

    QUnit.module("NavigationDataProvider: getNavigationData", {
        beforeEach: function () {
            this.oAdapterGetInboundsStub = sinon.stub();
            this.oAdapterSystemAliasesStub = sinon.stub();
            this.oResourcesI18nGetTextStub = sinon.stub(resources.i18n, "getText").returns("This is the translated error message.");
            this.oAdapter = {
                getInbounds: this.oAdapterGetInboundsStub,
                getSystemAliases: this.oAdapterSystemAliasesStub
            };
            this.oNavigationDataProvider = new NavigationDataProvider(this.oAdapter);
        },
        afterEach: function () {
            this.oResourcesI18nGetTextStub.restore();
        }
    });

    QUnit.test("calls the correct method on the adapter and returns the expected data", function (assert) {
        // Arrange
        var done = assert.async(),
            oTestData = {
                inbounds: [{ inbound: "SomeInbound" }],
                systemAliases: { alias: "SomeAlias" }
            };

        this.oAdapterGetInboundsStub.returns(new jQuery.Deferred().resolve(oTestData.inbounds).promise());
        this.oAdapterSystemAliasesStub.returns(oTestData.systemAliases);

        // Act & Assert
        this.oNavigationDataProvider.getNavigationData()
            .then(function (result) {
                assert.ok(this.oAdapterGetInboundsStub.called, "ClientSideTargetResolutionAdapter.getInbounds was called");
                assert.ok(this.oAdapterSystemAliasesStub.called, "ClientSideTargetResolutionAdapter.getSystemAliases was called");
                assert.deepEqual(result, oTestData, "Expected data was returned");
            }.bind(this))
            .catch(function (err) {
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });

    QUnit.test("doesn't throw when the adapter does not implement getSystemAliases and returns the expected data", function (assert) {
        // Arrange
        var done = assert.async(),
            oExpectedData = {
                inbounds: undefined,
                systemAliases: {}
            };

        this.oAdapterGetInboundsStub.returns(new jQuery.Deferred().resolve().promise());
        // Act & Assert
        this.oNavigationDataProvider.getNavigationData()
            .then(function (navigationData) {
                assert.ok(true, "Promise was resolved");
                assert.deepEqual(navigationData, oExpectedData, "Expected data was returned");
            })
            .catch(function () {
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });

    QUnit.test("rejects the promise when getInbounds fails", function (assert) {
        // Arrange
        var done = assert.async(),
            oTestError = {
                code: 1,
                text: "Some Error"
            },
            oExpectedResult = {
                "component": "sap.ushell.services.NavigationDataProvider",
                "description": "This is the translated error message.",
                "detail": {
                    "code": 1,
                    "text": "Some Error"
                }
            };

        this.oAdapterGetInboundsStub.returns(new jQuery.Deferred().reject(oTestError).promise());

        // Act & Assert
        this.oNavigationDataProvider.getNavigationData()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (error) {
                assert.deepEqual(error, oExpectedResult, "Expected error provided");
                assert.ok(this.oResourcesI18nGetTextStub.calledOnce, "The getText of resource.i18n is called once");
                assert.deepEqual(this.oResourcesI18nGetTextStub.getCall(0).args, ["NavigationDataProvider.CannotLoadData"], "The getText of resource.i18n is called with correct parameters");
            })
            .finally(function () {
                done();
            });
    });
});
