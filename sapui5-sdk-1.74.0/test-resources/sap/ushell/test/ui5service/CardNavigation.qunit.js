// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui5services.CardNavigation
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/ui5service/CardNavigation",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/services/AppType",
    "sap/ushell/ui/QuickAccess"
],
function (jQuery, CardNavigation, EventHub, UI5Log, Config, AppType, QuickAccess) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oGetServiceStub = sinon.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };
            this.oCardNavigation = new CardNavigation();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Retrieves the CrossApplicationNavigationService", function (assert) {
        assert.strictEqual(this.oGetServiceStub.callCount, 1, "The function getService gets called once.");
        assert.ok(this.oGetServiceStub.calledWithExactly("CrossApplicationNavigation"),
            "The function getService is called with the correct parameter.");
    });

    QUnit.module("The function navigate", {
        beforeEach: function () {
            this.oToExternalStub = sinon.stub();
            this.oEventHubStub = sinon.stub(EventHub, "emit");
            this.oWindowOpenStub = sinon.stub(window, "open");
            this.oLogRecentActivitySpy = sinon.spy();
            this.oConfigStub = sinon.stub(Config, "last");
            sap.ushell.Container = {
                getService: function () {
                    return { toExternal: this.oToExternalStub };
                }.bind(this),
                getRenderer: function () {
                    return {
                        logRecentActivity: this.oLogRecentActivitySpy
                    };
                }.bind(this)
            };
            this.oCardNavigation = new CardNavigation();
        },
        afterEach: function () {
            this.oEventHubStub.restore();
            this.oWindowOpenStub.restore();
            this.oConfigStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Emits event 'openRecentActivity' if oParameters.openUI === 'RecentActivities'", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oQuickAccessStub = sinon.stub(QuickAccess, "openQuickAccessDialog");
        // Act
        this.oCardNavigation.navigate({
            parameters: {
                openUI: "RecentActivities"
            }
        });

        // Assert
        setTimeout(function () {
            assert.equal(oQuickAccessStub.callCount, 1, "openQuickAccessDialog is called once.");
            assert.equal(oQuickAccessStub.firstCall.args[0], "recentActivityFilter",
                "openQuickAccessDialog is called with correct parameter.");
            oQuickAccessStub.restore();
            fnDone();
        }, 50);
    });

    QUnit.test("Emits event 'openFrequentlyUsed' if oParameters.openUI === 'FrequentActivities'", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oQuickAccessStub = sinon.stub(QuickAccess, "openQuickAccessDialog");

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                openUI: "FrequentActivities"
            }
        });

        // Assert
        setTimeout(function () {
            assert.equal(oQuickAccessStub.callCount, 1, "openQuickAccessDialog is called once.");
            assert.equal(oQuickAccessStub.firstCall.args[0], "frequentlyUsedFilter",
                "openQuickAccessDialog is called with correct parameter.");
            oQuickAccessStub.restore();
            fnDone();
        }, 50);

    });

    QUnit.test("Logs error message", function (assert) {
        // Arrange
        this.oUI5LogErrorStub = sinon.stub(UI5Log, "error");

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                openUI: "foo"
            }
        });

        // Assert
        assert.equal(this.oUI5LogErrorStub.callCount, 1, "UI5Log.error() is called once.");
        assert.equal(this.oUI5LogErrorStub.firstCall.args[0], "Request to open unknown User Interface: 'foo'",
            "The error message is logged.");
    });

    QUnit.test("Opens the provided URL in a new browser tab instead of executing an internal navigation", function (assert) {
        // Arrange
        this.oConfigStub.returns(false);

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                title: "SAP",
                url: "https://sap.com"
            }
        });

        // Assert
        assert.ok(this.oWindowOpenStub.calledWithExactly("https://sap.com", "_blank"),
            "The function window.open() gets called with the right parameters.");
    });

    QUnit.test("Logs the recent activity before opening a new browser tab", function (assert) {
        // Arrange
        this.oConfigStub.returns(true);
        var oExpectedParam = {
            title: "SAP",
            url: "https://sap.com",
            appType: AppType.URL,
            appId: "https://sap.com"
        };

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                title: "SAP",
                url: "https://sap.com"
            }
        });

        // Assert
        assert.strictEqual(this.oLogRecentActivitySpy.callCount, 1, "The function logRecentActivity gets called once.");
        assert.deepEqual(this.oLogRecentActivitySpy.args[0][0], oExpectedParam,
            "The function logRecentActivity gets called with the right parameters.");
        assert.ok(this.oWindowOpenStub.calledWithExactly("https://sap.com", "_blank"),
            "The function window.open() gets called with the right parameters.");
    });

    QUnit.test("Does not log the recent activity before opening a new browser tab when 'enableRecentActivity' or " +
            "'enableRecentActivityLogging' is disabled", function (assert) {
        // Arrange
        this.oConfigStub.returns(false);

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                title: "SAP",
                url: "https://sap.com"
            }
        });

        // Assert
        assert.strictEqual(this.oLogRecentActivitySpy.callCount, 0, "The function logRecentActivity gets called once.");
        assert.ok(this.oWindowOpenStub.calledWithExactly("https://sap.com", "_blank"),
            "The function window.open() gets called with the right parameters.");
    });

    QUnit.test("Calls the function 'toExternal' of the CrossApplicationNavigationService with the correct parameters if " +
            "an intent is provided", function (assert) {
        // Arrange
        var oExpectedParam = {
            target: { semanticObject: "semanticObject", action: "action" },
            params: { key: "value" },
            appSpecificRoute: undefined
        };

        // Act
        this.oCardNavigation.navigate({
            parameters: {
                intentSemanticObject: "semanticObject",
                intentAction: "action",
                intentParameters: { key: "value" }
            }
        });

        // Assert
        assert.strictEqual(this.oToExternalStub.callCount, 1, "The function toExternal gets called once.");
        assert.ok(this.oToExternalStub.calledWithExactly(oExpectedParam), "The function toExternal gets called with the right parameters.");
    });

    QUnit.module("The function enabled", {
        beforeEach: function () {
            var oPromise = jQuery.Deferred().resolve([{ supported: true }]).promise();
            this.oIsNavigationSupportedStub = sinon.stub();
            this.oConfigLastStub = sinon.stub(Config, "last").returns(false);
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isNavigationSupported: this.oIsNavigationSupportedStub.returns(oPromise)
                    };
                }.bind(this)
            };
            this.oCardNavigation = new CardNavigation();
            this.oContext = {
                parameters: {
                    intentSemanticObject: "semanticObject",
                    intentAction: "action",
                    intentParameters: { key: "value" }
                }
            };
        },
        afterEach: function () {
            this.oConfigLastStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns a promise containing true if the config openUI==='RecentActivities'", function (assert) {
        this.oConfigLastStub.returns(true);
        return this.oCardNavigation.enabled({
            parameters: {
                openUI: "RecentActivities"
            }
        }).then(function (enabled) {
            assert.strictEqual(enabled, true, "The function enabled returns a promise containing true.");
        });
    });

    QUnit.test("Returns a promise containing true if the config openUI==='FrequentActivities'", function (assert) {
        this.oConfigLastStub.returns(true);
        return this.oCardNavigation.enabled({
            parameters: {
                openUI: "FrequentActivities"
            }
        }).then(function (enabled) {
            assert.strictEqual(enabled, true, "The function enabled returns a promise containing true.");
        });
    });

    QUnit.test("Returns a promise containing false if openUI is not'FrequentActivities' or 'RecentActivities'", function (assert) {
        return this.oCardNavigation.enabled({
            parameters: {
                openUI: "foo"
            }
        }).then(function (enabled) {
            assert.strictEqual(enabled, false, "The function enabled returns a promise containing false.");
        });
    });

    QUnit.test("Returns a promise containing true if navigation is supported", function (assert) {
        return this.oCardNavigation.enabled(this.oContext).then(function (enabled) {
            assert.strictEqual(enabled, true, "The function enabled returns a promise containing true.");
        });
    });

    QUnit.test("Calls the function 'isNavigationSupported' of the CrossApplicationNavigationService with the correct parameters",
            function (assert) {
        // Arrange
        var oExpectedParam = [{
            target: { semanticObject: "semanticObject", action: "action" },
            params: { key: "value" }
        }];

        // Act
        this.oCardNavigation.enabled(this.oContext);

        // Assert
        assert.strictEqual(this.oIsNavigationSupportedStub.callCount, 1, "The function isNavigationSupported gets called once.");
        assert.ok(this.oIsNavigationSupportedStub.calledWithExactly(oExpectedParam),
            "The function isNavigationSupported gets called with the right parameters.");
    });
});
