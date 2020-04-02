// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.HeaderManager
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/m/Page",
    "sap/ushell/ui/AppContainer"
], function (jQuery, Page, AppContainer) {
    "use strict";

    /* global QUnit */
    QUnit.config.reorder = false;

    var oAppContainer;
    var oPage1, oPage2;

    // Stub the logic of home component id finding
    var oContainer = jQuery.sap.getObject("sap.ushell.Container", 0);
    oContainer.getRenderer = function() {
        return {
            byId: function (id) {
                return {
                    getId: function () {
                        return id;
                    }
                };
            }
        };
    }

    QUnit.module("AppContainer test", {
        before: function (assert) {
            var done = assert.async();
            var delegate = {
                onAfterRendering: function () {
                    oAppContainer.removeDelegate(delegate);
                    done();
                }
            };
            oPage1 = new Page("home-page", {title: "Home"});
            oAppContainer = new AppContainer("vewPortContainer", {pages: oPage1});
            oAppContainer.navTo("centerViewPort", "home-page");
            oAppContainer.addEventDelegate(delegate);
            oAppContainer.placeAt("app-container");
        },
        after: function () {
            oAppContainer.destroy();
        }
    });

    QUnit.test("Rendering", function (assert) {
        assert.ok(oAppContainer.$().width() > 0, "AppContainer is visible");
        assert.ok(oPage1.$().width() > 0, "AppContainer home page is visible");
        assert.strictEqual(oAppContainer.getCurrentCenterPage(), oPage1.getId(), "Page 1 is the current center page");
    });

    QUnit.test("Add page", function (assert) {
        var done = assert.async();
        oPage2 = new Page("second-page", {title: "Application"});
        var delegate = {
            onAfterRendering: function () {
                oPage2.removeDelegate(delegate);
                assert.ok(oPage2.$().length > 0, "Page 2 is rendered");
                assert.ok(oPage2.$().is(":visible") == false, "Page 2 is not visible");
                done();
            }
        };
        oPage2.addEventDelegate(delegate);
        oAppContainer.addCenterViewPort(oPage2);
    });

    QUnit.test("Navigate to second page", function (assert) {
        var done = assert.async();
        var onAfterNavigate = function (oEvent) {
            oAppContainer.detachAfterNavigate(onAfterNavigate);
            assert.strictEqual(oEvent.getParameter("fromId"), "home-page", "Navigation event fromId OK");
            assert.strictEqual(oEvent.getParameter("toId"), "second-page", "Navigation event toId OK");
            done();
        };
        oAppContainer.attachAfterNavigate(onAfterNavigate);

        oAppContainer.navTo("centerViewPort", "second-page");
        assert.ok(oPage2.$().is(":visible") == true, "Page 2 is visible");
        assert.ok(oPage1.$().is(":visible") == false, "Page 1 is not visible");
        assert.strictEqual(oAppContainer.getCurrentCenterPage(), oPage2.getId(), "Page 2 is the current center page");
    });

    QUnit.test("Navigate back", function (assert) {
        var done = assert.async();
        var onAfterNavigate = function (oEvent) {
            oAppContainer.detachAfterNavigate(onAfterNavigate);
            assert.strictEqual(oEvent.getParameter("toId"), "home-page", "Navigation event toId OK");
            assert.strictEqual(oEvent.getParameter("fromId"), "second-page", "Navigation event fromId OK");
            done();
        };
        oAppContainer.attachAfterNavigate(onAfterNavigate);

        oAppContainer.navTo("centerViewPort", "home-page");
        assert.ok(oPage2.$().is(":visible") == false, "Page 2 is not visible");
        assert.ok(oPage1.$().is(":visible") == true, "Page 1 is visible");
        assert.strictEqual(oAppContainer.getCurrentCenterPage(), oPage1.getId(), "Page 1 is the current center page");
    });

    QUnit.test("Delete second page", function (assert) {
        oAppContainer.removeCenterViewPort("second-page");
        assert.strictEqual(oAppContainer.getPages().length, 1, "Page 2 was removed");
    });
});
