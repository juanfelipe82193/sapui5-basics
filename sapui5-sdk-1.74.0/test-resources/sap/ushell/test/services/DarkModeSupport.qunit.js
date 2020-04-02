// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.DarkModeSupport
 */
sap.ui.require([
    "sap/base/util/UriParameters",
    "sap/ushell/services/DarkModeSupport",
    "sap/ushell/Config"
], function (UriParameters, DarkModeSupport, Config) {
    "use strict";
    /* global QUnit sinon */

    QUnit.module("sap.ushell.services.DarkModeSupport", function (hooks) {

        var oDarkModeSupportService;
        var sUserTheme;
        var oUser = {
            getTheme: function () {
                return sUserTheme;
            },
            applyTheme: sinon.spy()
        };


        QUnit.module("Methods", {
            beforeEach: function () {
                oDarkModeSupportService = new DarkModeSupport();
                sap.ushell = sap.ushell || {};
                sap.ushell.Container = sap.ushell.Container || {};
                sap.ushell.Container.getUser = function () {
                    return oUser;
                };

            },
            afterEach: function () {
                oDarkModeSupportService.destroy();
                oDarkModeSupportService = null;
                oUser.applyTheme = sinon.spy();
            }
        });

        QUnit.test("init returns instance of DarkModeSupport", function (assert) {
            assert.ok(oDarkModeSupportService instanceof DarkModeSupport, "instance returned");
        });

        QUnit.test("canAutomaticallyToggleDarkMode: check if prefers-color-scheme supported", function (assert) {
            var oMatchMediaStub = sinon.stub(window, "matchMedia");
            oMatchMediaStub.onFirstCall().returns({
                media: "not all"
            })
            .onSecondCall().returns({
                media: "(prefers-color-scheme: dark)"
            });
            var notSupportedMedia = new DarkModeSupport();
            var supportedMedia = new DarkModeSupport();

            assert.equal(notSupportedMedia.canAutomaticallyToggleDarkMode(), false, "canAutomaticallyToggleDarkMode is false when prefers-color-scheme not supported");
            assert.equal(supportedMedia.canAutomaticallyToggleDarkMode(), true, "canAutomaticallyToggleDarkMode is true when prefers-color-scheme not supported");

            oMatchMediaStub.restore();
            notSupportedMedia.destroy();
            supportedMedia.destroy();
        });

        QUnit.test("setup is singleton", function (assert) {
            var oAttachThemeChangeStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");

            oDarkModeSupportService.setup();
            assert.ok(oAttachThemeChangeStub.calledOnce, "themeChangedCallback should be attached during setup");
            assert.ok(oDarkModeSupportService.initialized, "initialized property should be set to true");

            oDarkModeSupportService.setup();
            assert.ok(oAttachThemeChangeStub.calledOnce, "themeChangedCallback should be attached during setup only once");

            oAttachThemeChangeStub.restore();
        });

        QUnit.test("don't handle system listener if prefers-color-scheme is not supported", function (assert) {
            oDarkModeSupportService.darkMediaQueryList = {
                media: "not all",
                addListener: sinon.spy()
            };

            var oToggleSystemColorMethodSpy = sinon.spy(oDarkModeSupportService, "_toggleDarkModeBasedOnSystemColorScheme");

            oDarkModeSupportService.setup();
            assert.ok(oDarkModeSupportService.darkMediaQueryList.addListener.notCalled, "Not add listener if prefers-color-scheme is not supported");
            assert.ok(oToggleSystemColorMethodSpy.notCalled, "don't handle system theme if prefers-color-scheme is not supported");

            oToggleSystemColorMethodSpy.restore();
        });

        QUnit.test("don't handle system listener if sap-theme is set in the url", function (assert) {
            oDarkModeSupportService.darkMediaQueryList = {
                media: "(prefers-color-scheme: dark)",
                addListener: sinon.spy()
            };

            var oToggleSystemColorMethodSpy = sinon.spy(oDarkModeSupportService, "_toggleDarkModeBasedOnSystemColorScheme");
            var oUriParametersStub = sinon.stub(UriParameters, "fromURL").returns({
                has: function () {
                    return true;
                }
            });

            oDarkModeSupportService.setup();
            assert.ok(oDarkModeSupportService.darkMediaQueryList.addListener.notCalled, "Not add listener if prefers-color-scheme is not supported");
            assert.ok(oToggleSystemColorMethodSpy.notCalled, "don't handle system theme if prefers-color-scheme is not supported");

            oToggleSystemColorMethodSpy.restore();
            oUriParametersStub.restore();
        });

        QUnit.test("add system listener if prefers-color-scheme is supported", function (assert) {
            oDarkModeSupportService.darkMediaQueryList = {
                media: "(prefers-color-scheme: dark)",
                addListener: sinon.spy(),
                removeListener: sinon.spy()
            };

            var oToggleSystemColorMethodSpy = sinon.spy(oDarkModeSupportService, "_toggleDarkModeBasedOnSystemColorScheme");

            oDarkModeSupportService.setup();
            assert.ok(oDarkModeSupportService.darkMediaQueryList.addListener.calledOnce, "Not add listener if prefers-color-scheme is not supported");
            assert.ok(oToggleSystemColorMethodSpy.calledOnce, "don't handle system theme if prefers-color-scheme is not supported");

            oToggleSystemColorMethodSpy.restore();
        });

        QUnit.test("attachModeChanged called correctly", function (assert) {
            var fnDone = assert.async();
            var oCallback = sinon.spy();

            oDarkModeSupportService.attachModeChanged(oCallback);
            oDarkModeSupportService.channel.emit("/mode", "test");

            setTimeout(function () {
                assert.ok(oCallback.calledOnce, "Attached listener called once");
                assert.equal(oCallback.getCall(0).args[0], "test", "Listemer called with correct arguments");

                fnDone();
            }, 50);
        });

        QUnit.test("toggleModeChange don't apply new theme, if theme pair was not found", function (assert) {
            var oConfigStub = sinon.stub(Config, "last").returns([{
                light: "lightTheme",
                dark: "darkTheme"
            }]);
            sinon.stub(oDarkModeSupportService, "_getCurrentTheme").returns("someTestTheme");


            oDarkModeSupportService.toggleModeChange();
            assert.ok(oUser.applyTheme.notCalled, "apply theme was not called, because theme pair was not found");
            oConfigStub.restore();
        });

        QUnit.test("toggleModeChange change from light theme to dark", function (assert) {
            var oThemePair = {
                light: "lightTheme",
                dark: "darkTheme"
            };
            var oConfigStub = sinon.stub(Config, "last").returns([oThemePair]);
            sinon.stub(oDarkModeSupportService, "_getCurrentTheme").returns("lightTheme");


            oDarkModeSupportService.toggleModeChange();
            assert.ok(oUser.applyTheme.calledOnce, "apply theme was called");
            assert.deepEqual(oUser.applyTheme.getCall(0).args, ["darkTheme"], "the dark theme should be applied");
            oConfigStub.restore();
        });

        QUnit.test("toggleModeChange change from dark theme to light", function (assert) {
            var oThemePair = {
                light: "lightTheme",
                dark: "darkTheme"
            };

            var oConfigStub = sinon.stub(Config, "last").returns([oThemePair]);
            sinon.stub(oDarkModeSupportService, "_getCurrentTheme").returns("darkTheme");


            oDarkModeSupportService.toggleModeChange();
            assert.ok(oUser.applyTheme.calledOnce, "apply theme was called");
            assert.deepEqual(oUser.applyTheme.getCall(0).args, ["lightTheme"], "the light theme mode should be applied");
            oConfigStub.restore();
        });

        QUnit.test("toggleDarkModeBasedOnSystemColorScheme change from light theme to dark", function (assert) {
            var oThemePair = {
                light: "lightTheme",
                dark: "darkTheme"
            };

            var oConfigStub = sinon.stub(Config, "last").returns([oThemePair]);
            sinon.stub(oDarkModeSupportService, "_getCurrentTheme").returns("lightTheme");
            oDarkModeSupportService.darkMediaQueryList = {
                matches: true
            };

            oDarkModeSupportService._toggleDarkModeBasedOnSystemColorScheme();
            assert.ok(oUser.applyTheme.calledOnce, "apply theme was called");
            assert.deepEqual(oUser.applyTheme.getCall(0).args, ["darkTheme"], "the dark theme should be applied");
            oConfigStub.restore();
        });

        QUnit.test("toggleDarkModeBasedOnSystemColorScheme change from dark theme to light", function (assert) {
            var oThemePair = {
                light: "lightTheme",
                dark: "darkTheme"
            };

            var oConfigStub = sinon.stub(Config, "last").returns([oThemePair]);
            sinon.stub(oDarkModeSupportService, "_getCurrentTheme").returns("darkTheme");
            oDarkModeSupportService.darkMediaQueryList = {
                matches: false
            };

            oDarkModeSupportService._toggleDarkModeBasedOnSystemColorScheme();
            assert.ok(oUser.applyTheme.calledOnce, "apply theme was called");
            assert.deepEqual(oUser.applyTheme.getCall(0).args, ["lightTheme"], "the light theme should be applied");
            oConfigStub.restore();
        });



    });
});