// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.userImage.userImage
 */
(function () {
    "use strict";

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ui.core.Icon");
    jQuery.sap.require("sap.m.Image");
    jQuery.sap.require("sap.ushell.ui.launchpad.AccessibilityCustomData");
    jQuery.sap.require("sap.ushell.resources");
    var EventHub = sap.ui.requireSync("sap/ushell/EventHub");
    var HeaderManager = sap.ui.requireSync("sap/ushell/components/HeaderManager");
    var AppLifeCycle = sap.ui.requireSync("sap/ushell/components/applicationIntegration/AppLifeCycle");

    var oController;
    var oRenderer;


    function createViewWithUserImgConsent() {

        var oView = sap.ui.view("meArea", {
            viewName: "sap.ushell.components.shell.shell.userImage",
            type: 'JS',
            viewData: { config: { enableUserImgConsent: true } }
        });
        oController = oView.getController();
        return oView;
    }

    function createViewWithRecentActivitiesDisabled() {
        var oView = sap.ui.view("meArea", {
            viewName: "sap.ushell.components.shell.MeArea.MeArea",
            type: 'JS',
            viewData: { config: { enableRecentActivity: false } }
        });
        oController = oView.getController();
        return oView;
    }

    function createViewWithRecentActivitiesEnabled() {
        var oView = sap.ui.view("meArea", {
            viewName: "sap.ushell.components.shell.MeArea.MeArea",
            type: 'JS',
            viewData: { config: { enableRecentActivity: true } }
        });
        oController = oView.getController();
        return oView;
    }

    function createView() {
        var oView = sap.ui.view("meArea", {
            viewName: "sap.ushell.components.shell.MeArea.MeArea",
            type: 'JS',
            viewData: {}
        });
        oController = oView.getController();
        return oView;
    }

    module("sap.ushell.components.shell.userImage", {
        setup: function () {
            var oApplicationModel = AppLifeCycle.shellElements().model();
            HeaderManager.init({}, oApplicationModel);
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            HeaderManager.destroy();
            if (oController) {
                oController.destroy();
            }
            oRenderer.destroy();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });

    test("load Component", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap('local').then(function () {
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            jQuery.sap.require("sap.ushell.components.shell.UserImage.Component");
            var x = new sap.ushell.components.shell.UserImage.Component;
            ok(true);
            done();
        });
    })

    test("feature is off", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            renderers: { fiori2: { componentData: { config: { enableUserImgConsent: false } } } },
            services: {
                Container: {
                    adapter: {
                        config: {
                            isImageConsent: true,
                            image: ""
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local").then(function () {
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            jQuery.sap.require("sap.ushell.components.shell.UserImage.Component");
            var x = new sap.ushell.components.shell.UserImage.Component;
            var userStateChanged = sinon.stub(x, "_showUserConsentPopup");
            ok(userStateChanged.notCalled, 'switch user state is called once');
            done();
        });
    })
}());
