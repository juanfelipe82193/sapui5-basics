// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ui/core/UIComponent",
    "sap/ushell/utils",
    "sap/ushell/EventHub",
    "sap/ui/Device",
    "sap/m/Popover",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/IconPool",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/library"
], function (
    resources,
    UIComponent,
    utils,
    EventHub,
    Device,
    Popover,
    Log,
    jQuery,
    IconPool,
    AccessibilityCustomData,
    mobileLibrary
) {
    "use strict";

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    function getNotificationButton () {
        return sap.ui.getCore().byId("NotificationsCountButton");
    }

    return UIComponent.extend("sap.ushell.components.shell.Notifications.Component", {
        metadata: {
            version: "1.74.0",
            library: "sap.ushell.components.shell.Notifications",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createContent: function () {
            this._aTimeouts = [];
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");
            this.oNotificationsService = sap.ushell.Container.getService("Notifications");
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", this._handleAlerts, this);

            if (this.oNotificationsService.isEnabled() === true) {
                this.oRenderer.shellCtrl.getModel().setProperty("/enableNotifications", true);
                this.oNotificationsService.init();
                if (this.oRenderer.getShellConfig().enableNotificationsUI === true) {
                    this.oRenderer.shellCtrl.getModel().setProperty("/enableNotificationsUI", true);
                    this.oNotificationsService.registerDependencyNotificationsUpdateCallback(this._updateCount.bind(this), true);
                }
            }

            var oNotificationToggle = getNotificationButton();
            oNotificationToggle.applySettings({
                icon: IconPool.getIconURI("bell"),
                floatingNumber: "{/notificationsCount}",
                visible: "{/enableNotifications}",
                selected: false,
                enabled: true,
                tooltip: resources.i18n.getText("NotificationToggleButtonExpanded")
            }, true, true);

            oNotificationToggle.addEventDelegate({
                onAfterRendering: function () {
                    var count = this.getDisplayFloatingNumber();
                    if (count > 0) {
                        this.$().attr("aria-label", resources.i18n.getText("NotificationToggleButtonCollapsed", count));
                    } else {
                        this.$().attr("aria-label", resources.i18n.getText("NotificationToggleButtonCollapsedNoNotifications"));
                    }
                }.bind(oNotificationToggle)
            });

            if (this.oRenderer.oShellModel.getModel().getProperty("/enableNotificationsUI") === true) {
                this.oRenderer.addHeaderEndItem(["NotificationsCountButton"], false, ["home", "app", "minimal"], true);
            }

            EventHub.on("showNotifications").do(this._toggleNotifications.bind(this));
        },

        _handleAlerts: function (sChannelId, sEventId, aNewNotifications) {
            (aNewNotifications || []).forEach(this.handleNotification.bind(this));
        },

        // Alert (badge in the UXC terminology)
        handleNotification: function (oNotification) {
            //create an element of RightFloatingContainer
            var oAlertEntry = this.oRenderer.addRightFloatingContainerItem({
                press: function () {
                    this.oPopover.close();
                    if (window.hasher.getHash() !== oNotification.NavigationTargetObject + "-" + oNotification.NavigationTargetAction) {
                        utils.toExternalWithParameters(
                            oNotification.NavigationTargetObject,
                            oNotification.NavigationTargetAction,
                            oNotification.NavigationTargetParams
                        );
                    }
                    this.oNotificationsService.markRead(oNotification.Id);
                },
                datetime: resources.i18n.getText("notification_arrival_time_now"),
                title: oNotification.SensitiveText ? oNotification.SensitiveText : oNotification.Text,
                description: oNotification.SubTitle,
                unread: oNotification.IsRead,
                priority: "High",
                hideShowMoreButton: true
            }, true, true);
            this.oRenderer.showRightFloatingContainer(true);
            var timeout = setTimeout(function () {
                this.oRenderer.removeRightFloatingContainerItem(oAlertEntry.getId(), true);
            }.bind(this), 3500);
            this._aTimeouts.push(timeout);
        },

        // Update the notifications count in the UI
        // The new count is also displayed when the notifications popover is already opened
        _updateCount: function () {
            var oModel = this.oRenderer.oShellModel.getModel();
            this.oNotificationsService.getUnseenNotificationsCount().done(function (iNumberOfNotifications) {
                oModel.setProperty("/notificationsCount", parseInt(iNumberOfNotifications, 10));
            }).fail(function (data) {
                Log.error("Notifications - call to notificationsService.getCount failed: ", data);
            });
        },

        _getPopover: function () {
            if (!this.oPopover) {
                var oNotificationView = sap.ui.view("notificationsView", {
                    viewName: "sap.ushell.components.shell.Notifications.Notifications",
                    type: "XML",
                    viewData: {}
                });

                oNotificationView.addCustomData(new AccessibilityCustomData({
                    key: "role",
                    value: "region",
                    writeToDom: true
                }));
                oNotificationView.addCustomData(new AccessibilityCustomData({
                    key: "aria-label",
                    value: resources.i18n.getText("NotificationToggleButtonExpanded"),
                    writeToDom: true
                }));

                this.oPopover = new Popover("shellNotificationsPopover", {
                    showHeader: false,
                    placement: PlacementType.Bottom,
                    showArrow: true,
                    content: oNotificationView,
                    beforeClose: function (oEvent) {
                        // Workaround to fix 1980098133
                        // Should be removed later
                        oEvent.getSource().getContent()[0].invalidate();
                        this._resetCount();
                    }.bind(this)
                }).addStyleClass("sapUshellNotificationsPopup sapUiSizeCompact");
            }
            return this.oPopover;
        },

        _toggleNotifications: function (bShow) {
            var oPopover = this._getPopover();
            var oSource = getNotificationButton();

            // if the button is hidden in the overflow, use the overflow button itself
            if (!oSource.$().width()) {
                oSource = sap.ui.getCore().byId("endItemsOverflowBtn");
            }

            if (oPopover.isOpen()) {
                oPopover.close();
            } else if (bShow !== false) { // Special case: ComponentKeysHandler may emit showNotifications:false
                this._resetCount();
                // Set content width to avoid jumping of the contents
                oPopover.setContentWidth(jQuery("body").width() >= 600 ? "31.1rem" : undefined); // full width on phones
                oPopover.openBy(oSource);
            }
        },

        _resetCount: function () {
            sap.ushell.Container.getRenderer("fiori2").oShellModel.getModel().setProperty("/notificationsCount", 0);
            sap.ushell.Container.getService("Notifications").notificationsSeen();
        },

        exit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", this._handleAlerts, this);
            if (this.oNotificationsService.isEnabled() === true) {
                this.oNotificationsService.destroy();
            }
            this.oNotificationsService = null;
            this.oRenderer = null;
            if (this.oPopover) {
                this.oPopover.destroy();
                this.oPopover = null;
            }
            this._aTimeouts.forEach(window.clearTimeout); // clear pending timeouts
        }
    });
});
