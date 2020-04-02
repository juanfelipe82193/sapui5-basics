// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "../localService/mockserver",
    "sap/m/Shell",
    "sap/ushell/bootstrap/common/common.boot.task",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ushell/Config"
], function (mockserver, Shell, fnBootTask, JSONModel, CommonCreateConfigcontract, Config) {
    "use strict";

    // initialize the mock server for pages
    mockserver.init(
        "/sap/opu/odata/UI2/FDM_SPACE_REPOSITORY_SRV/",
        "../localService/space/metadata.xml",
        {
            sMockdataBaseUrl: "../localService/space/mockData"
        }
    );

    // initialize the mock server for transport
    mockserver.init(
        "/sap/opu/odata/UI2/FDM_VALUE_HELP_SRV/",
        "../localService/transport/metadata.xml",
        {
            sMockdataBaseUrl: "../localService/transport/mockData"
        }
    );

    function _applyConfiguration () {
        Config._reset();
        Config.registerConfiguration(null, CommonCreateConfigcontract.createConfigContract());
    }

    function _loadConfiguration (sPath) {
        return new Promise(function (fnResolve) {
            var oModel = new JSONModel(sPath);
            oModel.attachRequestCompleted(function () {
                fnResolve(oModel.getData());
            });
        });
    }

    // merge cdm bootstrap config with sandbox defaults, further overrides can be done via the init method.
    function _getConfiguration () {
        return _loadConfiguration("cdm/configuration.json");
    }

    _getConfiguration().then(function (oConfiguration) {
        // the configuration must be set to the window object, otherwise, the CDM data is not loaded.
        window["sap-ushell-config"] = oConfiguration;

        fnBootTask("cdm", function () {
            _applyConfiguration();
            // initialize the embedded component on the HTML page
            var oComponentContainer = new sap.ui.core.ComponentContainer({
                async: true,
                height: "100%",
                name: "sap.ushell.applications.SpaceDesigner",
                manifest: "../manifest.json"
            });

            var oShell = new Shell({
                app: oComponentContainer,
                appWidthLimited: false
            });

            oShell.placeAt("content");
        });
    });


});