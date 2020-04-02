// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/m/Switch",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device"
], function (
    AccessibilityCustomData,
    Log,
    jQuery,
    resources,
    Switch,
    mobileLibrary,
    JSONModel,
    Parameters,
    Device
) {
    "use strict";


    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.controller("sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector", {
        onInit: function () {

            var oShellCtrl = sap.ushell.Container.getRenderer("fiori2").getShellController();
            var oShellView = oShellCtrl.getView();
            this.oShellConfig = (oShellView.getViewData() ? oShellView.getViewData().config : {}) || {};

            //determines whether the User Image consent feature is enabled
            this.imgConsentEnabled = this.oShellConfig.enableUserImgConsent ? this.oShellConfig.enableUserImgConsent : false;

            if (this.imgConsentEnabled) {
                try {
                    this.userInfoService = sap.ushell.Container.getService("UserInfo");
                    this.oUser = this.userInfoService.getUser();
                } catch (e) {
                    Log.error("Getting UserInfo service failed.");
                    this.oUser = sap.ushell.Container.getUser();
                }

                this.currentUserImgConsent = this.oUser.getImageConsent();
                this.origUserImgConsent = this.currentUserImgConsent;

                this.addImgConsentEnableSwitch(this.currentUserImgConsent);
            }
        },

        getContent: function () {
            var oDfd = jQuery.Deferred();
            var oResourceModel = resources.getTranslationModel();
            this.getView().setModel(oResourceModel, "i18n");
            this.getView().setModel(this.getConfigurationModel(), "config");

            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve(sap.ushell.Container.getUser().getFullName());
            return oDfd.promise();
        },

        onCancel: function () {
            if (this.imgConsentEnabled) {
                this.currentUserImgConsent = this.oUser.getImageConsent();
                this.oUserEnableImgConsentSwitch.setState(this.currentUserImgConsent);
            }
        },

        onSave: function () {
            var oResultDeferred = jQuery.Deferred(),
                oWhenPromise, usrConsentDeferred,
                aPromiseArray = [];

            if (this.imgConsentEnabled) {
                usrConsentDeferred = this.onSaveUserImgConsent();
                aPromiseArray.push(usrConsentDeferred);
            }
            oWhenPromise = jQuery.when.apply(null, aPromiseArray);
            oWhenPromise.done(function () {
                oResultDeferred.resolve();
            });

            return oResultDeferred.promise();
        },

        onSaveUserImgConsent: function () {
            var deferred = jQuery.Deferred();
            var oUserPreferencesPromise;

            if (this.oUser.getImageConsent() !== this.currentUserImgConsent) { //only if there was a change we would like to save it
                // set the user's image consent
                if (this.currentUserImgConsent !== undefined) {
                    this.oUser.setImageConsent(this.currentUserImgConsent);
                    oUserPreferencesPromise = this.userInfoService.updateUserPreferences(this.oUser);

                    oUserPreferencesPromise.done(function () {
                        this.oUser.resetChangedProperty("isImageConsent");
                        this.origUserImgConsent = this.currentUserImgConsent;
                        deferred.resolve();
                    }.bind(this));

                    oUserPreferencesPromise.fail(function (sErrorMessage) {
                        // Apply the previous display density to the user
                        this.oUser.setImageConsent(this.origUserImgConsent);
                        this.oUser.resetChangedProperty("isImageConsent");
                        this.currentUserImgConsent = this.origUserImgConsent;
                        Log.error(sErrorMessage);

                        deferred.reject(sErrorMessage);
                    }.bind(this));
                } else {
                    deferred.reject(this.currentUserImgConsent + "is undefined");
                }
            } else {
                deferred.resolve();//No mode change, do nothing
            }

            return deferred.promise();
        },

        getConfigurationModel: function () {
            var oConfModel = new JSONModel({});
            var oUser = sap.ushell.Container.getUser();
            oConfModel.setData({
                isRTL: sap.ui.getCore().getConfiguration().getRTL(),
                sapUiContentIconColor: Parameters.get("sapUiContentIconColor"),
                isStatusEnable: this.originalEnableStatus ? this.originalEnableStatus : false,
                flexAlignItems: Device.system.phone ? "Stretch" : "Center",
                textAlign: Device.system.phone ? "Left" : "Right",
                textDirection: Device.system.phone ? "Column" : "Row",
                labelWidth: Device.system.phone ? "auto" : "12rem",
                name: oUser.getFullName(),
                mail: oUser.getEmail(),
                server: window.location.host,
                imgConsentEnabled: this.imgConsentEnabled,
                isImageConsent: this.currentUserImgConsent
            });
            return oConfModel;
        },


        _getUserSettingsPersonalizer: function () {
            if (this.oUserPersonalizer === undefined) {
                this.oUserPersonalizer = this._createUserPersonalizer();
            }
            return this.oUserPersonalizer;
        },

        _createUserPersonalizer: function () {
            var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                oComponent,
                oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                oPersonalizer = oPersonalizationService.getPersonalizer(oScope, oComponent);

            return oPersonalizer;
        },

        /*
         * User Image Consent functions
         */

        addImgConsentEnableSwitch: function (bEnable) {
            var oUserImgConsentEnableFlexBox = sap.ui.getCore().byId("UserAccountSelector--userImgConsentEnableFlexBox");
            this.oUserEnableImgConsentSwitch = new Switch({
                customTextOff: resources.i18n.getText("No"),
                customTextOn: resources.i18n.getText("Yes"),
                type: SwitchType.Default,
                state: bEnable,
                change: this.setCurrentUserImgConsent.bind(this)
            });
            //"aria-labelledBy", cannot be added in the constructor
            this.oUserEnableImgConsentSwitch.addCustomData(new AccessibilityCustomData({
                key: "aria-labelledBy",
                value: "UserAccountSelector--sapUshellUserImageConsentSwitchLabel",
                writeToDom: true
            }));
            if (!oUserImgConsentEnableFlexBox) {
                Log.error("UserAccountSelector: addImgConsentEnableSwitch was called before the renderer");
                return;
            }
            oUserImgConsentEnableFlexBox.addItem(this.oUserEnableImgConsentSwitch);
        },

        setCurrentUserImgConsent: function (oEvent) {
            this.currentUserImgConsent = oEvent.mParameters.state;
        },

        termsOfUserPress: function () {
            var termsOfUseTextBox = sap.ui.getCore().byId("UserAccountSelector--termsOfUseTextFlexBox");
            var termsOfUseLink = sap.ui.getCore().byId("UserAccountSelector--termsOfUseLink");
            var isTermsOfUseVisible = termsOfUseTextBox.getVisible();
            if (isTermsOfUseVisible) {
                termsOfUseTextBox.setVisible(false);
                termsOfUseLink.setText(resources.i18n.getText("userImageConsentDialogShowTermsOfUse"));
            } else {
                termsOfUseLink.setText(resources.i18n.getText("userImageConsentDialogHideTermsOfUse"));
                termsOfUseTextBox.setVisible(true);
            }
        }
    });
});
