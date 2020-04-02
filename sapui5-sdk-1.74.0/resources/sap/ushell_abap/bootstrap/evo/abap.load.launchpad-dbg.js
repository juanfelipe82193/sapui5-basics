// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/util/UriParameters",
    "sap/ushell/utils",
    "sap/ui2/srvc/chip",
    "sap/ui2/srvc/bag",
    "sap/ui2/srvc/contracts/bag",
    "sap/ui2/srvc/contracts/configuration",
    "sap/ui2/srvc/contracts/configurationUi",
    "sap/ui2/srvc/contracts/fullscreen",
    "sap/ui2/srvc/contracts/preview",
    "sap/ui2/srvc/contracts/visible",
    "sap/ui2/srvc/contracts/refresh",
    "sap/ui2/srvc/contracts/searchProvider",
    "sap/ui2/srvc/contracts/search",
    "sap/ui2/srvc/contracts/url",
    "sap/ui2/srvc/contracts/actions",
    "sap/ui2/srvc/contracts/types",
    "sap/ui2/srvc/error"
], function (UriParameters, oUtils /* ui2Chip, ui2Bag, ui2ContractsBag, ui2Configuration, ui2ConfigurationUi, ui2Fullscreen, ui2Preview, ui2Visible, ui2Refresh, ui2SearchProvider, ui2Search, ui2Url, ui2Actions, ui2Types, ui2Error */) {
    "use strict";

    return loadLaunchpadContent;

    function loadLaunchpadContent () {
        oUtils.addTime("main");

        // check if framing control of ui5 should be active (meta tag set)
        var oFramingControl = window["sap-ushell-framing-control"],
            oUI5Configuration,
            sUi5FrameOptions;

        if (oFramingControl && oFramingControl.verifyUi5ProtectionActive) {
            oUI5Configuration = sap.ui.getCore().getConfiguration();
            sUi5FrameOptions = (typeof oUI5Configuration.getFrameOptions === "function") && oUI5Configuration.getFrameOptions();
            if (sUi5FrameOptions === "trusted" || sUi5FrameOptions === "deny") {
                // ui5 protection active, so we can unlock
                oFramingControl.unlock();
                jQuery.sap.log.debug("UI5 framing protection active, unlocking FLP protection");
            } else {
                // ui5 protection not active although meta tag set; this is an illegal state that can only
                // happen if UI2 version is newer than UI5, but UI5 ABAP code is already active
                throw new Error("UI5 framing protection is NOT active, although sap.whitelist meta tag set."
                    + " Ensure consistent deployment of UI5 and UI2 resources.");
            }
        }

        if (!window.console) {
            window.console = {};
            window.console.error = function () {};
            window.console.log = function () {};
            window.console.debug = function () {};
            window.console.info = function () {};
            window.console.warn = function () {};
        }

        // check if this is a DSM terminate session (which comes from EP)
        var oUriParameters = new UriParameters(window.location.href),
            terminationKey = oUriParameters.get("SAPSessionCmd") || oUriParameters.get("sap-sessioncmd");

        if (terminationKey === 'USR_LOGOFF') {
            // DSM notification for user log off - call the Container logoff API
            sap.ushell.Container.logout();
            return;
        } else if (terminationKey === 'USR_ABORT') {
            // DSM notification for user aborted
            return;
        }

        //TODO inserted to support chips requesting this contract unecessarily
        sap.ui2.srvc.Chip.addContract("navigation", function (oChipInstance) {
            this.navigateToUrl = function (sUrl, oSettings) {
                throw new sap.ui2.srvc.Error("'navigation' contract not implemented!",
                    "sap.ushell.adapters.abap.LaunchPageAdapter");
            };
        });


        sap.ui.require(["sap/ushell/iconfonts"], function (IconFonts) {
            window.sap.ushell.Container.createRenderer("fiori2", true).then(
                function (oContent) {
                    oContent.placeAt("canvas", "only");
                }
            );
            IconFonts.registerFiori2IconFont();
        });

    }

});