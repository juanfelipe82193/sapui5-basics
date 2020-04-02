// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.load.ui5theme.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.load.ui5theme",
    "sap/ushell/bootstrap/common/common.boot.path",
    "jquery.sap.global"
], function (testUtils, fnLoadUI5Theme, bootPath, jQuery) {
    "use strict";
    /* global QUnit sinon */

    QUnit.module("sap.ushell.bootstrap.common.common.load.ui5theme", {
        setup: function () {
            sinon.stub(jQuery.sap.log, "error");
            sinon.stub(jQuery.sap, "includeStyleSheet");

            this.coreApplyThemeStub = sinon.stub();
            this.coreGetLanguageStub = sinon.stub();

            sinon.stub(sap.ui, "getCore").returns({
                applyTheme: this.coreApplyThemeStub,
                getConfiguration: sinon.stub().returns({
                    getLanguage: this.coreGetLanguageStub
                })
            });

            // save
            this._vOriginalSapUshellConfig = window["sap-ui-config"];
        },
        teardown: function () {
            testUtils.restoreSpies(
                jQuery.sap.log.error,
                jQuery.sap.includeStyleSheet,
                sap.ui.getCore
            );

            // restore
            window["sap-ui-config"] = this._vOriginalSapUshellConfig;
        }
    });

    [
        {
            testDescription: "theme is null",
            oTestTheme: null
        },
        {
            testDescription: "theme is empty string",
            oTestTheme: {
                theme: "",
                root: "root1"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("applyBootTheme: logs an error when " + oFixture.testDescription, function (assert) {

            // Act
            fnLoadUI5Theme(oFixture.oTestTheme);

            // Assert
            assert.strictEqual(this.coreApplyThemeStub.callCount, 0, "sap.ui.getCore().applyTheme was not called")
            assert.strictEqual(jQuery.sap.includeStyleSheet.callCount, 0, "jQuery.sap.includeStyleSheet was not called");
            assert.strictEqual(jQuery.sap.log.error.callCount, 1, "jQuery.sap.log.error was called 1 time");
            assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                "No boot theme could be applied", null, "common.load.ui5theme"
            ], "jQuery.sap.log.error was called with the expected arguments");
        });
    });

    [ // test w.r.t. window['sap-ui-config'].theme
        {
            testDescription: "there is no theme root and the same theme is specified in window['sap-ui-config'].theme",
            oTheme: {
                theme: "sap_belize",
                root: ""
            },
            oWindowSapUiConfig: {
                theme: "sap_belize"
            },
            expectedCoreApplyThemeCall: false
        },
        {
            testDescription: "there is no theme root and another theme is specified in window['sap-ui-config'].theme",
            oTheme: {
                theme: "sap_belize",  // this wins in the applyBootTheme call
                root: ""
            },
            oWindowSapUiConfig: {
                theme: "sap_belize_2"
            },
            expectedCoreApplyThemeCall: true,
            expectedCoreApplyThemeCalledWith: [ "sap_belize" ]
        }
    ].forEach(function (oFixture) {
        QUnit.test("applyBootTheme: does not call sap.ui.getCore().applyTheme() when " + oFixture.testDescription, function (assert) {
            // Arrange
            window["sap-ui-config"] = oFixture.oWindowSapUiConfig;

            this.coreGetLanguageStub.returns("en");

            // Act
            fnLoadUI5Theme(oFixture.oTheme);

            // Assert
            if (oFixture.expectedCoreApplyThemeCall) {
                assert.strictEqual(this.coreApplyThemeStub.callCount, 1, "sap.ui.getCore().applyTheme was called")
                assert.deepEqual(this.coreApplyThemeStub.getCall(0).args, oFixture.expectedCoreApplyThemeCalledWith,
                    "sap.ui.getCore().applyTheme was called with the expected arguments");
            } else {
                assert.strictEqual(this.coreApplyThemeStub.callCount, 0, "sap.ui.getCore().applyTheme was not called")
            }

            // includeStyleSheet should be always called
            assert.strictEqual(jQuery.sap.includeStyleSheet.callCount, 1, "jQuery.sap.includeStyleSheet was called");
        });
    });

    [
        {
            testDescription: "theme provided with root",
            oTestTheme: {
                theme: "sap_belize",
                root: "/root"
            },
            sCoreConfigLanguage: "en",
            aExpectedIncludeStylesheetCallArgs: [
                "/root/UI5/sap/fiori/themes/sap_belize/library.css",
                "sap-ui-theme-sap.fiori"
            ]
        },
        {
            testDescription: "theme provided without root",
            oTestTheme: {
                theme: "sap_belize",
                root: ""
            },
            sCoreConfigLanguage: "en",
            aExpectedIncludeStylesheetCallArgs: [
                bootPath + "/sap/fiori/themes/sap_belize/library.css",
                "sap-ui-theme-sap.fiori"
            ]
        },
        {
            testDescription: "theme provided with root and RTL language",
            oTestTheme: {
                theme: "sap_belize",
                root: "/root"
            },
            sCoreConfigLanguage: "he",
            aExpectedIncludeStylesheetCallArgs: [
                "/root/UI5/sap/fiori/themes/sap_belize/library-RTL.css",
                "sap-ui-theme-sap.fiori"
            ]
        },
        {
            testDescription: "theme provided with root and RTL language in InVeRtEd CaSe",
            oTestTheme: {
                theme: "sap_belize",
                root: "/root"
            },
            sCoreConfigLanguage: "hE",
            aExpectedIncludeStylesheetCallArgs: [
                "/root/UI5/sap/fiori/themes/sap_belize/library-RTL.css",
                "sap-ui-theme-sap.fiori"
            ]
        },
        {
            testDescription: "theme provided with root and lengthy RTL language",
            oTestTheme: {
                theme: "sap_belize",
                root: "/root"
            },
            sCoreConfigLanguage: "hebrew",
            aExpectedIncludeStylesheetCallArgs: [
                "/root/UI5/sap/fiori/themes/sap_belize/library-RTL.css",
                "sap-ui-theme-sap.fiori"
            ]
        }
    ].forEach(function (oFixture) {
        QUnit.test("applyBootTheme: calls includeStyleSheet when " + oFixture.testDescription, function (assert) {
            // Arrange
            this.coreGetLanguageStub.returns(oFixture.sCoreConfigLanguage);

            // Act
            fnLoadUI5Theme(oFixture.oTestTheme);

            // Assert
            assert.strictEqual(jQuery.sap.includeStyleSheet.callCount, 1,
                "jQuery.sap.includeStyleSheet was called 1 time");
            assert.deepEqual(jQuery.sap.includeStyleSheet.getCall(0).args, oFixture.aExpectedIncludeStylesheetCallArgs,
                "jQuery.sap.includeStyleSheet was called with the expected arguments");
        });

        QUnit.test("applyBootTheme: calls sap.ui.getCore().applyTheme as expected when " + oFixture.testDescription, function (assert) {
            // Arrange
            this.coreGetLanguageStub.returns(oFixture.sCoreConfigLanguage);

            // Act
            fnLoadUI5Theme(oFixture.oTestTheme);

            // Assert
            assert.strictEqual(this.coreApplyThemeStub.callCount, 1,
                "sap.ui.getCore().applyTheme was called one time");

            assert.strictEqual(this.coreApplyThemeStub.getCall(0).args[0], oFixture.oTestTheme.theme,
                "the expected theme was passed as the first argument of sap.ui.getCore().applyTheme");

            var sExpectedThemeRoot = oFixture.oTestTheme.root
                ? oFixture.oTestTheme.root  + "/UI5/"
                : undefined;

            assert.strictEqual(this.coreApplyThemeStub.getCall(0).args[1], sExpectedThemeRoot,
                "the expected root path was passed as the second argument of sap.ui.getCore().applyTheme");
        });
    });

});
