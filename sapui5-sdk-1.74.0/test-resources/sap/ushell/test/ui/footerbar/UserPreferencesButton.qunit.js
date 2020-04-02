// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */

sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/EventHub",
    "sap/ushell/services/Container",
    "sap/ushell/ui/footerbar/UserPreferencesButton",
    "sap/ushell/shells/demo/fioriDemoConfig"
],function (testUtils, EventHub, Container, UserPreferencesButton) {
    /* eslint-disable */ // TBD: make ESLint conform
    /* module, ok, test, jQuery, sap, asyncTest */

    "use strict";

    /*
     * Stub heavy dependencies that are not needed for the test itself.
     *
     * The test is failing in the infrastructure due to timeout, so we stub
     * away dependencies and avoid network activity.
     */
    sap.ui.define("sap/ui/comp/smartform/SmartForm", function () { });
    sap.ui.define("sap/ui/model/odata/ODataModel", function () { });
    sap.ui.define("sap/ui/comp/smartfield/SmartField", function () { });
    sap.ui.define("sap/ui/comp/valuehelpdialog/ValueHelpDialog", function () {});

    var UserPrefButton,
        historyBackStub,
        oRenderer;
    module("sap.ushell.ui.footerbar.UserPreferencesButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(function () {
                historyBackStub = sinon.stub(window.history, 'back');
                oRenderer = sap.ushell.Container.createRenderer("fiori2");
            }.bind(this));

            EventHub.once("RendererLoaded").do(function () {
                UserPrefButton = new UserPreferencesButton();
                start();
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            UserPrefButton.destroy();
            testUtils.restoreSpies(sap.ui.getCore().applyTheme);
            oRenderer.destroy();
            historyBackStub.restore();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });



    [
        {
            testDescription: "with entry parameters",
            bHasRelevantMaintainableParameters: true,
            expectedValue: 1
        },
        {
            testDescription: "without entry parameters",
            bhasRelevantMaintainableParameters: false,
            expectedValue: 0
        }
    ].forEach(function (oFixture) {
        asyncTest("User Default Settings Entry test with parameters when " + oFixture.testDescription, 3, function () {
            var UserPrefDefaultSettings = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.DefaultParameters");
            var hasRelevantMaintainableParametersOriginal = sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters;

            sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters = function() {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(oFixture.bHasRelevantMaintainableParameters);
                return oDeferred.promise();
            };

            // Check default settings getValue()
            var oDeferred = UserPrefDefaultSettings.oController.getValue();
            oDeferred.done(function (valueObject) {
                strictEqual(typeof valueObject, "object", "got the expected value type");
                strictEqual(valueObject.value, oFixture.expectedValue, "got the expected value");
                strictEqual(valueObject.displayText, " ", "got the expected display text");
                start();
            });

            oDeferred.always(function () {
                UserPrefDefaultSettings.destroy();
                sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParametersOriginal = hasRelevantMaintainableParametersOriginal;
            });
        });
    });

    test("Constructor Test", function () {
        strictEqual(UserPrefButton.getIcon(), "sap-icon://person-placeholder", "Check dialog icon");
        strictEqual(UserPrefButton.getText("text"), sap.ushell.resources.i18n.getText("userSettings"), "Check dialog title");
        strictEqual(UserPrefButton.getTooltip("text"), sap.ushell.resources.i18n.getText("settings_tooltip"), "Check dialog tooltip");
    });

});
