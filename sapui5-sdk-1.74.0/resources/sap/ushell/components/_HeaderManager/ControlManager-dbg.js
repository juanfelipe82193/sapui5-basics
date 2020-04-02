// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/CustomData",
    "sap/ui/core/IconPool",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/ui/footerbar/EndUserFeedback",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/ui/shell/ShellNavigationMenu"
], function (
    CustomData,
    IconPool,
    Device,
    Config,
    EventHub,
    resources,
    ContactSupportButton,
    EndUserFeedback,
    AccessibilityCustomData,
    ShellHeadItem,
    ShellNavigationMenu
) {
    "use strict";

    // List of the dangling controls created for the ShellHeader
    var aCreatedControlIds = [];
    var aDoable = [];

    var SHELL_APP_TITLE_STATE = {
        SHELL_NAV_MENU_ONLY: 0,
        ALL_MY_APPS_ONLY: 1,
        SHELL_NAV_MENU: 2,
        ALL_MY_APPS: 3
    };

    function init (oConfig, oHeaderController, oShellModel) {
        // create header controls
        aCreatedControlIds.push(_createHomeButton(oConfig));
        aCreatedControlIds.push(_createBackButton(oHeaderController));
        aCreatedControlIds.push(_createOverflowButton(oHeaderController, oShellModel));
        aCreatedControlIds.push(_createMeAreaButton(oShellModel));

        if (Config.last("/core/shell/model/enableNotifications")) {
            aCreatedControlIds.push(_createNotificationButton(oShellModel));
        }

        if (oConfig.moveEditHomePageActionToShellHeader) {
            aCreatedControlIds.push(_createEditHomePageButton());
        }

        if (oConfig.moveAppFinderActionToShellHeader) {
            aCreatedControlIds.push(_createAppFinderButton(oConfig, oHeaderController));
        }

        if (oConfig.moveUserSettingsActionToShellHeader) {
            aCreatedControlIds.push(_createUserSettingsButton(oHeaderController));
        }

        if (oConfig.moveContactSupportActionToShellHeader) {
            aCreatedControlIds.push(_createSupportButton());
        }

        if (oConfig.moveGiveFeedbackActionToShellHeader) {
            aCreatedControlIds.push(_createFeedbackButton());
        }

        if (Config.last("/core/productSwitch/enabled")) {
            aCreatedControlIds.push(_createProductSwitchButton());
        }

        aDoable.push(EventHub.once("CoreResourcesComplementLoaded").do(function () {
            _createShellNavigationMenu(oConfig, oShellModel, oHeaderController);
        }));
    }

    function destroy () {
        aCreatedControlIds.forEach(function (sId) {
            var oControl = sap.ui.getCore().byId(sId);
            if (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            }
        });
        aDoable.forEach(function (oDoable) {
            oDoable.off();
        });
        aCreatedControlIds = [];
        aDoable = [];
    }

    function _createShellNavigationMenu (oConfig, oShellModel, oController) {
        sap.ui.require([
            "sap/m/StandardListItem",
            "sap/ushell/ui/shell/NavigationMiniTile"
        ], function (StandardListItem, NavigationMiniTile) {
            var sMenuId = "shellNavigationMenu";

            var oHierarchyTemplateFunction = function (sId, oContext) {
                var sIcon = oContext.getProperty("icon") || "sap-icon://circle-task-2",
                    sTitle = oContext.getProperty("title"),
                    sSubtitle = oContext.getProperty("subtitle"),
                    sIntent = oContext.getProperty("intent");

                var oListItem = (new StandardListItem({
                    type: "Active", // Use string literal to avoid dependency from sap.m.library
                    title: sTitle,
                    description: sSubtitle,
                    icon: sIcon,
                    customData: [new CustomData({
                        key: "intent",
                        value: sIntent
                    })],
                    press: [oController.handleNavigationMenuItemPress, oController]
                })).addStyleClass("sapUshellNavigationMenuListItems");

                return oListItem;
            };

            var oRelatedAppsTemplateFunction = function (sId, oContext) {
                // default icon behavior
                var sIcon = oContext.getProperty("icon"),
                    sTitle = oContext.getProperty("title"),
                    sSubtitle = oContext.getProperty("subtitle"),
                    sIntent = oContext.getProperty("intent");
                return new NavigationMiniTile({
                    title: sTitle,
                    subtitle: sSubtitle,
                    icon: sIcon,
                    intent: sIntent,
                    press: function () {
                        var sTileIntent = this.getIntent();
                        if (sTileIntent && sTileIntent[0] === "#") {
                            oController.navigateFromShellApplicationNavigationMenu(sTileIntent);
                        }
                    }
                });
            };

            var oShellNavigationMenu = new ShellNavigationMenu(sMenuId, {
                title: "{/application/title}",
                icon: "{/application/icon}",
                showTitle: {
                    path: "/application/showNavMenuTitle"
                },
                showRelatedApps: oConfig.appState !== "lean",
                items: {
                    path: "/application/hierarchy",
                    factory: oHierarchyTemplateFunction.bind(this)
                },
                miniTiles: {
                    path: "/application/relatedApps",
                    factory: oRelatedAppsTemplateFunction.bind(this)
                },
                visible: {
                    path: "/ShellAppTitleState",
                    formatter: function (oCurrentState) {
                        return oCurrentState === SHELL_APP_TITLE_STATE.SHELL_NAV_MENU;
                    }
                }
            });

            var oShellHeader = sap.ui.getCore().byId("shell-header");
            oShellNavigationMenu.setModel(oShellHeader.getModel());

            var oShellAppTitle = sap.ui.getCore().byId("shellAppTitle");
            if (oShellAppTitle) {
                oShellAppTitle.setNavigationMenu(oShellNavigationMenu);
            }
            aCreatedControlIds.push(sMenuId);
            return sMenuId;
        }.bind(this));
    }

    function _createUserSettingsButton (oController) {
        var oUserSettingsButton = new ShellHeadItem({
            id: "userSettingsBtn",
            icon: "sap-icon://action-settings",
            tooltip: resources.i18n.getText("userSettings"),
            text: resources.i18n.getText("userSettings"),
            press: oController.handleUserSettingsPress
        });

        return oUserSettingsButton.getId();
    }

    function _createHomeButton (oConfig) {
        var oHomeButton = new ShellHeadItem({
            id: "homeBtn",
            tooltip: resources.i18n.getText("homeBtn_tooltip"),
            ariaLabel: resources.i18n.getText("homeBtn_tooltip"),
            icon: IconPool.getIconURI("home"),
            target: oConfig.rootIntent ? "#" + oConfig.rootIntent : "#"
        });

        if (Config.last("/core/extension/enableHelp")) {
            oHomeButton.addStyleClass("help-id-homeBtn", true); // xRay help ID
        }

        oHomeButton.addCustomData(new AccessibilityCustomData({
            key: "aria-disabled",
            value: "false",
            writeToDom: true
        }));
        if (Device.system.desktop) {
            oHomeButton.addEventDelegate({
                onsapskipback: function (oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                },
                onsapskipforward: function (oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                }
            });
        }
        return oHomeButton.getId();
    }

    function _createEditHomePageButton () {
        // In case the edit home page button should move to the shell header, we create it as a ShellHeadItem
        // Text and press properties will be set in DashboardContent.view.js
        // By default it is not visible unless the personalization is enabled and the home page is shown.
        var oTileActionsButton = new ShellHeadItem({
            id: "ActionModeBtn",
            icon: "sap-icon://edit"
        });

        if (Config.last("/core/extension/enableHelp")) {
            oTileActionsButton.addStyleClass("help-id-ActionModeBtn"); // xRay help ID
        }
        return oTileActionsButton.getId();
    }

    function _createBackButton (oController) {
        var sBackButtonIcon = sap.ui.getCore().getConfiguration().getRTL() ? "feeder-arrow" : "nav-back";
        var oBackButton = new ShellHeadItem({
            id: "backBtn",
            tooltip: resources.i18n.getText("backBtn_tooltip"),
            ariaLabel: resources.i18n.getText("backBtn_tooltip"),
            icon: IconPool.getIconURI(sBackButtonIcon),
            press: oController.pressNavBackButton.bind(oController)
        });
        return oBackButton.getId();
    }

    function _createMeAreaButton (oShellModel) {
        var sId = "meAreaHeaderButton";

        var oMeAreaButton = new ShellHeadItem({
            id: sId,
            icon: "{/userImage/personPlaceHolder}",
            ariaLabel: resources.i18n.getText("MeAreaToggleButtonAria"),
            tooltip: sap.ushell.Container.getUser().getFullName(),
            press: function () {
                EventHub.emit("showMeArea", Date.now());
            }
        });
        if (Device.system.desktop) {
            oMeAreaButton.addEventDelegate({
                onsapskipforward: function (oEvent) {
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation = true;
                    oEvent.preventDefault();
                    window.document.getElementById("sapUshellHeaderAccessibilityHelper").focus();
                }
            });
        }
        oMeAreaButton.setModel(oShellModel);
        return sId;
    }

    function _applySettingsFloatingNumber (oButtonWithFloatingNumber) {
        oButtonWithFloatingNumber.applySettings({
            floatingNumber: {
                parts: ["/notificationsCount"],
                formatter: function (notificationsCount) {
                    // Set aria label
                    var jsButton = this.getDomRef(), ariaLabelValue = "";
                    if (jsButton) {
                        if (notificationsCount > 0) {
                            ariaLabelValue = resources.i18n.getText("NotificationToggleButtonCollapsed", notificationsCount);
                        } else {
                            ariaLabelValue = resources.i18n.getText("NotificationToggleButtonCollapsedNoNotifications");
                        }
                        jsButton.setAttribute("aria-label", ariaLabelValue);
                    }
                    return notificationsCount;
                }
            }
        }, true, true);
    }

    function _createNotificationButton (oShellModel) {
        // The press handler is added in the Notification Component
        var sId = "NotificationsCountButton";
        var sIconId = "bell";
        var oNotificationToggleButton = new ShellHeadItem({
            id: sId,
            icon: IconPool.getIconURI(sIconId),
            text: resources.i18n.getText("notificationsBtn_title"),
            enabled: false,
            press: function () {
                EventHub.emit("showNotifications", Date.now());
            }
        });
        oNotificationToggleButton.setModel(oShellModel);
        oNotificationToggleButton.setModel(resources.i18nModel, "i18n");
        _applySettingsFloatingNumber(oNotificationToggleButton);
        return sId;
    }

    function _createOverflowButton (oController, oShellModel) {
        var oEndItemsOverflowBtn = new ShellHeadItem({
            id: "endItemsOverflowBtn",
            tooltip: resources.i18n.getText("shellHeaderOverflowBtn_tooltip"),
            ariaLabel: resources.i18n.getText("shellHeaderOverflowBtn_tooltip"),
            icon: "sap-icon://overflow",
            press: [oController.pressEndItemsOverflow, oController]
        });
        _applySettingsFloatingNumber(oEndItemsOverflowBtn);
        oEndItemsOverflowBtn.setModel(oShellModel);
        return oEndItemsOverflowBtn.getId();
    }

    function _createAppFinderButton (oConfig, oController) {
        var oOpenCatalogButton = new ShellHeadItem({
            id: "openCatalogBtn",
            text: resources.i18n.getText("open_appFinderBtn"),
            tooltip: resources.i18n.getText("open_appFinderBtn"),
            icon: "sap-icon://sys-find",
            visible: !oConfig.disableAppFinder,
            press: oController.handleAppFinderPress
        });
        if (Config.last("/core/extension/enableHelp")) {
            oOpenCatalogButton.addStyleClass("help-id-openCatalogActionItem"); // xRay help ID
        }
        return oOpenCatalogButton.getId();
    }

    function _createSupportButton () {
        var sButtonName = "ContactSupportBtn",
            oSupportButton = sap.ui.getCore().byId(sButtonName);
        if (!oSupportButton) {
            // Create an ActionItem from MeArea (ContactSupportButton)
            // in order to to take its text and icon
            // and fire the press method when the shell header item is pressed,
            // but don't render this control
            var oTempButton = new ContactSupportButton("tempContactSupportBtn", {
                visible: true
            });

            var sIcon = oTempButton.getIcon();
            var sText = oTempButton.getText();
            oSupportButton = new ShellHeadItem({
                id: sButtonName,
                icon: sIcon,
                tooltip: sText,
                text: sText,
                press: function () {
                    oTempButton.firePress();
                }
            });
        }
        return sButtonName;
    }

    function _createFeedbackButton () {
        var sButtonName = "EndUserFeedbackBtn",
            oFeedbackButton = sap.ui.getCore().byId(sButtonName);

        if (!oFeedbackButton) {
            // Create an ActionItem from MeArea (EndUserFeedback)
            // in order to take its text and icon
            // and fire the press method when the shell header item is pressed,
            // but don't render this control

            var oTempButton = new EndUserFeedback("EndUserFeedbackHandlerBtn", {});
            var sIcon = oTempButton.getIcon();
            var sText = oTempButton.getText();
            oFeedbackButton = new ShellHeadItem({
                id: sButtonName,
                icon: sIcon,
                tooltip: sText,
                addAriaHiddenFalse: true,
                ariaLabel: sText,
                text: sText,
                visible: false // will be set to visible in case an adapter is implemented - done in shell.controller._createActionButtons
            });
        }
        return oFeedbackButton.getId();
    }

    function _createProductSwitchButton () {
        var oProductSwitchButton = new ShellHeadItem({
            id: "productSwitchBtn",
            icon: "sap-icon://grid",
            visible: false,
            tooltip: resources.i18n.getText("productSwitch_tooltip"),
            text: resources.i18n.getText("productSwitch"),
            press: function () {
                EventHub.emit("showProductSwitch", Date.now());
            }
        });

        return oProductSwitchButton.getId();
    }

    return {
        init: init,
        destroy: destroy,
        _createOverflowButton: _createOverflowButton
    };
});
