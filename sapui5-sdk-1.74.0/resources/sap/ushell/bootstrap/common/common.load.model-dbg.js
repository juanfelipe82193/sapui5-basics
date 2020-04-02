// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Config",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device"
], function (Config, JSONModel, jQuery, Device) {
    "use strict";

    var _oModel;

    function _instantiateModel () {
        var oShellCoreConfigFromConfig = Config.last("/core"),
            oInitialConfig = {
                groups: [],
                rtl: sap.ui.getCore().getConfiguration().getRTL(),
                personalization: oShellCoreConfigFromConfig.shell.enablePersonalization,
                tagList: [],
                selectedTags: [],
                userPreferences: { entries: [] },
                enableHelp: oShellCoreConfigFromConfig.extension.enableHelp, // xRay enablement configuration
                enableTileActionsIcon: Device.system.desktop ? oShellCoreConfigFromConfig.home.enableTileActionsIcon : false
            };

        // Merge configurations (#extend merges from left to right, overwriting setted values)
        // Catalog configuration kept just in case
        oInitialConfig = jQuery.extend(
            {},
            oShellCoreConfigFromConfig.catalog,
            oShellCoreConfigFromConfig.home,
            oInitialConfig
        );

        _oModel = new JSONModel(oInitialConfig);
        _oModel.setSizeLimit(10000); // override default of 100 UI elements on list bindings
    }

    function _handleMedia (mq) {
        _oModel.setProperty("/isPhoneWidth", !mq.matches);
    }

    function _triggerSubscriptions () {
        var mediaQ = window.matchMedia("(min-width: 800px)");

        // condition check if mediaMatch supported(Not supported on IE9)
        if (mediaQ.addListener) {
            mediaQ.addListener(_handleMedia);
            _handleMedia(mediaQ);
        }
    }

    return {
        getModel: function () {
            if (!_oModel) {
                _instantiateModel();
                _triggerSubscriptions();
            }
            return _oModel;
        }
    };
});
