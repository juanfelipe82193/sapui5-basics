// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/ushell/appRuntime/ui5/AppRuntime",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/ui/footerbar/JamShareButton",
    "sap/ushell/resources"
], function (AppRuntime, AppCommunicationMgr, AppRuntimeService, JamShareButton) {
    "use strict";
    /* global module, ok, test, sinon, asyncTest, start*/

    module("sap.ushell.ui.footerbar.JamShareButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
        }
    });

    test("Constructor Test", function () {
        var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton();
        ok(jamShareButton.getIcon() === "sap-icon://share-2", "Check button icon");
        ok(jamShareButton.getText("text") === sap.ushell.resources.i18n.getText("shareBtn"), "Check button title");
    });


    test("showShareDialog Test", function () {
        var settingsData = {};

        var SharingDialogComponent = sap.ui.require("sap/collaboration/components/fiori/sharing/dialog/Component");

        var oSandBox = sinon.sandbox.create();

        oSandBox.stub(SharingDialogComponent.prototype, "createContent", function () {});
        oSandBox.stub(SharingDialogComponent.prototype, "setSettings", function (settingObject) {
            settingsData = settingObject.object;
        });
        oSandBox.stub(SharingDialogComponent.prototype, "open", function () {});

        var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test title"}),
                    share: "sharing"
                }
            }
        });

        //Show the dialog
        jamShareButton.showShareDialog();
        ok(settingsData.id === window.location.href, "Check id");
        ok(settingsData.display.getText() === "Test title", "Check display title");
        ok(settingsData.share === "sharing", "Check share");
        oSandBox.restore();
    });

    asyncTest("showShareDialog in cFLP Test", function () {
        var settingsData = {};

        var SharingDialogComponent = sap.ui.require("sap/collaboration/components/fiori/sharing/dialog/Component");

        var oSandBox = sinon.sandbox.create();

        oSandBox.stub(SharingDialogComponent.prototype, "createContent", function () {});
        oSandBox.stub(SharingDialogComponent.prototype, "setSettings", function (settingObject) {
            settingsData = settingObject.object;
        });

        var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test title"}),
                    share: "sharing"
                }
            }
        });

        sinon.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
            new jQuery.Deferred().resolve("www.flp.com").promise()
        );

        sap.ushell.Container = {
            runningInIframe: sinon.stub().returns(true),
            getFLPUrl: function (bIncludeHash) {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.Container.getFLPUrl", {
                        "bIncludeHash": bIncludeHash
                    });
            }
        };

        var getFLPUrlStub = sinon.spy(sap.ushell.Container, "getFLPUrl");

        oSandBox.stub(SharingDialogComponent.prototype, "open", function () {
            ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            ok(getFLPUrlStub.calledOnce, "getFLPUrl should be called only once");
            ok(settingsData.id === "www.flp.com", "Check id");
            ok(settingsData.display.getText() === "Test title", "Check display title");
            ok(settingsData.share === "sharing", "Check share");
            start();
            AppRuntimeService.sendMessageToOuterShell.restore();
            getFLPUrlStub.restore();
            delete sap.ushell.Container;
            oSandBox.restore();
        });

        //Show the dialog
        jamShareButton.showShareDialog();
    });

    asyncTest("adjustFLPUrl", function (assert) {
        var jamShareButton = new JamShareButton();

        sinon.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
                new jQuery.Deferred().resolve("www.flp.com").promise()
            );

        sap.ushell.Container = {
            getFLPUrl: function (bIncludeHash) {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.Container.getFLPUrl", {
                        "bIncludeHash": bIncludeHash
                    });
            }
        };

        var jamData = {
                object: {
                    id: window.location.href,
                    share: "static text to share in JAM together with the URL"
                }
            },
            getFLPUrlStub = sinon.spy(sap.ushell.Container, "getFLPUrl");

        jamShareButton.adjustFLPUrl(jamData).then(function () {
            assert.ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            assert.ok(getFLPUrlStub.calledOnce, "getFLPUrl should be called only once");
            assert.ok(jamData.object.id === "www.flp.com");
            assert.ok(jamData.object.share === "static text to share in JAM together with the URL");
            start();
            AppRuntimeService.sendMessageToOuterShell.restore();
            getFLPUrlStub.restore();
            delete sap.ushell.Container;
        });
    });
});
