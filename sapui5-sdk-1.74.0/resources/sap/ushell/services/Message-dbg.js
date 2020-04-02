// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageBox",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Link",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/FormattedText",
    "sap/ui/thirdparty/jquery",
    "sap/m/MessageToast",
    "sap/m/library",
    "sap/ui/core/library"
], function (
    MessageBox,
    Config,
    resources,
    Dialog,
    Text,
    Link,
    Button,
    VBox,
    FormattedText,
    jQuery,
    MessageToast,
    mobileLibrary,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    // shortcut for sap.m.FlexRendertype
    var FlexRendertype = mobileLibrary.FlexRendertype;

    /**
     * Message service.
     *
     * @name sap.ushell.services.Message
     * @constructor
     * @since 1.16.0
     * @public
     */
    function Message () {
        var fnShellCallBackFunction;

        /**
         * Initialisation:
         * This method is to be invoked by the Shell to register the message callback function.
         * The signature of the callback is defined via the show function.
         *
         * @methodOf sap.ushell.services.Message#
         * @name init
         * @param {function} fnShellCallback callback for the shell to execute showing the message
         * @returns {object} this. The MessageService
         * @private
         */
        this.init = function (fnShellCallback) {
            fnShellCallBackFunction = fnShellCallback;

            return this;
        };

        /**
         * Shows a message on the screen.
         *
         * @param {sap.ushell.services.Message.Type} iType message type
         * @param {string} sMessage the localized message as plain text
         * @param {object} oParameters Some parameters
         * @methodOf sap.ushell.services.Message#
         * @name show
         * @private
         */
        this.show = function (iType, sMessage, oParameters) {
            if (!sMessage) {
                jQuery.sap.log.error("Message must not be empty.");
                return;
            }

            if (fnShellCallBackFunction && typeof fnShellCallBackFunction === "function") {
                fnShellCallBackFunction(iType, sMessage, oParameters || {});
            } else {
                this.buildMessage(iType, sMessage, oParameters || {});
            }
        };

        /**
         * Decides wether a MessageBox or a SupportMessage needs to be send and accordingly builds a configuration for it.
         *
         * @param {number} iType message type
         * @param {string} sMessage message text
         * @param {object} oParameters message parameters
         * @private
         */
        this.buildMessage = function (iType, sMessage, oParameters) {
            var oMessageBoxConfig = {
                title: oParameters.title,
                actions: oParameters.actions,
                details: oParameters.details,
                onClose: oParameters.callback
            },
                sMessageBoxType;

            switch (iType) {
                case Message.Type.ERROR:
                    var oDialog = this.createErrorDialog(sMessage, oMessageBoxConfig);
                    oDialog.open();
                    return;
                case Message.Type.CONFIRM:
                    if (!oParameters.actions) {
                        sMessageBoxType = "confirm";
                    } else {
                        oMessageBoxConfig.icon = MessageBox.Icon.QUESTION;
                        sMessageBoxType = "show";
                    }
                    break;
                case Message.Type.INFO:
                    sMessageBoxType = "info";
                    this.buildAndSendMessageToast(sMessage, oParameters.duration || 3000);
                    //Show only Toast. Don't need to show the MessageBox.
                    return;
                default:
                    oMessageBoxConfig = { duration: oParameters.duration || 3000 };
                    sMessageBoxType = "show";
                    break;
            }

            this.sendMessageBox(sMessage, sMessageBoxType, oMessageBoxConfig); // Give me some parameters please!
        };

        /**
         * Creates a Dialog from a given error message.
         *
         * @param {string} sMessage message text
         * @param {object} oConfig message configuration (title and details)
         * @returns {object} oDialog enriched dialog
         * @private
         */
        this.createErrorDialog = function (sMessage, oConfig) {
            function copyToClipboard (sToClipboard) {
                var oTemporaryDomElement = document.createElement("textarea");
                try {
                    oTemporaryDomElement.contentEditable = true;
                    oTemporaryDomElement.readonly = false;
                    oTemporaryDomElement.innerText = sToClipboard;
                    document.documentElement.appendChild(oTemporaryDomElement);

                    if (navigator.userAgent.match(/ipad|iphone/i)) {
                        var oRange = document.createRange();
                        oRange.selectNodeContents(oTemporaryDomElement);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(oRange);
                        oTemporaryDomElement.setSelectionRange(0, 999999);
                    } else {
                        jQuery(oTemporaryDomElement).select();
                    }

                    document.execCommand("copy"); MessageToast.show(resources.i18n.getText("CopyWasSuccessful"));
                } catch (oException) {
                    MessageToast.show(resources.i18n.getText("CopyWasNotSuccessful"));
                } finally {
                    jQuery(oTemporaryDomElement).remove();
                }
            }

            function generateCopyButton (sButtonName) {
                var oButton = new Button({
                    text: resources.i18n.getText(sButtonName),
                    press: function () {
                        var sFormattedDetails = oConfig.details;

                        if (typeof oConfig.details === "object") {
                            // Using stringify() with "tab" as space argument and escaping the JSON to prevent binding
                            sFormattedDetails = JSON.stringify(oConfig.details, null, "\t");
                        }

                        var aCopiedText = [];
                        aCopiedText.push("Title: " + (sDialogTitle || "-"));
                        aCopiedText.push("Message: " + (sMessage || "-"));
                        aCopiedText.push("Details: " + (sFormattedDetails || "-"));
                        copyToClipboard(aCopiedText.join("\n"));
                    }
                });

                oButton.setTooltip(resources.i18n.getText("CopyToClipboardBtn_tooltip"));
                return oButton;
            }

            function generateContactSupportButton (sButtonName) {
                var oButton = new Button({
                    text: resources.i18n.getText(sButtonName),
                    press: function () {
                        sap.ui.require(["sap/ushell/ui/footerbar/ContactSupportButton"],
                            function (ContactSupportButton) {
                                var oContactSupport = new ContactSupportButton();
                                if (oContactSupport) {
                                    oContactSupport.showContactSupportDialog();
                                    // oContactSupport is redundant after creation of the Contact Support Dialog.
                                    oContactSupport.destroy();
                                }
                            });

                        oDialog.destroy();
                    }
                });

                oButton.setTooltip(resources.i18n.getText("contactSupportBtn_tooltip"));
                return oButton;
            }

            function generateButton (sButtonName) {
                switch (sButtonName) {
                    case "contactSupportBtn":
                        return generateContactSupportButton(sButtonName);
                    case "CopyToClipboardBtn":
                        return generateCopyButton(sButtonName);
                    default:
                        return new Button({
                            text: resources.i18n.getText(sButtonName),
                            press: function () {
                                oDialog.destroy();
                            }
                        });
                }
            }

            function defineButtons (bHasSupportButton) {
                var aButtonNames = [],
                    aButtons = [];

                if (bHasSupportButton) {
                    aButtonNames.push("contactSupportBtn");
                } else {
                    aButtonNames.push("okDialogBtn");
                }

                aButtonNames.push("CopyToClipboardBtn");
                aButtonNames.push("cancelDialogBtn");

                aButtonNames.forEach(function (sButtonName) {
                    aButtons.push(generateButton(sButtonName));
                });

                return aButtons;
            }

            function addButtonsToDialog (oDialog, aButtons) {
                aButtons.forEach(function (oButton) {
                    oDialog.addButton(oButton);
                });
            }

            function addMessageToVBox (oVBox) {
                var oText = new Text({
                    text: sMessage
                });

                if (oConfig.details) {
                    oText.addStyleClass("sapUiSmallMarginBottom");
                }

                oVBox.addItem(oText);
            }

            function addDetailsToVBox (oVBox) {
                var sDetails = oConfig.details;

                if (typeof oConfig.details === "object") {
                    sDetails = oConfig.details.info;
                }

                var oLink = new Link({
                    text: resources.i18n.getText("ViewDetails"),
                    press: function () {
                        var iLinkContentIndex = oVBox.indexOfItem(oLink);
                        oVBox.removeItem(iLinkContentIndex);
                        oVBox.insertItem(
                            new FormattedText({
                                htmlText: sDetails
                            }), iLinkContentIndex);
                    }
                });

                oVBox.addItem(oLink);
            }

            function defineContent () {
                var oVBox = new VBox({ renderType: FlexRendertype.Bare });

                addMessageToVBox(oVBox);

                if (oConfig.details) {
                    addDetailsToVBox(oVBox);
                }

                return oVBox;
            }

            var sDialogTitle = oConfig.title || resources.i18n.getText("error"),
                oDialog = new Dialog({
                    state: ValueState.Error,
                    title: sDialogTitle,
                    type: DialogType.Message,
                    contentWidth: "30rem"
                }),
                bContactSupportEnabled = Config.last("/core/extension/SupportTicket"),
                // check that SupportTicket is enabled and verify that we are not in a flow in which Support ticket creation is failing,
                // if this is the case we don't want to show the user the contact support button again
                // Note: Renderer.qunit.js deletes sap.ushell.container before this code is called.
                // check if container is available
                bHasSupportButton = sap.ushell.Container
                    && bContactSupportEnabled
                    && sMessage !== resources.i18n.getText("supportTicketCreationFailed"),
                aButtons = defineButtons(bHasSupportButton);
            addButtonsToDialog(oDialog, aButtons);

            var oVBox = defineContent();
            oDialog.addContent(oVBox);

            return oDialog;
        };

        /**
         * Sends a MessageToast with provided Message and Duration
         *
         * @param {string} sMessage The message
         * @param {number} iDuration The duration of the MessageToast in ms
         */
        this.buildAndSendMessageToast = function (sMessage, iDuration) {
            sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                MessageToast.show(sMessage, { duration: iDuration });
            });
        };

        /**
         * Sends a MessageBox based on the provided configuration
         *
         * @param {string} sMessage The actual error message
         * @param {string} sType The type of the MessageBox. e.g.: show, confirm
         * @param {object} oConfig The configuration of the MessageBox
         */
        this.sendMessageBox = function (sMessage, sType, oConfig) {
            if (MessageBox.hasOwnProperty(sType) && typeof MessageBox[sType] === "function") {
                MessageBox[sType](sMessage, oConfig);
            } else {
                jQuery.sap.log.error("Unknown Message type: " + sType);
            }
        };

        /**
         * Shows an info message on the screen.
         *
         * @param {string} sMessage the localized message as plain text
         * @param {int} [iDuration=3000] display duration in ms (optional)
         * @methodOf sap.ushell.services.Message#
         * @name info
         * @public
         * @alias sap.ushell.services.Message#info
         */
        this.info = function (sMessage, iDuration) {
            this.show(Message.Type.INFO, sMessage, { duration: iDuration || 3000 });
        };

        /**
         * Shows an error message on the screen.
         *
         * @param {string} sMessage the localized message as plain text
         * @param {string} [sTitle] the localized title as plain text (optional)
         * @methodOf sap.ushell.services.Message#
         * @name error
         * @public
         * @alias sap.ushell.services.Message#error
         */
        this.error = function (sMessage, sTitle) {
            sMessage = (sTitle !== undefined) ? sTitle + " , " + sMessage : sMessage;
            jQuery.sap.log.error(sMessage);

            this.show(Message.Type.ERROR, sMessage, { title: sTitle });
        };

        /**
         * Shows an confirmation dialog on the screen.
         *
         * The callback is called with the following signature: <code>function(oAction)</code> where oAction is the button that the user has tapped.
         * For example, when the user has pressed the close button, a sap.m.MessageBox.Action.Close is returned.
         *
         * If no actions are provided, OK and Cancel will be shown. In this case oAction is set by one of the following three values:
         *   1. sap.m.MessageBox.Action.OK: OK (confirmed) button is tapped.
         *   2. sap.m.MessageBox.Action.Cancel: Cancel (unconfirmed) button is tapped.
         *   3. null: Confirm dialog is closed by Calling sap.m.InstanceManager.closeAllDialogs()
         *
         * @param {string} sMessage the localized message as plain text
         * @param {function} fnCallback callback function
         * @param {string} [sTitle] the localized title as plain text (optional)
         * @param {sap.m.MessageBox.Action|sap.m.MessageBox.Action[]|string|string[]} [vActions] Either a single action, or an array of two actions.
         *   If no action(s) are given, the single action MessageBox.Action.OK is taken as a default for the parameter.
         *   If more than two actions are given, only the first two actions are taken.
         *   Custom action string(s) can be provided, and then the translation of custom action string(s) needs to be done by the application.
         * @methodOf sap.ushell.services.Message#
         * @name confirm
         * @public
         * @alias sap.ushell.services.Message#confirm
         */
        this.confirm = function (sMessage, fnCallback, sTitle, vActions) {
            this.show(Message.Type.CONFIRM, sMessage, { title: sTitle, callback: fnCallback, actions: vActions });
        };
    }

    /**
     * @name sap.ushell.services.Message.Type
     * @since 1.16.0
     * @private
     */
    Message.Type = {
        INFO: 0,
        ERROR: 1,
        CONFIRM: 2
    };

    Message.hasNoAdapter = true;
    return Message;
}, true /* bExport */);
