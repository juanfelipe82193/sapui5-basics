/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

// Provides control sap.ushell.ui.footerbar.SendAsEmailButton.
sap.ui.define([
    "sap/m/Button",
    "sap/ushell/library",
    "sap/ushell/resources",
    "./SendAsEmailButtonRenderer",
    "sap/ushell/services/_AppState/AppStatePersistencyMethod"
], function (Button, library, resources, SendAsEmailButtonRenderer, AppStatePersistencyMethod) {
    "use strict";

    /**
     * Constructor for a new ui/footerbar/SendAsEmailButton.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the newui/footerbar/SendAsEmailButton
     * @extends sap.m.Button
     *
     * @constructor
     * @public
     * @name sap.ushell.ui.footerbar.SendAsEmailButton
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var SendAsEmailButton = Button.extend("sap.ushell.ui.footerbar.SendAsEmailButton",
        /** @lends sap.ushell.ui.footerbar.SendAsEmailButton.prototype */ { metadata: {
            library: "sap.ushell",
            properties: {
                beforePressHandler: {type: "any", group: "Misc", defaultValue: null},
                afterPressHandler: {type: "any", group: "Misc", defaultValue: null}
            }
        }});

    /**
     * SendAsEmailButton
     *
     * @name sap.ushell.ui.footerbar.SendAsEmailButton
     * @private
     * @since 1.71.0
     */
    SendAsEmailButton.prototype.init = function () {
        var that = this;

        this.setIcon("sap-icon://email");
        this.setText(resources.i18n.getText("sendEmailBtn"));
        this.setTooltip(resources.i18n.getText("sendEmailBtn_tooltip"));

        this.attachPress(function () {
            if (that.getBeforePressHandler()) {
                that.getBeforePressHandler()();
            }
            this.sendAsEmailPressed(that.getAfterPressHandler());
        });

        //call the parent sap.m.Button init method
        if (Button.prototype.init) {
            Button.prototype.init.apply(this, arguments);
        }
    };

    /**
     *
     * @param cb
     */
    SendAsEmailButton.prototype.sendAsEmailPressed = function (cb) {
        var oResult = sap.ushell.Container.getFLPUrl(true);
        var that = this;
        if (typeof oResult === "string") {
            that.setAppStateToPublic(oResult);
            that.sendEmail(oResult);
        } else {
            oResult.done(function (sURL) {
                that.setAppStateToPublic(sURL);
                that.sendEmail(sURL);
            });
        }

        if (cb) {
            cb();
        }
    };

    /**
     * This method checks if the platform has implemented the new persistency mechanism. If so, it will change the
     * persistency method type to PublicState accordingly.
     *
     * @param sURL {String} The URL with the relevant state/s
     *
     */
    SendAsEmailButton.prototype.setAppStateToPublic = function (sURL) {
        var oAppState = sap.ushell.Container.getService("AppState");

        //If the platform did not implement yet the new persistency mechanism
        //with different persistency method types, no action should be taken, and only the mail should be sent.
        if (oAppState.getSupportedPersistencyMethods().length === 0) {
            var sXStateKey = this.getURLParamValue(sURL, "sap-xapp-state"),
                sIStateKey = this.getURLParamValue(sURL, "sap-iapp-state");

            if (sXStateKey !== undefined) {
                oAppState.makeStatePersistent(sXStateKey, AppStatePersistencyMethod.PublicState);
            }
            if (sIStateKey !== undefined) {
                oAppState.makeStatePersistent(sIStateKey, AppStatePersistencyMethod.PublicState);
            }
        }
    };

    /**
     * @param sURL {String} The mail content
     */
    SendAsEmailButton.prototype.sendEmail = function (sURL) {

        sap.m.URLHelper.triggerEmail(
            null,
            "Link to application",
            sURL
        );
    };

    /**
     * Get the param data of the URL
     *
     * @param sUrl {String} The URL from it the data will be retrieved
     * @param sParamName {String} The parameter to be fetched from the URL
     * @returns {undefined}
     */
    SendAsEmailButton.prototype.getURLParamValue = function (sUrl, sParamName) {
        var sReg = new RegExp("(?:" + sParamName + "=)([^&/]+)"),
            sRes = sReg.exec(sUrl),
            sValue;

        if (sRes && sRes.length === 2) {
            sValue = sRes[1];
        }

        return sValue;
    };

    return SendAsEmailButton;

}, true /* bExport */);
