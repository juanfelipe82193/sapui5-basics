// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/ShortcutsHelpContainer",
    "sap/ui/thirdparty/jquery",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button"
], function (
    Device,
    Config,
    EventHub,
    resources,
    ShortcutsHelpContainer,
    jQuery,
    Label,
    Text,
    Dialog,
    Button
) {
    "use strict";

    /* global hasher */

    var AccessKeysHandler = function () { };

    AccessKeysHandler.prototype = {
        bFocusOnShell: true,
        bFocusPassedToExternalHandlerFirstTime: true,
        isFocusHandledByAnotherHandler: false,
        fnExternalKeysHandler: null,
        sLastExternalKeysHandlerUrl: null,
        fnExternalShortcuts: null,
        isleftAltPressed: false,
        bForwardNavigation: true,
        aShortcutsDescriptions: [],

        appOpenedHandler: function () {
            var sCurrentApplicationIntent = hasher.getHash();

            if (sCurrentApplicationIntent !== this.sLastExternalKeysHandlerUrl) {
                this.fnExternalKeysHandler = null;
            }
            this.sLastExternalKeysHandlerUrl = sCurrentApplicationIntent;
        },

        _focusItemInOverflowPopover: function (sItemId, iCounter) {
            var oOverflowPopup = sap.ui.getCore().byId("headEndItemsOverflow");

            if (oOverflowPopup && oOverflowPopup.isOpen()) {
                if (oOverflowPopup.getContent().length) {
                    this._focusIteminPopover(sItemId, oOverflowPopup.getContent()[0].getItems());
                }
            } else if (iCounter < 10) {
                var oOverFlowBtn = window.document.getElementById("endItemsOverflowBtn");

                if (oOverFlowBtn) {
                    oOverFlowBtn.click();
                    var that = this;
                    window.setTimeout(function () {
                        that._focusItemInOverflowPopover(sItemId, ++iCounter);
                    }, 300);
                }
            }
        },

        _focusItemInUserMenu: function (sItemId, iCounter) {
            var oUserMenu = sap.ui.getCore().byId("sapUshellMeAreaPopover");

            if (oUserMenu && oUserMenu.isOpen()) {
                if (oUserMenu.getContent().length) {
                    this._focusIteminPopover(sItemId, oUserMenu.getContent()[0].getItems());
                }
            } else if (iCounter < 10) {
                var that = this;
                EventHub.emit("showMeArea", Date.now());
                window.setTimeout(function () {
                    that._focusItemInUserMenu(sItemId, ++iCounter);
                }, 300);
            }
        },

        _focusIteminPopover: function (sId, aItems) {
            for (var i = 0; i < aItems.length; i++) {
                var aIdParts = aItems[i].getId().split("-");
                if (aIdParts[aIdParts.length - 1] === sId) {
                    aItems[i].getDomRef().focus();
                    return;
                }
            }
        },

        _handleAccessOverviewKey: function (bAdvancedShellActions) {
            var bSearchAvailable = this.oModel.getProperty("/searchAvailable"),
                bPersonalization = this.oModel.getProperty("/personalization"),
                bEnableNotifications = Config.last("/core/shell/model/enableNotifications");

            if (Device.browser.msie) {
                // the Internet Explorer would display its F1 help also on CTRL + F1 if the help event wasn't cancelled
                document.addEventListener("help", this._cancelHelpEvent);
            }

            var aShortCuts = [];
            aShortCuts = aShortCuts.concat(this.aShortcutsDescriptions);

            var sAltOptionText,
            sSearchKeyText;

            if (Device.os.macintosh) {
                sAltOptionText = resources.i18n.getText("OptionKey");
                sSearchKeyText = resources.i18n.getText("CommandKey");
            } else {
                sAltOptionText = resources.i18n.getText("AltKey");
                sSearchKeyText = resources.i18n.getText("ControlKey");
            }

            if (window.document.getElementById("shell-header")) {
                if (bPersonalization && bAdvancedShellActions) {
                    aShortCuts.push({
                        text: sAltOptionText + " + A",
                        description: resources.i18n.getText("hotkeyFocusOnAppFinderButton")
                    });
                }

                if (bSearchAvailable) {
                    aShortCuts.push({
                        text: sAltOptionText + " + F",
                        description: resources.i18n.getText("hotkeyFocusOnSearchButton")
                    });
                }

                aShortCuts.push({
                    text: sAltOptionText + " + H",
                    description: resources.i18n.getText("hotkeyHomePage")
                });
                aShortCuts.push({
                    text: sAltOptionText + " + M",
                    description: resources.i18n.getText("hotkeyFocusOnUserActionMenu")
                });

                if (bEnableNotifications) {
                    aShortCuts.push({
                        text: sAltOptionText + " + N",
                        description: resources.i18n.getText("hotkeyFocusOnNotifications")
                    });
                }

                if (bAdvancedShellActions) {
                    aShortCuts.push({
                        text: sAltOptionText + " + S",
                        description: resources.i18n.getText("hotkeyFocusOnSettingsButton")
                    });
                    aShortCuts.push({
                        text: resources.i18n.getText("ControlKey") + " + " + resources.i18n.getText("CommaKey"),
                        description: resources.i18n.getText("hotkeyOpenSettings")
                    });
                }

                if (bPersonalization) {
                    aShortCuts.push({
                        text: resources.i18n.getText("ControlKey") + " + " + resources.i18n.getText("EnterKey"),
                        description: resources.i18n.getText("hotkeySaveEditing")
                    });
                }

                if (bSearchAvailable) {
                    aShortCuts.push({
                        text: sSearchKeyText + " + " + resources.i18n.getText("ShiftKey") + " + F",
                        description: resources.i18n.getText("hotkeyFocusOnSearchField")
                    });
                }
            }
            var oShortcutsHelpContainer = new ShortcutsHelpContainer();

            aShortCuts.forEach(function (sViewName) {
                oShortcutsHelpContainer.addContent(new Label({ text: sViewName.description }));
                oShortcutsHelpContainer.addContent(new Text({ text: sViewName.text }));
            });

            var oDialog = new Dialog({
                id: "hotKeysGlossary",
                title: resources.i18n.getText("hotKeysGlossary"),
                contentWidth: "29.6rem",
                content: oShortcutsHelpContainer,
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.setBeginButton(new Button({
                text: resources.i18n.getText("okBtn"),
                press: function () {
                    oDialog.close();
                }
            }));

            oDialog.open();
        },

        _focusAppFinderButton: function () {
            var oAppFinderBtn = window.document.getElementById("openCatalogBtn");

            if (oAppFinderBtn) {
                oAppFinderBtn.focus();
                return;
            }

            var oConfig = sap.ushell.Container.getRenderer("fiori2").getShellConfig();
            if (oConfig.moveAppFinderActionToShellHeader) {
                this._focusItemInOverflowPopover("openCatalogBtn", 0);
                return;
            }

            this._focusItemInUserMenu("openCatalogBtn", 0);
        },

        _focusSettingsButton: function () {
            var oSettingsBtn = window.document.getElementById("userSettingsBtn");

            if (oSettingsBtn) {
                oSettingsBtn.focus();
                return;
            }

            var oConfig = sap.ushell.Container.getRenderer("fiori2").getShellConfig();
            if (oConfig.moveUserSettingsActionToShellHeader) {
                this._focusItemInOverflowPopover("userSettingsBtn", 0);
                return;
            }

            this._focusItemInUserMenu("userSettingsBtn", 0);
        },

        _blockBrowserDefault: function (oEvent) {
            return new Promise(function (resolve) {
                if (Device.browser.name === "ie") {
                    var oShellHeader = window.document.getElementById("shell-header");
                    if (oShellHeader) {
                        // Set HTML accesskey attribute. This is important, inorder to overwrite IE default accesskeys
                        oShellHeader.setAttribute("accesskey", oEvent.key);

                        window.setTimeout(function () {
                            // Remove HTML accesskey attribute again after some time.
                            oShellHeader = window.document.getElementById("shell-header");
                            if (oShellHeader) {
                                oShellHeader.removeAttribute("accesskey");
                                resolve();
                            }
                        }, 0);
                    }
                } else {
                    resolve();
                }
                // Prevent default, inorder to overwrite Firefox default accesskeys
                oEvent.preventDefault();
            });
        },

        _handleAltShortcutKeys: function (oEvent, bAdvancedShellActions) {
            var oShellHeader = sap.ui.getCore().byId("shell-header"),
                oUserMenu = sap.ui.getCore().byId("sapUshellMeAreaPopover"),
                oNotificationsPopup = sap.ui.getCore().byId("shellNotificationsPopover");

            if (oShellHeader) {
                if (bAdvancedShellActions) {
                    if (oEvent.keyCode === 65) { // ALT + A
                        this._blockBrowserDefault(oEvent).then(this._focusAppFinderButton.bind(this));
                    } else if (oEvent.keyCode === 83) {
                        this._blockBrowserDefault(oEvent).then(this._focusSettingsButton.bind(this));
                    }
                }
                if (oEvent.keyCode === 70) { // ALT + F
                    this._blockBrowserDefault(oEvent).then(function () {
                        var oSearchBtn = window.document.getElementById("sf"),
                            oSerchFieldBtn = window.document.getElementById("searchFieldInShell-button");
                        if (oSearchBtn) {
                            oSearchBtn.focus();
                        } else if (oSerchFieldBtn) {
                            oSerchFieldBtn.focus();
                        } else {
                            this._focusItemInOverflowPopover("sf", 0);
                        }
                    }.bind(this));
                } else if (oEvent.keyCode === 72) { // ALT + H
                    this._blockBrowserDefault(oEvent).then(function () {
                        window.hasher.setHash(oShellHeader.getHomeUri());

                        // Close User menu if open
                        if (oUserMenu && oUserMenu.isOpen()) {
                            EventHub.emit("showMeArea", false);
                        }

                        // Close Notification Popover if open
                        if (oNotificationsPopup && oNotificationsPopup.isOpen()) {
                            EventHub.emit("showNotifications", false);
                        }

                        var oAppTitle = window.document.getElementById("shellAppTitle");
                        if (oAppTitle) {
                            oAppTitle.focus();
                        }
                    });
                } else if (oEvent.keyCode === 77) { // ALT + M
                    this._blockBrowserDefault(oEvent).then(function () {
                        if (!(oUserMenu && oUserMenu.isOpen())) {
                            EventHub.emit("showMeArea", Date.now());
                        }
                    });
                } else if (oEvent.keyCode === 78) { // ALT + N
                    this._blockBrowserDefault(oEvent).then(function () {
                        if (!(oNotificationsPopup && oNotificationsPopup.isOpen())) {
                            EventHub.emit("showNotifications", Date.now());
                        }
                    });
                }
            }
        },

        _handleCtrlShortcutKeys: function (oEvent, bAdvancedShellActions) {
            if (oEvent.shiftKey) {
                if (oEvent.keyCode === 70) { // CTRL + SHIFT + F
                    var oSearchBtn = sap.ui.getCore().byId("sf");
                    if (oSearchBtn) {
                        oSearchBtn.firePress();
                        oEvent.preventDefault();
                        oEvent.stopPropagation();
                    }
                }
            } else if (oEvent.keyCode === 188 && bAdvancedShellActions) { // CTRL + COMMA
                var oSettingsBtn = sap.ui.getCore().byId("userSettingsBtn");
                if (oSettingsBtn && !jQuery(window.document.activeElement).parents(".sapUiCompSmartTable, .sapUiMdcTable").length) {
                    oSettingsBtn.firePress();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            } else if (oEvent.keyCode === 112) { // CTRL + F1
                this._handleAccessOverviewKey(bAdvancedShellActions);
            } else if (oEvent.keyCode === 83) { // CTRL + S
                var appFinderSearchBtn = window.document.getElementById("appFinderSearch-I");
                if (appFinderSearchBtn) {
                    appFinderSearchBtn.focus();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            } else if (oEvent.keyCode === 13) { // CTRL + Enter
                var oDoneButton = sap.ui.getCore().byId("sapUshellDashboardFooterDoneBtn");
                if (oDoneButton && oDoneButton.getDomRef()) {
                    oDoneButton.firePress();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            }
        },

        /**
         * Reacts on given keyboard events
         *
         * @param {object} oEvent the event that contains all the information about the keystroke
         * @param {boolean} bAdvancedShellActions true if advanced shell actions are available
         */
        handleShortcuts: function (oEvent, bAdvancedShellActions) {
            if (Device.os.macintosh && oEvent.metaKey && oEvent.shiftKey && oEvent.keyCode === 70) { // CMD + SHIFT + F
                var oSearchBtn = window.document.getElementById("sf");
                if (oSearchBtn) {
                    oSearchBtn.firePress();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
                oEvent.preventDefault();
            } else if (oEvent.altKey && !oEvent.shiftKey && !oEvent.ctrlKey) {
                this._handleAltShortcutKeys(oEvent, bAdvancedShellActions);
            } else if (oEvent.ctrlKey && !oEvent.altKey) {
                this._handleCtrlShortcutKeys(oEvent, bAdvancedShellActions);
            }
        },

        registerAppKeysHandler: function (fnHandler) {
            this.fnExternalKeysHandler = fnHandler;
            this.sLastExternalKeysHandlerUrl = hasher.getHash();
        },

        resetAppKeysHandler: function () {
            this.fnExternalKeysHandler = null;
        },

        getAppKeysHandler: function () {
            return this.fnExternalKeysHandler;
        },

        registerAppShortcuts: function (fnHandler, aShortcutsDescriptions) {
            this.fnExternalShortcuts = fnHandler;
            this.aShortcutsDescriptions = aShortcutsDescriptions;
        },

        /*
         * This method is responsible to restore focus in the shell (according to the event & internal logic)
         *
         * New parameter added : sIdForFocus
         * This parameter in case supplied overrides the event/internal logic handling and enforces the focus
         * on the element with the corresponding id.
         */
        _handleFocusBackToMe: function (oEvent, sIdForFocus) {
            this.bFocusOnShell = true;
            var oFocusable;

            if (sIdForFocus) {
                oFocusable = window.document.getElementById(sIdForFocus);
            } else {
                this.fromOutside = true;

                if (oEvent) {
                    oEvent.preventDefault();
                    this.bForwardNavigation = !oEvent.shiftKey || oEvent.key === "F6";
                }
                oFocusable = window.document.getElementById("sapUshellHeaderAccessibilityHelper");
            }

            if (oFocusable) {
                oFocusable.focus();
                this.fromOutside = false;
            }

            //reset flag
            this.bFocusPassedToExternalHandlerFirstTime = true;
        },

        setIsFocusHandledByAnotherHandler: function (bHandled) {
            this.isFocusHandledByAnotherHandler = bHandled;
        },

        /*
         * This method is responsible to restore focus in the shell (according to the event & internal logic)
         *
         * Added support to pass either an Event (e.g. KBN) to determine which area to focus on the shell
         * OR
         * String which is actually ID for a specific control to focus on
         */
        sendFocusBackToShell: function (oParam) {
            var oEvent,
                sIdForFocus;

            if (typeof oParam === "string") {
                sIdForFocus = oParam;
            } else if (typeof oParam === "object") {
                oEvent = oParam;
            }

            this._handleFocusBackToMe(oEvent, sIdForFocus);
        },

        _handleEventUsingExternalKeysHandler: function (oEvent) {
            if (!this.bFocusOnShell && !this.isFocusHandledByAnotherHandler) {
                if (this.fnExternalKeysHandler && jQuery.isFunction(this.fnExternalKeysHandler)) {
                    this.fnExternalKeysHandler(oEvent, this.bFocusPassedToExternalHandlerFirstTime);
                    this.bFocusPassedToExternalHandlerFirstTime = false;
                }
            }
            // reset flag
            this.setIsFocusHandledByAnotherHandler(false);
        },

        _cancelHelpEvent: function (oEvent) {
            oEvent.preventDefault();
            // deregister immediately so that F1 still works
            document.removeEventListener("help", this._cancelHelpEvent);
        },

        init: function (oModel) {
            this.oModel = oModel;
            // prevent browser event ctrl+up/down from scrolling page
            // created by user `keydown` native event needs to be cancelled so browser will not make default action, which is scroll.
            // Instead we clone same event and dispatch it programmatic, so all handlers expecting to this event will still work

            document.addEventListener("keydown", function (oEvent) {
                // if Shift key was pressed alone, don't perform any action
                if (oEvent.keyCode === 16) {
                    return;
                }

                for (var oElement = window.document.activeElement; oElement !== window.document.body; oElement = oElement.parentElement) {
                    if (oElement.classList.contains("sapMDialog")) {
                        return;
                    }
                }

                this.bForwardNavigation = !oEvent.shiftKey;

                // make sure that UI5 events (sapskipforward/saptabnext/etc.) will run before the document.addEventListener("keydown"...
                // code in the AccessKeysHandler as it was before when we used jQuery(document).on('keydown'..
                if (oEvent.key === "Tab" || oEvent.key === "F6") {
                    setTimeout(function () {
                        this._handleEventUsingExternalKeysHandler(oEvent);
                    }.bind(this), 0);
                } else {
                    this._handleEventUsingExternalKeysHandler(oEvent);
                }

                if (oEvent.keyCode === 18) { //Alt key
                    if (oEvent.location === window.KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
                        this.isleftAltPressed = true;
                    } else {
                        this.isleftAltPressed = false;
                    }
                }

                // check for shortcuts only if you pressed a combination of keyboards containing the left ALT key,
                // or without any ALT key at all
                if (this.isleftAltPressed || !oEvent.altKey) {
                    var sCurrentState = Config.last("/core/shell/model/currentState/stateName");
                    if (sCurrentState !== "headerless" && sCurrentState !== "headerless-home") {
                        var bAdvancedShellActions = (sCurrentState === "home" || sCurrentState === "app" || sCurrentState === "minimal");
                        this.handleShortcuts(oEvent, bAdvancedShellActions);
                    }

                    if (this.fnExternalShortcuts) {
                        this.fnExternalShortcuts(oEvent);
                    }
                }
            }.bind(this), true); // End of event handler

            // save the bound function so that it can be deregistered later
            this._cancelHelpEvent = this._cancelHelpEvent.bind(this);
        }
    };

    var accessKeysHandler = new AccessKeysHandler();
    EventHub.on("AppRendered").do(AccessKeysHandler.prototype.appOpenedHandler.bind(accessKeysHandler));

    return accessKeysHandler;
}, /* bExport= */ true);
