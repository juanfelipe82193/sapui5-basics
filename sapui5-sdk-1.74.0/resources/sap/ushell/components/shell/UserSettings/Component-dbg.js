// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/components/shell/UserSettings/UserPreferences",
    "sap/ushell/components/shell/UserSettings/UserSettings.controller" // Do not remove this
], function (
    UIComponent,
    JSONModel,
    Config,
    UserPreferences
) {
    "use strict";

    var aDoables = [];

    return UIComponent.extend("sap.ushell.components.shell.UserSettings.Component", {

        metadata: {
            rootView: {
                "viewName": "sap.ushell.components.shell.UserSettings.UserSettings",
                "type": "XML",
                "async": false,
                "id": "View"
            },
            version: "1.74.0",
            library: "sap.ushell.components.shell.UserSettings",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createId: function (sId) {
            return "sapFlpUserSettings-" + sId;
        },

        /**
         * Initalizes the user settings by sett the models on the view and adding it as a dependent of the shell
         *
         * @private
         */
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            var oModel = new JSONModel({
                entries: Config.last("/core/shell/model/userPreferences/entries"),
                profiling: Config.last("/core/shell/model/userPreferences/profiling")
            });

            var oShellModel = sap.ui.getCore().byId("shell").getModel();

            var oView = this.getRootControl();
            oView.setModel(oModel, "entries");
            oView.setModel(oShellModel);

            aDoables.push(Config.on("/core/shell/model/userPreferences/entries").do(function (aResult) {
                oView.getModel("entries").setProperty("/entries", aResult);
            }));

            aDoables.push(Config.on("/core/shell/model/userPreferences/profiling").do(function (aResult) {
                oView.getModel("entries").setProperty("/profiling", aResult);
            }));

            sap.ui.getCore().byId("shell").addDependent(oView);

            this._getSearchPrefs();
            UserPreferences.setModel();
        },

        /**
         * Load Search Settings.
         *
         * @private
         */
        _getSearchPrefs: function () {
            function isSearchButtonEnabled () {
                try {
                    return Config.last("/core/shellHeader/headEndItems").indexOf("sf") !== -1;
                } catch (err) {
                    jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: search button is not visible.");
                    return false;
                }
            }

            if (isSearchButtonEnabled()) {
                // search preferences (user profiling, concept of me)
                // entry is added async only if search is active
                sap.ui.require([
                    "sap/ushell/renderers/fiori2/search/userpref/SearchPrefs",
                    "sap/ushell/renderers/fiori2/search/SearchShellHelperAndModuleLoader"
                ], function (SearchPrefs) {
                    var searchPreferencesEntry = SearchPrefs.getEntry(),
                        oRenderer = sap.ushell.Container.getRenderer("fiori2");

                    searchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                        if (isSearchPrefsActive && oRenderer) {
                            // Add search as a profile entry
                            oRenderer.addUserProfilingEntry(searchPreferencesEntry);
                        }
                    });
                });
            }
        },

        /**
         * Turns the eventlistener in this component off.
         *
         * @private
         */
        exit: function () {
            for (var i = 0; i < aDoables.length; i++) {
                aDoables.off();
            }
        }
    });
});