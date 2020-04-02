// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "./common.constants",
    "./common.debug.mode",
    "./common.read.metatags",
    "./common.util",
    "./common.read.ushell.config.from.url",
    "sap/base/util/ObjectPath",
    "sap/base/Log"
], function (jQuery, oConstants, bDebugMode, oMetaTagReader, oUtil, oConfigFromUrl, ObjectPath, Log) {
    "use strict";

    var S_COMPONENT = "sap/ushell/bootstrap/common/common.boot.script";

    // Some settings of the ushell which are dependent on user personalisation
    // are included in the config by direct reference to their respective
    // container in the personalisation storage.
    //
    // This function transforms the stored key-value pairs into a structure the
    // ushell configuration processor understands.
    function fixUpPersonalisedSettings (oUShellConfig, sSettingPath) {
        var oPersonalizedSetting;

        if (!oUShellConfig || !sSettingPath) {
            return;
        }

        oPersonalizedSetting = ObjectPath.get(sSettingPath, oUShellConfig);

        if (oPersonalizedSetting && oPersonalizedSetting.items) {
            jQuery.extend(oPersonalizedSetting, oPersonalizedSetting.items);

            delete oPersonalizedSetting.items;
            delete oPersonalizedSetting.__metadata;
        }
    }

    function createGlobalConfigs (aMetaConfigItems, oDefaultConfigration, bDebugSources, aServerConfigItems) {
        var sConfigPropertyName = oConstants.ushellConfigNamespace,
            aConfigs = aMetaConfigItems,
            oUShellConfig,
            oUshellConfigFromUrl;

        aServerConfigItems = aServerConfigItems || [];

        if (!window[sConfigPropertyName]) {
            window[sConfigPropertyName] = {};
        }
        oUShellConfig = window[sConfigPropertyName];

        if (oDefaultConfigration) {
            // uses the default configuration as very first configuration, so it has the lowest priority
            aConfigs = [oDefaultConfigration].concat(aMetaConfigItems);
        }

        aConfigs.forEach(function (oConfigItem) {
            oUtil.mergeConfig(oUShellConfig, oConfigItem, true);
        });

        aServerConfigItems.forEach(function (oServerConfig) {
            oUtil.mergeConfig(oUShellConfig, oServerConfig, true);
        });

        // URL param sap-ushell-xx-config-values can be used to set single config params
        // this is ONLY for simplified testing and supportability
        oUshellConfigFromUrl = oConfigFromUrl.getConfig();
        if (oUshellConfigFromUrl) {
            oUtil.mergeConfig(oUShellConfig, oUshellConfigFromUrl, true);
        }

        oUShellConfig["sap-ui-debug"] = bDebugSources;

        // log the config for better debugging
        Log.info(
            "finally applied sap-ushell-config",
            JSON.stringify(oUShellConfig),
            S_COMPONENT
        );
    }

    /**
     * Sets the sap-ushell-config based on all available sources for it (e.g. meta tags)
     *
     * @param {object} oSettings Optional default configuration.
     *
     * @returns {object} The ushell configuration.
     *
     * @private
     */
    function configureUshell (oSettings) {
        var oUShellConfig;

        var oDefaultConfigration = oSettings && oSettings.defaultUshellConfig;
        var aMetaConfigItems = oMetaTagReader.readMetaTags(oConstants.configMetaPrefix);

        createGlobalConfigs(aMetaConfigItems, oDefaultConfigration, bDebugMode, null);

        oUShellConfig = window[oConstants.ushellConfigNamespace];

        fixUpPersonalisedSettings(
            oUShellConfig,
            "services.Container.adapter.config.userProfilePersonalization"
        );

        return oUShellConfig;
    }

    return configureUshell;

});