// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./abap.bootstrap.utils",
    "sap/base/util/ObjectPath"
], function (oAbapUtils, ObjectPath) {
    "use strict";

    /* global URI */

    var S_RELOAD_QUERY_PARAM = "sap-ushell-reloaded";

    /**
     * Helper class for handling events from XHR logon frame provider
     *
     * @private
     */
    function XhrLogonEventHandler (oWindow, sXhrLogonMode) {
        this._oWindow = oWindow || window;
        this._sXhrLogonMode = sXhrLogonMode;
        this._bPending = false;
    }

    XhrLogonEventHandler.prototype.handleEvent = function (oEvent) {
        if (this._bPending) {
            // only handle first logon event
            return true;
        }

        if (oEvent.type === "logon") {
            this._bPending = true;

            if (this._sXhrLogonMode === "logoffAndRedirect") {
                this._showErrorAndReload(
                    { key: "bootstrap.xhr.authenticationRequired", text: "Authentication required" },
                    { key: "bootstrap.xhr.sessionExpired", text: "Your session has expired. Press OK to reload." },
                    this._logoffAndRedirect,
                    this._handleAuthenticationRequiredNoUi5.bind(this)
                );
            } else { // reload is default
                this._showErrorAndReload(
                    { key: "bootstrap.xhr.authenticationRequired", text: "Authentication required" },
                    { key: "bootstrap.xhr.sessionExpired", text: "Your session has expired. Press OK to reload." },
                    this._reloadPage,
                    this._handleAuthenticationRequiredNoUi5.bind(this)
                );
            }
        } else {
            sap.ui2.srvc.log.error("Cannot handle event with type: " + oEvent.type,
                null, "sap.ushell_abap.bootstrap.evo.XhrLogonEventHandler");
        }

        return true;
    };

    /**
     * Returns a modified location search string for reloading the Fiori launchpad,
     * i.e. the result of this method can be assigned to <code>window.location.search</code> for triggering a page reload.
     * Modifying the search part of the URL by adding the query parameter &quot;sap-ushell-reloaded&quot;
     * ensures that the reload is always triggering a GET request. This is important because with SAML logon,
     * window.location.reload() would trigger a POST request with an outdated SAML assertion;
     * the ABAP server does not a redirect to the IDP login page in that case.
     *
     * @param {string} sCurrentLocationSearch - current location search string
     * @return {string} an updated location search string triggering a page reload
     * @private
     */
    XhrLogonEventHandler.prototype._getUpdatedLocationSearchForReload = function (sCurrentLocationSearch) {
        var iReloadParamVal = Date.now(),
            rReloadedPattern = new RegExp(["(.*)([?&])", S_RELOAD_QUERY_PARAM, "(=[^&]*)?(.*)"].join("")),
            sResult,
            bMatched = false;

        // input must be a string, but could be empty
        if (typeof sCurrentLocationSearch !== "string") {
            throw new Error("Illegal argument: sCurrentLocationSearch must be a string");
        }

        // split into groups prefix, operand, current value and rest and replace the value if present
        sResult = sCurrentLocationSearch.replace(rReloadedPattern, function (sMatch, sPrefix, sOperand, sValueWithEquals, sRest) {
            bMatched = true;
            return [sPrefix, sOperand, S_RELOAD_QUERY_PARAM, "=", iReloadParamVal, sRest].join("");
        });

        if (!bMatched) {
            if (sCurrentLocationSearch) {
                // append if there is already a search string
                sResult = [sCurrentLocationSearch, "&", S_RELOAD_QUERY_PARAM, "=", iReloadParamVal].join("");
            } else {
                // no query yet
                sResult = ["?", S_RELOAD_QUERY_PARAM, "=", iReloadParamVal].join("");
            }
        }

        return sResult;
    };

    /**
     * Reloads the current browser page
     *
     * @private
     */
    XhrLogonEventHandler.prototype._reloadPage = function () {
        var that = this;

        that._oWindow.setTimeout(function () {
            /*
            When SAP Fiori launchpad is configured to use "reload" mode for xhrLogon, we reload the FLP page after a session timeout.
            In case of SAML, this seems to be re-triggering a POST request with the form data that was obtained from the initial logon.
            The code above now forces a GET request with an additional query parameter
            (a timestamp indicating the Fiori launchpad was reloaded).
            */
            that._oWindow.location.search = that._getUpdatedLocationSearchForReload(that._oWindow.location.search);
        }, 0);
    };

    /**
     * Logs off from the FES and triggers a relogon that also ensures that relogon at all secondary systems is done.
     * We set the redirect to the current FLP URL so that we get a new logon triggered.
     *
     * @private
     */
    XhrLogonEventHandler.prototype._logoffAndRedirect = function () {
        var sLocationHref = oAbapUtils.getLocationHref(),
            sClientId = ObjectPath.get("sap-ushell-config.services.Container.adapter.config.client"),
            sUrl;

        sUrl = new URI("/sap/public/bc/icf/logoff")
            .absoluteTo(sLocationHref)
            .search("sap-client=" + sClientId + "&propagateLogoff=false&redirectURL=" + encodeURIComponent(sLocationHref))
            .toString();
        document.location = sUrl;
    };

    /**
     * Checks if the page is currently being reloaded by the XHR logon which triggers this by setting query-parameter sap-ushell-reloaded
     *
     * @private
     */
    XhrLogonEventHandler.prototype._isPageReloaded = function () {
        return new RegExp(["[?&]", S_RELOAD_QUERY_PARAM].join("")).test(this._oWindow.location.search);
    };

    XhrLogonEventHandler.prototype._handleAuthenticationRequiredNoUi5 = function (fnReload) {
        // In reload mode, this should not happen (can only occur in very early XHR requests, i.e. start_up).
        // But then the session should still be valid. So if we get in here, the HTML page itself has been cached or
        // for some reason the server served it, but rejected the subsequent start_up or pageSets request.
        // We render a plain alert popup and try to reload the page once in this case; if the page is already reloaded (we trigger the
        // reload be setting the query parameter 'sap-ushell-reloaded'), we give up with an error message to avoid an endless loop

        if (!this._isPageReloaded()) {
            // not in reload case, try reload once
            // no translation in fallback case
            sap.ui2.srvc.log.error(
                "Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized. "
                + "This should not happen if the FioriLaunchpad.html page is loaded from the server. Trying to reload page once.",
                null, "sap.ushell_abap.bootstrap.evo.XhrLogonEventHandler"
            );

            var sMessage = "Authentication required\n\nYour session might have expired. Press OK to reload.";
            this._oWindow.alert(sMessage);

            fnReload.call(this);
        } else {
            // reload already triggered at least once, giving up
            sap.ui2.srvc.log.error(
                "Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized and page reload has been triggered once."
                + " Stopping reload to avoid endless loop. This state cannot be overcome. Please ensure that the FioriLaunchpad.html"
                + " page is not cached, but always loaded from the server.",
                null, "sap.ushell_abap.bootstrap.evo.XhrLogonEventHandler"
            );
        }
    };

    /**
     * Helper method showing an error dialog and reloading the page afterwards.
     *
     * @param {object} oTitleText text key and default text for the dialog title
     * @param {object} oMessageText text key and default text for the dialog message
     * @param {function} fnReload function that is executed to do the actual reload
     * @param {function} fnFallbackIfUi5NotLoaded a fallback function which is executed if UI5 not yet loaded
     */
    XhrLogonEventHandler.prototype._showErrorAndReload = function (oTitleText, oMessageText, fnReload, fnFallbackIfUi5NotLoaded) {
        var sTitle,
            sMessage;

        // We have to avoid that the modules are loaded by an additional XHR request here, because this would block the synchronous call
        // as we are in the middle of the logon process. Therefore, we first check if the modules are already declared;
        // we set the preload flag to true, because this means that a subsequent require call does not perform a server round trip;
        // this is also the reason why we hard-code the sap.m.MessageBox here - using the Message service would be the better way,
        // but this might trigger module loading as well normally, the 2 required modules should be part of the fiori-lib preload package,
        // so the fallback should not occur under normal circumstances
        if (sap && sap.ui && (typeof sap.ui.getCore === "function")
            && sap.ui.getCore().isInitialized() && jQuery.sap.isDeclared("sap.m.MessageBox", true)) {
            jQuery.sap.require("sap.m.MessageBox"); // TODO: remove jQuery.sap
            if (jQuery.sap.isDeclared("sap.ushell.resources", true)) {
                jQuery.sap.require("sap.ushell.resources"); // TODO: remove jQuery.sap
                sTitle = this._getText(oTitleText);
                sMessage = this._getText(oMessageText);
            }

            // Overwrite sap.ui.core.BusyIndicator.show to not open a busy indicator.
            // In case the MessageBox (to show the error message and to offer the end user to reload the FLP) gets shown, we want
            // to make sure that no busy indicator is layered above which would not allow the end user to react on this message box control.
            // Therefore we overwrite the 'show' method of the sap.ui.core.BusyIndicator class with an empty implementation body.
            // In case a 'show' call of the busy indicator with a delay is triggered, we need to stop that with a respective 'hide' call.
            // As the FLP gets reloaded afterwards, we do not need to apply the old logic of 'show' again.
            if (jQuery.sap.isDeclared("sap.ui.core.BusyIndicator", true)) {
                jQuery.sap.require("sap.ui.core.BusyIndicator"); // TODO: remove jQuery.sap
                if (typeof sap.ui.core.BusyIndicator.show === "function" &&
                    typeof sap.ui.core.BusyIndicator.hide === "function") {
                    sap.ui.core.BusyIndicator.hide();
                    sap.ui.core.BusyIndicator.show = function () { };
                }
            }

            if (sap && sap.ca && sap.ca.ui && sap.ca.ui.utils && sap.ca.ui.utils.busydialog) { // TODO: pending dependency migration
                // workaround to avoid that clicking on the reload popup is blocked by a busy dialog from sap.ca;
                // this is not a general solution
                if (typeof sap.ca.ui.utils.busydialog.releaseBusyDialog === "function") {
                    for (var i = 0; i < 200; ++i) {
                        sap.ca.ui.utils.busydialog.releaseBusyDialog();
                    }
                }
            }

            sap.m.MessageBox.show(sMessage, { // TODO: pending dependency migration
                icon: sap.m.MessageBox.Icon.ERROR,
                title: sTitle,
                actions: [sap.m.MessageBox.Action.OK],
                onClose: fnReload.bind(this)
            });
        } else {
            // execute fallback function
            fnFallbackIfUi5NotLoaded.call(this, fnReload);
        }
    };

    /**
     * Helper method to get a translated text with fallback to a hard-coded one.
     *
     * @param {object} oText text key and default text
     * @return {string} the translated text if the key exists or the provided fallback text
     */
    XhrLogonEventHandler.prototype._getText = function (oText) {
        var sText = sap.ushell.resources.i18n.getText(oText.key);

        // ui5 resource bundle returns the text key if no text defined we need the fallback,
        // because translations might be missing in lower releases
        if (sText && (sText !== oText.key)) {
            return sText;
        }
        return oText.text;
    };

    return XhrLogonEventHandler;
}, true /* bExport */);
