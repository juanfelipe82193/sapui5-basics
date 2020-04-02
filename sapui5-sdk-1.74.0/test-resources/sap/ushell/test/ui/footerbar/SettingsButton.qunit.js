// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SettingsButton
 */

sap.ui.define([
    'sap/ushell/ui/footerbar/SettingsButton',
    'sap/ushell/ui/footerbar/AboutButton',
    'sap/ushell/resources',
    'sap/ushell/services/Container'
], function (SettingsButton, AboutButton, resources, Container) {
    "use strict";
    /* module, ok, test, jQuery, sap */

    module("sap.ushell.ui.footerbar.SettingsButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here
         * 
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
        var settingsButton = new sap.ushell.ui.footerbar.SettingsButton();
        ok(settingsButton.getIcon() === "sap-icon://action-settings", "Check dialog icon");
        ok(settingsButton.getTooltip("text") === sap.ushell.resources.i18n.getText("helpBtn_tooltip"), "Check settings tooltip");
    });

    asyncTest("showSettingsMenu Test", function () {
        var menuButtons,
            settingsButton = new sap.ushell.ui.footerbar.SettingsButton();

        //Show the menu
        settingsButton.showSettingsMenu();
        setTimeout(function () {

            //Get the settings menu content form
            menuButtons = sap.ui.getCore().byId('settingsMenu').getButtons();

            ok(menuButtons.length === 3, "Check number of buttons");
            ok(menuButtons[0].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton', "Check about button");
            ok(menuButtons[1].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.UserPreferencesButton', "Check login details button");
            ok(menuButtons[2].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.LogoutButton', "Check logout utton");

            //Destroy the about dialog
            sap.ui.getCore().byId('settingsMenu').destroy();
            start();
        }, 150);
    });

    asyncTest("setMenuItems Test", function () {
        var menuButtons,
            settingsButton = new sap.ushell.ui.footerbar.SettingsButton();

        settingsButton.setMenuItems([new AboutButton()]);

        //Show the menu
        settingsButton.showSettingsMenu();

        setTimeout(function () {

            //Get the settings menu dialog content form
            menuButtons = sap.ui.getCore().byId('settingsMenu').getButtons();

            ok(menuButtons.length === 4, "Check number of buttons");
            ok(menuButtons[0].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton', "Check about button");
            ok(menuButtons[1].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton', "Check about button");
            ok(menuButtons[2].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.UserPreferencesButton', "Check login details button");
            ok(menuButtons[3].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.LogoutButton', "Check logout utton");

            //Destroy the about dialog
            sap.ui.getCore().byId('settingsMenu').destroy();
            start();
        }, 250);
    });
});
