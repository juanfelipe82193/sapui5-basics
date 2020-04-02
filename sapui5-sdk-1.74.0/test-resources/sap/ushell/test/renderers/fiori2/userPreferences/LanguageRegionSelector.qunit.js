// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/EventHub"
], function (testUtils, EventHub) {
    "use strict";
    /* global module, ok, test, jQuery, sap, asyncTest, start, stop, sinon */

    jQuery.sap.require("sap.ushell.ui.footerbar.UserPreferencesButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");


    var historyBackStub,
        oRenderer;
    module("sap.ushell.ui.renderers.userPreferences.LanguageRegionSelector", {
        /**
         * This method is called before each test
         */
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                historyBackStub = sinon.stub(window.history, "back");
                oRenderer = sap.ushell.Container.createRenderer("fiori2");
                sap.ushell.Container.getRenderer = function () {
                    return {
                        getModelConfiguration: function () {
                            return {
                                enableSetLanguage: true
                            };
                        }
                    };
                };
                start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here
         */
        teardown: function () {
            stop();

            // TODO proper test isolation missing; therefore wait until until Shell.controller
            // finished initialization before executing the teardown
            EventHub.once("ShellNavigationInitialized").do(function () {
                sap.ui.getCore().byId("shell").getModel().setProperty("/userPreferences", this.initialUserPrefModel);
                testUtils.restoreSpies(sap.ui.getCore().applyTheme);
                oRenderer.destroy();
                historyBackStub.restore();
                delete sap.ushell.Container;

                // Ensure the next teardown call gets the current ShellNavigationInitialized event (not a previous one)
                EventHub._reset();

                start();
            }.bind(this));
        }
    });

    asyncTest("Language Region Selector default parameners test", 6, function () {
        var fs = sap.ui.getCore().getConfiguration().getFormatSettings();
        fs.setTimePattern("medium", "h:mm:ss a");
        fs.setDatePattern("medium", "MMM d, y");
        var oUser = sap.ushell.Container.getUser();
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector");
        var oController = languageRegionSelector.getController();
        var sLanguage = oController._getFormatedLanguage(oUser.getLanguage());
        var sLanguageText = oUser.getLanguageText();

        //Check default settings getValue()
        var oDeferred = languageRegionSelector.oController.getValue();
        oDeferred.then(function (value) {
            var modelData = languageRegionSelector.oController.getView().getModel().getData();
            ok(value.indexOf(sLanguage)>-1);
            ok(modelData.selectedLanguage === sLanguage);
            ok(modelData.languageList[0].text === sLanguageText, "Pretty text version of the language shown");
            ok(modelData.selectedDatePattern === "MMM d, y");
            ok(modelData.timeFormat === "12h");
            var buttonId = languageRegionSelector.hourFormatSegmentedButton.getButtons()[0].getId();
            var selectedButtonId = languageRegionSelector.hourFormatSegmentedButton.getSelectedButton();
            ok(buttonId === selectedButtonId);
            start();
        });
        languageRegionSelector.destroy();
    });

    asyncTest("Language Region Selector changed parameners test", 2, function () {
        var fs = sap.ui.getCore().getConfiguration().getFormatSettings();
        fs.setTimePattern("medium", "HH:mm");
        fs.setDatePattern("medium", "yyyy MM, dd");

        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector");

        var oDeferred = languageRegionSelector.oController.getValue();
        oDeferred.then(function (value) {
            var modelData = languageRegionSelector.oController.getView().getModel().getData();
            ok(modelData.selectedDatePattern === "yyyy MM, dd");
            var buttonId = languageRegionSelector.hourFormatSegmentedButton.getButtons()[1].getId();
            var selectedButtonId = languageRegionSelector.hourFormatSegmentedButton.getSelectedButton();
            ok(buttonId === selectedButtonId);
            start();
        });
        languageRegionSelector.destroy();
    });

    test("test languageSelectionInput", function () {
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector"),
            oLanguageSelectionInput = sap.ui.getCore().byId("languageSelectionInput"),
            oModel = oLanguageSelectionInput.getModel(),
            oController = languageRegionSelector.getController(),
            sExpectedInputValue;

        oModel.setProperty("/selectedLanguageText", oController._getFormatedLanguage("en-uk"));
        sExpectedInputValue = oLanguageSelectionInput.getValue();
        ok(sExpectedInputValue === "EN (UK)", "test the case in which the input value is provided with lower case with region");

        oModel.setProperty("/selectedLanguageText", oController._getFormatedLanguage("EN-UK"));
        sExpectedInputValue = oLanguageSelectionInput.getValue();
        ok(sExpectedInputValue === "EN (UK)", "test the case in which the input value is provided with upper case with region");

        oModel.setProperty("/selectedLanguageText", oController._getFormatedLanguage("EN"));
        sExpectedInputValue = oLanguageSelectionInput.getValue();
        ok(sExpectedInputValue === "EN", "test the case in which the input value is provided with upper case without region");

        oModel.setProperty("/selectedLanguageText", oController._getFormatedLanguage("en"));
        sExpectedInputValue = oLanguageSelectionInput.getValue();
        ok(sExpectedInputValue === "EN", "test the case in which the input value is provided with lower case without region");

        languageRegionSelector.destroy();
    });

    test("test languageSelectionLabel", function () {
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector"),
            oLanguageSelectionLabel = sap.ui.getCore().byId("languageSelectionLabel"),
            oModel = languageRegionSelector.getModel(),
            oController = languageRegionSelector.getController(),
            sExpectedLabelText;

        oModel.setProperty("/selectedLanguage", oController._getFormatedLanguage("en-uk"));
        sExpectedLabelText = oLanguageSelectionLabel.getText();
        ok(sExpectedLabelText === "Language and Region:", "test the case in which the input has region");

        oModel.setProperty("/selectedLanguage", oController._getFormatedLanguage("en"));
        sExpectedLabelText = oLanguageSelectionLabel.getText();
        ok(sExpectedLabelText === "Language:", "test the case in which the input doesn't have a region");

        languageRegionSelector.destroy();
    });

    test("test languageSelectionChange", function () {
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector"),
            oDateFormatCombo = sap.ui.getCore().byId("dateFormatCombo"),
            oModel = languageRegionSelector.getModel(),
            oController = languageRegionSelector.getController(),
            sExpectedDateFormat;

        oModel.setProperty("/selectedLanguage", "de-DE");
        oController._handleSelectChange(oModel.getProperty("/selectedLanguage"));
        sExpectedDateFormat = oDateFormatCombo.getValue();
        ok(sExpectedDateFormat === "dd.MM.y", "test the case in which the language changed");

        languageRegionSelector.destroy();
    });

    test("test getLanguagesList", function () {
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector"),
            oModel = languageRegionSelector.getModel(),
            oController = languageRegionSelector.getController();

            oController.getContent();
            var oGetContentPromise = oController.getContent();
            oGetContentPromise.done(function () {
                var sUpdatedLanguaged = oModel.getProperty("/selectedLanguage");
                var aLanguagesList = oModel.getProperty("/languageList");
                ok(sUpdatedLanguaged === "default", "test the case in which the language changed");
                ok(aLanguagesList.length === 7, "test the case in which the language changed");
            });
            languageRegionSelector.destroy();
    });

    test("test ariaLabelledBy is set for all inputs", function (assert) {
        var languageRegionSelector = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.LanguageRegionSelector");

        assert.ok(sap.ui.getCore().byId("dateFormatCombo").getAriaLabelledBy().length === 1, "aria-labelledby is set for dateFormatCombo");
        assert.ok(sap.ui.getCore().byId("hoursSegmentedButton").getAriaLabelledBy().length === 1, "aria-labelledby is set for hoursSegmentedButton");
        assert.ok(sap.ui.getCore().byId("languageSelectionSelect").getAriaLabelledBy().length === 1, "aria-labelledby is set for languageSelectionSelect");
        assert.ok(sap.ui.getCore().byId("languageSelectionInput").getAriaLabelledBy().length === 1, "aria-labelledby is set for languageSelectionInput");

        languageRegionSelector.destroy();
    });

});
