// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
sap.ui.require([
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ushell/ui5service/UserStatus"
], function (ServiceFactoryRegistry, UserStatus) {
    "use strict";
    /* global QUnit */

    QUnit.module("sap.ushell.ui5service.UserStatus constructor", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oUserStatusService = new UserStatus({
                scopeObject: { fake: "component" },
                scopeType: "component"
            });
            ServiceFactoryRegistry.get("sap.ushell.ui5service.UserStatus").createInstance()
                .then(function (oInstance) {
                    this.oInstance = oInstance;
                    done();
                }.bind(this));
        },

        afterEach: function () {
            this.oInstance.destroy();
            this.oUserStatusService.destroy();
        }
    });

    QUnit.test("Constructs the service as expected", function (assert) {
        assert.ok(this.oUserStatusService instanceof sap.ushell.ui5service.UserStatus, "Got instance of sap.ushell.ui5service.UserStatus");
        assert.ok(this.oInstance, "Service has been instantiated");
    });

    QUnit.test("setEnabled is mocked", function (assert) {
        assert.notOk(this.oInstance.isEnabled, "userStatus is initially disabled");
        this.oInstance.setEnabled(true);
        assert.ok(this.oInstance.isEnabled, "userStatus was enabled");
        this.oInstance.setEnabled(false);
        assert.notOk(this.oInstance.isEnabled, "userStatus was disabled");
    });

    QUnit.test("setStatus throws error if userStatus is not enabled", function (assert) {
        assert.throws(function () {
                this.oInstance.setStatus("AVAILABLE");
        }.bind(this), Error, "Error is thrown when trying to set the userStatus");
    });

    QUnit.test("setStatus throws error if status to set is invalid", function (assert) {
        this.oInstance.setEnabled(true);
        assert.throws(function () {
                this.oInstance.setStatus("invalid status");
        }.bind(this), Error, "Error is thrown when trying to set an invalid userStatus");
    });

    QUnit.test("attachStatusChanged works properly", function (assert) {
        this.oInstance.attachStatusChanged(function () {
            assert.ok(true, "attachStatusChanged function was called");
        });
        this.oInstance.setEnabled(true);
        this.oInstance.setStatus("AVAILABLE");
    });

    QUnit.test("detachStatusChanged works properly", function (assert) {
        assert.expect(0);
        var fnCallback = function () {
            assert.ok(false, "attachStatusChanged function was called");
        };
        this.oInstance.attachStatusChanged(fnCallback);
        this.oInstance.detachStatusChanged(fnCallback);
        this.oInstance.setEnabled(true);
        this.oInstance.setStatus("AVAILABLE");
    });
});