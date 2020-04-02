/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

// Provides control sap.ushell.ui.footerbar.JamShareButton.
sap.ui.define([
    "sap/m/Button",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/collaboration/components/fiori/sharing/dialog/Component",
    "sap/base/Log",
    "./JamShareButtonRenderer"
], function (Button, library, resources, Component, Log) {
        "use strict";

       /**
        * Constructor for a new ui/footerbar/JamShareButton.
        *
        * @param {string} [sId] id for the new control, generated automatically if no id is given
        * @param {object} [mSettings] initial settings for the new control
        *
        * @class
        * Add your documentation for the newui/footerbar/JamShareButton
        * @extends sap.m.Button
        *
        * @constructor
        * @public
        * @name sap.ushell.ui.footerbar.JamShareButton
        * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
        */
        var JamShareButton = Button.extend("sap.ushell.ui.footerbar.JamShareButton", /** @lends sap.ushell.ui.footerbar.JamShareButton.prototype */ { metadata: {

            library: "sap.ushell",
            properties: {
                beforePressHandler: {type: "any", group: "Misc", defaultValue: null},
                afterPressHandler: {type: "any", group: "Misc", defaultValue: null},
                jamData: {type: "object", group: "Misc", defaultValue: null}
            }
        }});

        /**
         * JamShareButton
         *
         * @name sap.ushell.ui.footerbar.JamShareButton
         * @private
         * @since 1.15.0
         */
        JamShareButton.prototype.init = function () {
            var that = this;

            this.setEnabled(); // disables button if shell not initialized or Jam not active
            this.setIcon("sap-icon://share-2");
            this.setText(resources.i18n.getText("shareBtn"));

            this.attachPress(function () {
                if (that.getBeforePressHandler()) {
                    that.getBeforePressHandler()();
                }
                this.showShareDialog(that.getAfterPressHandler());
            });
            //call the parent sap.m.Button init method
            if (Button.prototype.init) {
                Button.prototype.init.apply(this, arguments);
            }
        };

        JamShareButton.prototype.showShareDialog = function (cb) {
            var oPromise,
                that = this;

            function openDialog () {
                that.shareComponent.setSettings(that.getJamData());
                that.shareComponent.open();

                //TODO: call callback after dialog vanishes
                if (cb) {
                    cb();
                }
            }

            if (!this.shareComponent) {
                this.shareComponent = sap.ui.getCore().createComponent({
                    name: "sap.collaboration.components.fiori.sharing.dialog"
                });
            }

            if (sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
                oPromise = this.adjustFLPUrl(this.getJamData());
                oPromise.then(function () {
                    openDialog();
                }, function (sError) {
                    Log.error("Could not retrieve FLP URL", sError,
                        "sap.ushell.ui.footerbar.JamShareButton");
                });
            } else {
                openDialog();
            }
        };

        JamShareButton.prototype.exit = function () {
            if (this.shareComponent) {
                this.shareComponent.destroy();
            }
            //call the parent sap.m.Button exit method
            if (Button.prototype.exit) {
                Button.prototype.exit.apply(this, arguments);
            }
        };

        JamShareButton.prototype.setEnabled = function (bEnabled) {
            if (!sap.ushell.Container) {
                if (this.getEnabled()) {
                    Log.warning(
                        "Disabling JamShareButton: unified shell container not initialized",
                        null,
                        "sap.ushell.ui.footerbar.JamShareButton"
                    );
                }
                bEnabled = false;
            } else {
                var user = sap.ushell.Container.getUser();
                if (!(user && user.isJamActive())) {
                    if (this.getEnabled()) {
                        Log.info(
                            "Disabling JamShareButton: user not logged in or Jam not active",
                            null,
                            "sap.ushell.ui.footerbar.JamShareButton"
                        );
                    }
                    bEnabled = false;
                    this.setVisible(false);
                }
            }
            Button.prototype.setEnabled.call(this, bEnabled);
        };

        /**
         *
         * in cFLP, the URL of FLP needs to be taken from the outer shell and not from
         * the iframe, so the proper URL will be shared in JAM
         *
         * @name sap.ushell.ui.footerbar.JamShareButton
         * @private
         * @since 1.74.0
         */
        JamShareButton.prototype.adjustFLPUrl = function (jamData) {
            return new Promise(function (fnResolve, fnReject) {
                if (jamData &&
                    jamData.object &&
                    jamData.object.id &&
                    typeof jamData.object.id === "string" &&
                    jamData.object.id === document.URL) {
                        sap.ushell.Container.getFLPUrl(true).then(function (sURL) {
                            jamData.object.id = sURL;
                            fnResolve();
                        }, function (sError) {
                            fnReject(sError);
                        });
                } else {
                    fnResolve();
                }
            });
        };

        return JamShareButton;
    }, true /* bExport */);
