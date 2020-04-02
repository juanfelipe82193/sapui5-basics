// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/bootstrap/common/common.load.xhrlogon",
    "sap/ushell/bootstrap/common/common.configure.xhrlogon",
    "./abap.bootstrap.utils",
    "./XhrLogonEventHandler"
], function (oXhrLogonLib, oConfigureXhrLogon, oAbapUtils, XhrLogonEventHandler) {
    'use strict';

    var oHandler = {};

    /**
     * Determines the XHR logon mode based on the bootstrap configuration and the URL parameter
     *
     * @param {object} oConfig
     *     the configuration
     * @returns the logon mode
     */
    oHandler.getLogonMode = function (oConfig) {
        return oAbapUtils.getUrlParameterValue("sap-ushell-xhrLogon-mode")
            || oConfig && oConfig.xhrLogon && oConfig.xhrLogon.mode
            || "frame";
    };

    /**
     * Initializes and starts XHR logon lib based on a given configuration.
     * <p>
     *
     * @param {object} oConfig
     *     the configuration
     *
     * @private
     */
    oHandler.initXhrLogon = function (oConfig) {
        var sLogonMode = oHandler.getLogonMode(oConfig),
            oXhrLogonEventHandler = oHandler.createXhrLogonEventHandler(window, sLogonMode),
            oLogonManager = oXhrLogonLib.LogonManager.getInstance(),
            oXHRLogonManager = oXhrLogonLib.XHRLogonManager.getInstance();

        oXhrLogonLib.start();

        if (sLogonMode === "reload" || sLogonMode === "logoffAndRedirect" ) {
            oLogonManager.unregisterAllHandlers();
            oLogonManager.registerAuthHandler("*", function (oEvent) {
                oXhrLogonEventHandler.handleEvent(oEvent);
            });
        } else if (sLogonMode !== "frame") {
            sap.ui2.srvc.log.warning("Unknown setting for xhrLogonMode: '" + sLogonMode + "'. Using default mode 'frame'.",
            null, "sap.ushell_abap.bootstrap.evo.abap.xhr.handler");
        }

        XMLHttpRequest.logger = oConfigureXhrLogon.createUi5ConnectedXhrLogger();
        oConfigureXhrLogon.initXhrLogonIgnoreList(oXHRLogonManager);
    };

    /**
     * We expose a factory method for the tests and allow to pass a test double for the window object
     *
     * @private
     */
    oHandler.createXhrLogonEventHandler = function (oWindow, sXhrLogonMode) {
        return new XhrLogonEventHandler(oWindow, sXhrLogonMode);
    };

    return oHandler;

});
