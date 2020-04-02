// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.Component
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/Component",
    "sap/ushell/EventHub",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/resources"
], function (PagesComponent, EventHub, SharedComponentUtils, resources) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oEventHubEmitStub = sinon.stub(EventHub, "emit");
            this.oToggleUserActivityLogStub = sinon.stub(SharedComponentUtils, "toggleUserActivityLog");
            this.oGetEffectiveHomepageSettingStub = sinon.stub(SharedComponentUtils, "getEffectiveHomepageSetting");
        },
        afterEach: function () {
            this.oEventHubEmitStub.restore();
            this.oToggleUserActivityLogStub.restore();
            this.oGetEffectiveHomepageSettingStub.restore();
        }
    });

    QUnit.test("Emits the PageRuntimeRendered event of the EventHub", function (assert) {
        // Act
        new PagesComponent(); // eslint-disable-line no-new

        // Assert
        assert.deepEqual(this.oEventHubEmitStub.firstCall.args, ["PagesRuntimeRendered"], "The init function emit the PagesRuntimeRendered event.");
    });

    QUnit.test("Toggles user activity log", function (assert) {
        // Act
        new PagesComponent(); // eslint-disable-line no-new

        // Assert
        assert.deepEqual(this.oToggleUserActivityLogStub.callCount, 1, "The function toggleUserActivityLog of the SharedComponentUtils is called once.");
    });

    QUnit.test("Gets the effective homepage settings", function (assert) {
        // Act
        new PagesComponent(); // eslint-disable-line no-new

        // Assert
        assert.deepEqual(this.oGetEffectiveHomepageSettingStub.firstCall.args, ["/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable"], "The function getEffectiveHomepageSetting of the SharedComponentUtils is called with the right parameters.");
    });

    QUnit.test("Sets the i18n model", function (assert) {
        // Act
        var oComponent = new PagesComponent();

        // Assert
        assert.strictEqual(oComponent.getModel("i18n"), resources.i18nModel, "The i18n model is set correctly.");
        oComponent.destroy();
    });

    QUnit.module("The getComponentData function", {
        beforeEach: function () {
            this.oPagesComponent = new PagesComponent();
        },
        afterEach: function () {
            this.oPagesComponent.destroy()
        }
    });

    QUnit.test("Always returns an empty object", function (assert) {
        // Act
        var oComponentData = this.oPagesComponent.getComponentData();

        // Assert
        assert.deepEqual(oComponentData, {}, "The function getComponentData returns an empty object.");
    });
});
