// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global assert */

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/fl/FakeLrepConnectorSessionStorage",
    "sap/ui/thirdparty/jquery"
], function (
    Opa5,
    FakeLrepConnectorSessionStorage,
    jQuery
) {
    "use strict";

    function getFrameUrl (sHash, sUrlParameters) {
        var sUrl = sap.ui.require.toUrl("sap/ushell/demoapps/RTATestApp/test/flpSandbox.html");
        sHash = sHash || "";
        sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

        if (sHash) {
            sHash = "#Worklist-display" + sHash;
        } else {
            sHash = "#Worklist-display";
        }

        return sUrl + sUrlParameters + sHash;
    }

    return Opa5.extend("sap.ushell.test.opaTests.rta.Common", {
        iStartTheApp: function (oOptions) {
            oOptions = oOptions || {};
            this.iStartMyAppInAFrame({
                source: getFrameUrl(oOptions.hash, oOptions.urlParameters),
                autoWait: true
            });
        },
        iEnableTheLocalLRep: function () {
            FakeLrepConnectorSessionStorage.enableFakeConnector();
            FakeLrepConnectorSessionStorage.forTesting.synchronous.clearAll();
        },
        iClearTheSessionStorageFromRtaRestart: function () {
            window.sessionStorage.removeItem("sap.ui.rta.restart.CUSTOMER");
            window.sessionStorage.removeItem("sap.ui.rta.restart.USER");
        },
        iAddTheVariantURLParameter: function () {
            Object.keys(window.sessionStorage).some(function (key) {
                if (key.indexOf("sap.ui.fl.variant.id") > -1) {
                     Opa5.getContext().variantId = jQuery.parseJSON(window.sessionStorage[key]).fileName;
                     return true;
                }
                return false;
            });
        },
        iWaitUntilTheBusyIndicatorIsGone: function (sId, sViewName) {
            return this.waitFor({
                autoWait: false,
                id: sId,
                viewName: sViewName,
                matchers: function (oRootView) {
                    // we set the view busy, so we need to query the parent of the app
                    return oRootView.getBusy() === false;
                },
                success: function () {
                    assert.ok(true, "the App is not busy anymore");
                },
                errorMessage: "The app is still busy.."
            });
        }
    });
});
