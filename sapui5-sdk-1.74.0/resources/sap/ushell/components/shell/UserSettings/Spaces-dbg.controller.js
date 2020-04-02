// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Controller of the FLP spaces setting view
 *
 * The FLP spaces setting allows the user to activate either FLP spaces or
 * the classic FLP home page.
 *
 * Further details @see sap.ushell.components.shell.UserSettings.Spaces .
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ushell/Config"
], function (Controller, JSONModel, Device, resources, Config) {
    "use strict";


    /**
     * Controller of the FLP spaces setting view <code>Spaces</code>.
     *
     * The FLP spaces setting allows the user to activate either FLP spaces or
     * the classic FLP home page.
     *
     * It allows the user to activate either FLP spaces mode or the classic
     * FLP home page.
     *
     * It is visible only if FLP spaces are configurable by the user
     * (depending on <code>config.ushell.spaces.configurable</code>).
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameters
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.shell.UserSettings.Spaces
     */
    return Controller.extend("sap.ushell.components.shell.UserSettings.Spaces",
        /** @lends sap.ushell.components.shell.UserSettings.Spaces.prototype */ {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         *
         * It remembers if FLP spaces are currently activated, creates and sets
         * the model and accesses information about the current user.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {

            // Remember current spaces setting
            this.bSpacesEnabledSavedValue = Config.last("/core/spaces/enabled");

            // Create and set models
            this.oModel = new JSONModel({
                isSpacesEnabled: this.bSpacesEnabledSavedValue,
                textAlign: Device.system.phone ? "Begin" : "End",
                labelWidth: Device.system.phone ? "auto" : "12rem"
            });

            this.getView().setModel(this.oModel, "config");
            this.getView().setModel(resources.getTranslationModel(), "i18n");

            // Access user information
            this.oUserInfoServicePromise = sap.ushell.Container.getServiceAsync("UserInfo");
        },

        getContent: function () {
            var oDeferred = jQuery.Deferred();
            oDeferred.resolve(this.getView());
            return oDeferred.promise();
        },

        getValue: function () {
            // Nothing to do in this method, still it needs to return a resolved promise
            return jQuery.Deferred().resolve().promise();
        },

        /**
         * Sets the new spaces enabled setting back to the active value.
         * Is called when the settings dialog is cancelled.
         *
         * @private
         * @since 1.72.0
         */
        onCancel: function () {
            this.oModel.setProperty("/isSpacesEnabled", this.bSpacesEnabledSavedValue);
        },

        /**
         * Persists the user's spaces enabled setting.
         * Is called when the setting dialog is saved.
         *
         * @returns {jQuery.Deferred.Promise}
         *    Promise indicating that the settings have been saved
         *
         * @private
         * @since 1.72.0
         */
        onSave: function () {

            // Respond with a jQuery promise
            var oDeferred = jQuery.Deferred();

            var bSpacesEnabledNewValue = this.oModel.getProperty("/isSpacesEnabled");

            // Nothing to do if setting has not been changed
            if (bSpacesEnabledNewValue === this.bSpacesEnabledSavedValue) {
                oDeferred.resolve();
                return oDeferred.promise();
            }

            // Set and persist changed user preferences
            this.oUserInfoServicePromise.then(function (userInfoService) {
                var oUser = userInfoService.getUser();
                oUser.setChangedProperties({
                    propertyName: "spacesEnabled",
                    name: "SPACES_ENABLEMENT"
                }, this.bSpacesEnabledSavedValue, bSpacesEnabledNewValue);

                userInfoService.updateUserPreferences(oUser)
                    .done(function () {
                        oUser.resetChangedProperty("spacesEnabled");
                        // update with the saved value as it is not reflected in the sap.ushell.Config immediately
                        this.bSpacesEnabledSavedValue = bSpacesEnabledNewValue;
                        oDeferred.resolve({refresh: true});
                    }.bind(this))
                    .fail(function (sErrorMessage) {
                        this.oModel.setProperty("/isSpacesEnabled", this.bSpacesEnabledSavedValue);
                        oUser.resetChangedProperty("spacesEnabled");
                        oDeferred.reject(sErrorMessage);
                    }.bind(this));
            }.bind(this));

            return oDeferred.promise();
        }
    });
});
