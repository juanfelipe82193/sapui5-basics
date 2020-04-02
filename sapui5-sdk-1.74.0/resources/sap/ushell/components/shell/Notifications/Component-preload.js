//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/Notifications/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
},
	"sap/ushell/components/shell/Notifications/Notifications.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/utils",
    "sap/ushell/resources",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/CustomListItem",
    "sap/ui/thirdparty/jquery",
    "sap/ui/events/KeyCodes",
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/library",
    "sap/ui/core/library"
], function (
    Device,
    utils,
    resources,
    Text,
    VBox,
    CustomListItem,
    jQuery,
    KeyCodes,
    Log,
    JSONModel,
    MessageToast,
    mobileLibrary,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.ui.core.Priority
    var Priority = coreLibrary.Priority;

    // shortcut for sap.m.ListType
    var ListType = mobileLibrary.ListType;

    // shortcut for sap.m.FlexAlignItems
    var FlexAlignItems = mobileLibrary.FlexAlignItems;

    sap.ui.controller("sap.ushell.components.shell.Notifications.Notifications", {
        oPagingConfiguration: {
            MAX_NOTIFICATION_ITEMS_DESKTOP: 400,
            MAX_NOTIFICATION_ITEMS_MOBILE: 100,
            MIN_NOTIFICATION_ITEMS_PER_BUFFER: 15,
            // Approximate height of notification item according to the device
            NOTIFICATION_ITEM_HEIGHT: (Device.system.phone || Device.system.tablet) ? 130 : 100,
            // Approximate height of the area above the notifications list
            TAB_BAR_HEIGHT: 100
        },

        /**
         * Initializing Notifications view/controller with ByDate/descending tab in front
         *
         * Main steps:
         *   1. The model is filled with an entry (all properties are initially empty) for each sorting type
         *   2. Gets first buffer of notification items ByDate/descending
         *   3. Sets the first data buffer to the model
         */
        onInit: function () {
            var oInitialModelStructure = {};

            if (Device.system.desktop) {
                this.iMaxNotificationItemsForDevice = this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_DESKTOP;
            } else {
                this.iMaxNotificationItemsForDevice = this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_MOBILE;
            }

            this.oNotificationsService = sap.ushell.Container.getService("Notifications");
            this.oSortingType = this.oNotificationsService.getOperationEnum();

            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING] = this.getInitialSortingModelStructure();
            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING] = this.getInitialSortingModelStructure();
            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING] = this.getInitialSortingModelStructure();
            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING] = {};

            this.sCurrentSorting = this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;
            // need to save the sorting of the date list, because the sorting should keep when change tabs
            this.oPreviousByDateSorting = this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;
            this.oPreviousTabKey = "sapUshellNotificationIconTabByDate";

            // For byType sorting: keeps the currently expended group/Notification type
            this.sCurrentExpandedType = undefined;

            var oModel = new JSONModel(oInitialModelStructure);
            oModel.setSizeLimit(1500);
            // Initializing the model with a branch for each sorting type
            this.getView().setModel(oModel);

            this.getView().setModel(resources.i18nModel, "i18n");

            // Get the first buffer of notification items, byDate (descending)
            this.getNextBuffer();

            this._oTopNotificationData = undefined;
        },

        onAfterRendering: function () {
            this.removeTabIndexFromList(this.sCurrentSorting);

            var oTabBarHeader = this.getView().byId("notificationIconTabBar--header");
            if (oTabBarHeader) {
                // TODO: remove this workaround when BCP 1970336135 is resolved
                oTabBarHeader.getDomRef().classList.remove("sapContrastPlus"); // "sapContrastPlus" class is not removed with "removeStyleClass()" or "toggleStyleClass()"
            }

            if (this.sCurrentSorting !== this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                if (this._oTopNotificationData) {
                    this.scrollToItem(this._oTopNotificationData);
                }
            }

            this.getView().$("-sapUshellNotificationIconTabByDate-text")
                .attr("aria-label", resources.i18n.getText("notificationsSortByDateDescendingTooltip"));
            this.getView().$("-sapUshellNotificationIconTabByType-text")
                .attr("aria-label", resources.i18n.getText("notificationsSortByTypeTooltip"));
            this.getView().$("-sapUshellNotificationIconTabByPrio-text")
                .attr("aria-label", resources.i18n.getText("notificationsSortByPriorityTooltip"));
        },

        // check if the get next buffer should fetch more notifications
        shouldFetchMoreNotifications: function () {
            var bHasMoreItemsInBackend = this.getView().getModel().getProperty("/" + this.sCurrentSorting + "/hasMoreItemsInBackend"),
                bListMaxReached = this.getView().getModel().getProperty("/" + this.sCurrentSorting + "/listMaxReached");
            return bHasMoreItemsInBackend && !bListMaxReached;
        },

        /**
         * Gets a buffer of notification items from notification service, according to the current sorting type
         */
        getNextBuffer: function () {
            var sCurrentSorting = this.sCurrentSorting,
                aCurrentItems = this.getItemsFromModel(sCurrentSorting),
                iNumberOfItemsInModel,
                oPromise,
                iNumberOfItemsToFetch;

            if (!this.shouldFetchMoreNotifications()) {
                return;
            }

            iNumberOfItemsToFetch = this.getNumberOfItemsToFetchOnScroll(sCurrentSorting);
            if (iNumberOfItemsToFetch === 0) {
                this.getView().getModel().setProperty("/" + sCurrentSorting + "/hasMoreItems", false);
                return;
            }

            if (aCurrentItems !== undefined) {
                iNumberOfItemsInModel = aCurrentItems.length;
            }

            if (iNumberOfItemsInModel === 0) {
                this.addBusyIndicatorToTabFilter(sCurrentSorting);
            }

            this.getView().getModel().setProperty("/" + sCurrentSorting + "/inUpdate", true);

            // Fetch a buffer of notification items from notification service
            oPromise = this.oNotificationsService.getNotificationsBufferBySortingType(sCurrentSorting, iNumberOfItemsInModel, iNumberOfItemsToFetch);

            oPromise.done(function (oResult) {
                var dNotificationsUserSettingsAvalaibility = this.oNotificationsService._getNotificationSettingsAvalability();
                if (dNotificationsUserSettingsAvalaibility.state() === "pending") {
                    this.oNotificationsService._userSettingInitialization();
                }
                this.addBufferToModel(sCurrentSorting, oResult);
            }.bind(this));

            oPromise.fail(function (/*oResult*/) {
                if (iNumberOfItemsInModel === 0) {
                    this.removeBusyIndicatorToTabFilter(sCurrentSorting);
                    this.handleError();
                }
            }.bind(this));
        },

        /**
         * Gets a buffer of notification items of specific type from notification service
         */
        getNextBufferForType: function () {
            var selectedTypeId = this.sCurrentExpandedType,
                sSotringType = this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,
                oGroup = this.getGroupFromModel(selectedTypeId),
                aCurrentItems = oGroup ? oGroup.aNotifications : undefined,
                iNumberOfItemsInModel = 0,
                oPromise,
                bHasMoreItems = oGroup ? oGroup.hasMoreItems : true;

            // If there are no more notification items (in the backend) for this sorting type - then return
            if (!bHasMoreItems) {
                return;
            }
            if (aCurrentItems !== undefined) {
                iNumberOfItemsInModel = aCurrentItems.length;
            }

            this.getView().getModel().setProperty("/" + sSotringType + "/inUpdate", true);

            // Fetch a buffer of notification items from notification service
            oPromise = this.oNotificationsService.getNotificationsBufferInGroup(selectedTypeId, iNumberOfItemsInModel, this.iMaxNotificationItemsForDevice);

            oPromise.done(function (oResult) {
                this.addTypeBufferToModel(selectedTypeId, oResult, false);
            }.bind(this));

            oPromise.fail(function (/*oResult*/) {
                this.getNextBufferFailHandler(sSotringType);
            }.bind(this));
        },

        /**
         * Adds a new buffer of notification items to the model in the correct model path according to the specific sorting type.
         * The hasMoreItems flag indicates whether the number of returned items is smaller than the size of the requested buffer,
         * if so (i.e. oResultObj.value.length < getNumberOfItemsToFetchOnScroll) then there are no more items in the beckend for this sorting type.
         *
         * @param {String} sSorting The sotring which should be updated
         * @param {object} oResult The data (notification items) to insert to the model
         */
        addBufferToModel: function (sSorting, oResult) {
            var aCurrentItems = this.getItemsFromModel(sSorting),
                iCurrentNumberOfItems = aCurrentItems.length,
                mergedArrays,
                hasMoreItems = oResult.length >= this.getNumberOfItemsToFetchOnScroll(sSorting);

            this._oTopNotificationData = undefined;

            if (!oResult) {
                this.getView().getModel().setProperty("/" + sSorting + "/hasMoreItemsInBackend", false);
                return;
            }

            // If the number of returned items is smaller than the number that was requested -
            // it means that there is no more data (i.e. notification items) in the backend that needs to be fetched for this sorting type

            this.getView().getModel().setProperty("/" + sSorting + "/hasMoreItemsInBackend", hasMoreItems);

            mergedArrays = aCurrentItems.concat(oResult);
            this.getView().getModel().setProperty("/" + sSorting + "/aNotifications", mergedArrays);
            this.getView().getModel().setProperty("/" + sSorting + "/inUpdate", false);
            if (mergedArrays.length >= this.iMaxNotificationItemsForDevice) {
                this.handleMaxReached(sSorting);
            }

            this.handleListCSSClass(sSorting, !mergedArrays.length);

            // If this is the first time that items are fetched for this tab\sorting type (no old items) -
            // then the busy indicator was rendered and now needs to be removed
            if (iCurrentNumberOfItems === 0) {
                this.removeBusyIndicatorToTabFilter(sSorting);
            }
        },

        /**
         * Adds a new buffer of notification items to the model in the correct type and path according to the type.
         * The hasMoreItems flag indicates whether the number of returned items is smaller than the size of the requested buffer,
         * if so (i.e. oResultObj.value.length < getBasicBufferSize()) then there are no more items in the beckend for this sorting type.
         *
         * @param {string} sTypeId A string representing both the type Id
         * @param {object} oResult The data (notification items) to insert to the type model
         * @param {boolean} bOverwrite Overwrite the current buffer
         */
        addTypeBufferToModel: function (sTypeId, oResult, bOverwrite) {
            var oGroup = this.getGroupFromModel(sTypeId),
                oGroupIndexInModel = this.getGroupIndexFromModel(sTypeId),
                aGroupHeaders = this.getView().getModel().getProperty("/" + this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),
                mergedArrays;

            if (!oResult) {
                return;
            }
            // If the number of returned items is smaller than the number that was requested -
            // it means that there is no more data (i.e. notification items) in the backend that needs to be fetched for this sorting type
            // if (oResultObj.value.length < this.getBasicBufferSize()) {
            if (oResult.length < this.getBasicBufferSize()) {
                oGroup.hasMoreItems = false;
            }
            if (!oGroup.aNotifications || bOverwrite) {
                oGroup.aNotifications = [];
            }
            mergedArrays = oGroup.aNotifications.concat(oResult);
            aGroupHeaders[oGroupIndexInModel].aNotifications = mergedArrays;
            aGroupHeaders[oGroupIndexInModel].Busy = false;

            this.getView().getModel().setProperty("/" + this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING, aGroupHeaders);
            this.getView().getModel().setProperty("/" + this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING + "/inUpdate", false);
        },

        keydownHandler: function (keyup) {
            var jqElement,
                nextElem,
                closeBtn;

            if (keyup.keyCode === KeyCodes.DELETE) {
                jqElement = jQuery(document.activeElement);
                if (jqElement.hasClass("sapUshellNotificationsListItem")) {
                    nextElem = jqElement.next();
                    closeBtn = jqElement.find(".sapMNLB-CloseButton")[0];
                    sap.ui.getCore().byId(closeBtn.id).firePress();

                    // set focus on the next list item.
                    if (nextElem) {
                        nextElem.focus();
                    }
                }
            }
        },

        /**
         * Called by notification service for handling notifications update
         *
         * - Registered as callback using a call to this.oNotificationsService.registerNotificationsUpdateCallback
         * - Called by Notifications service when updated notifications data is obtained
         * - Gets the updated notifications array and sets the model accordingly
         * @param {object} oDependenciesDeferred Dependencies promise
         */
        notificationsUpdateCallback: function (oDependenciesDeferred) {
            var that = this,
                sCurrentSorting = this.sCurrentSorting,
                aCurrentItems,
                iNumberOfItemsInModel,
                iNumberOfItemsToFetch;

            if (sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                this.notificationsUpdateCallbackForType();

                // If there is any flow in any module that depends on this flow - release it
                // see notification service private API registerDependencyNotificationsUpdateCallback
                oDependenciesDeferred.resolve();
                return;
            }

            aCurrentItems = this.getItemsFromModel(sCurrentSorting);
            if (aCurrentItems !== undefined) {
                iNumberOfItemsInModel = aCurrentItems.length;
            }

            // On update, only the current tab/sorting should maintain its previous data,
            // while other tabs (i.e. the model branch) should be emptied
            this.cleanModel();

            iNumberOfItemsToFetch = this.getNumberOfItemsToFetchOnUpdate(iNumberOfItemsInModel);

            this.oNotificationsService.getNotificationsBufferBySortingType(sCurrentSorting, 0, iNumberOfItemsToFetch).done(function (aNotifications) {
                if (!aNotifications) {
                    return;
                }

                // If there is any flow in any module that depends on this flow - release it
                // see notification service private API registerDependencyNotificationsUpdateCallback
                oDependenciesDeferred.resolve();

                // Updating the model with the updated array of notification objects
                that.replaceItemsInModel(sCurrentSorting, aNotifications, iNumberOfItemsToFetch);
            }).fail(function (data) {
                Log.error("Notifications control - call to notificationsService.getNotificationsBufferBySortingType failed: ",
                    data,
                    "sap.ushell.components.shell.Notifications.Notifications");
            });
        },

        isMoreCircleExist: function (sSorting) {
            var oSelectedList = this.getNotificationList(sSorting),
                iItemsLength = oSelectedList.getItems().length,
                oLastItem = oSelectedList.getItems()[iItemsLength - 1];
            return !!iItemsLength && oLastItem.getMetadata().getName() === "sap.m.CustomListItem";
        },

        handleMaxReached: function (sSorting) {
            var oSelectedList = this.getNotificationList(sSorting),
                iNotificationCount = Math.floor(this.oNotificationsService.getNotificationsCount()),
                iMoreNotificationsNumber = iNotificationCount - this.iMaxNotificationItemsForDevice,
                bIsMoreCircleExist = this.isMoreCircleExist(sSorting);

            this.getView().getModel().setProperty("/" + this.sCurrentSorting + "/moreNotificationCount", iMoreNotificationsNumber);
            this.getView().getModel().setProperty("/" + this.sCurrentSorting + "/listMaxReached", iMoreNotificationsNumber >= 0);
            if (iMoreNotificationsNumber > 0 && !bIsMoreCircleExist) {
                oSelectedList.addItem(this.getMoreCircle(this.sCurrentSorting));
            } else if (iMoreNotificationsNumber <= 0 && bIsMoreCircleExist) {
                oSelectedList.removeItem(this.oMoreListItem);
            }
        },

        reAddFailedGroup: function (oGroupToAdd) {
            var oModel = this.getView().getModel(),
                aGroups = oModel.getProperty("/notificationsByTypeDescending");

            aGroups.splice(oGroupToAdd.removedGroupIndex, 0, oGroupToAdd.oGroup);
            oModel.setProperty("/notificationsByTypeDescending", aGroups);
        },

        removeGroupFromModel: function (oGroupToDelete) {
            var oModel = this.getView().getModel(),
                aGroups = oModel.getProperty("/notificationsByTypeDescending"),
                oRemovedGroup = {
                    oGroup: oGroupToDelete,
                    removedGroupIndex: undefined
                };

            aGroups.some(function (oGroup, iIndex) {
                if (oGroup.Id === oGroupToDelete.Id) {
                    oRemovedGroup.removedGroupIndex = iIndex;
                    aGroups.splice(iIndex, 1);
                    oModel.setProperty("/notificationsByTypeDescending", aGroups);

                    return true;
                }

                return false;
            });
            this.sCurrentExpandedType = undefined;
            return oRemovedGroup;
        },

        updateGroupHeaders: function () {
            var oPromise = this.oNotificationsService.getNotificationsGroupHeaders(),
                that = this,
                aGroups = that.getView().getModel().getProperty("/" + that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
            oPromise.fail(function (data) {
                Log.error("Notifications control - call to notificationsService.updateGroupHeaders failed: ",
                    data,
                    "sap.ushell.components.shell.Notifications.Notifications");
            });
            oPromise.done(function (notificationsByType) {
                var oJson = JSON.parse(notificationsByType),
                    arr = oJson.value;

                arr.forEach(function (item) {
                    var bFound = false;
                    aGroups.forEach(function (group, iIndex) {
                        if (group.Id === item.Id) {
                            aGroups[iIndex].GroupHeaderText = item.GroupHeaderText;
                            aGroups[iIndex].CreatedAt = item.CreatedAt;
                            bFound = true;
                        }
                    });
                    if (!bFound) {
                        aGroups.unshift(item);
                    }
                });
                that.getView().getModel().setProperty("/" + that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING, aGroups);
            });
        },

        reloadGroupHeaders: function () {
            var oPromise = this.oNotificationsService.getNotificationsGroupHeaders(),
                that = this;
            oPromise.fail(function (data) {
                Log.error("Notifications control - call to notificationsService.getNotificationsGroupHeaders failed: ",
                    data,
                    "sap.ushell.components.shell.Notifications.Notifications");
                that.removeBusyIndicatorToTabFilter(that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
            });
            oPromise.done(function (notificationsByType) {
                var oJson = JSON.parse(notificationsByType),
                    arr = oJson.value,
                    result = [];
                arr.forEach(function (item) {
                    if (item.IsGroupHeader) {
                        item.Collapsed = true;
                        result.push(item);
                    }
                });
                that.getView().getModel().setProperty("/" + that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING, result);
                that.removeBusyIndicatorToTabFilter(that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
            });
        },

        markRead: function (sNotificationId) {
            var oPromise = this.oNotificationsService.markRead(sNotificationId),
                that = this;
            oPromise.fail(function () {
                sap.ushell.Container.getService("Message").error(resources.i18n.getText("notificationsFailedMarkRead"));
                that.setMarkReadOnModel(sNotificationId, false);
            });
            this.setMarkReadOnModel(sNotificationId, true);
        },

        onExit: function () { },

        onBeforeRendering: function () {
            this.oNotificationsService.registerDependencyNotificationsUpdateCallback(this.notificationsUpdateCallback.bind(this), false);
        },

        //*********************************************************************************************************
        //************************************** Notification actions *********************************************

        executeAction: function (sNotificationId, sActionName) {
            return this.oNotificationsService.executeAction(sNotificationId, sActionName);
        },

        executeBulkAction: function (sActionName, sActionText, oGroup, sPathToNotification) {
            var oThatGroup = oGroup,
                oPromise = this.oNotificationsService.executeBulkAction(oGroup.Id, sActionName),
                sMessage,
                sGroupActionText = sActionText,
                sNotificationTypeDesc = this.getView().getModel().getProperty(sPathToNotification + "/NotificationTypeDesc"),
                that = this;

            if (sNotificationTypeDesc === "") {
                sNotificationTypeDesc = this.getView().getModel().getProperty(sPathToNotification + "/NotificationTypeKey");
            }
            oPromise.fail(function (oResult) {
                this.getView().getModel().setProperty(sPathToNotification + "/Busy", false);

                if (oResult && oResult.succededNotifications && oResult.succededNotifications.length) {
                    oResult.succededNotifications.forEach(function (sNotificationId) {
                        this.removeNotificationFromModel(sNotificationId);
                    }.bind(this));
                    // There is need to load again the other 2 tabs, therefore we need to "clean" other models.
                    that.cleanModel();
                }

                if (oResult.succededNotifications.length === 1) {
                    sMessage = resources.i18n.getText("notificationsPartialSuccessExecuteBulkAction", [
                        sGroupActionText,
                        oResult.succededNotifications.length,
                        oResult.failedNotifications.length + oResult.succededNotifications.length,
                        sNotificationTypeDesc,
                        oResult.failedNotifications.length
                    ]);
                    MessageToast.show(sMessage, { duration: 4000 });
                } else if (oResult.succededNotifications.length > 1) {
                    sMessage = resources.i18n.getText("notificationsSingleSuccessExecuteBulkAction", [
                        sGroupActionText,
                        oResult.succededNotifications.length,
                        oResult.failedNotifications.length + oResult.succededNotifications.length,
                        sNotificationTypeDesc,
                        oResult.failedNotifications.length
                    ]);
                    MessageToast.show(sMessage, { duration: 4000 });
                } else {
                    sMessage = resources.i18n.getText("notificationsFailedExecuteBulkAction");
                    sap.ushell.Container.getService("Message").error(sMessage);
                }
            }.bind(this));

            oPromise.done(function () {
                sMessage = resources.i18n.getText("notificationsSuccessExecuteBulkAction", [
                    sGroupActionText, sNotificationTypeDesc
                ]);
                MessageToast.show(sMessage, { duration: 4000 });
                this.removeGroupFromModel(oThatGroup);
                // There is need to load again the other 2 tabs, therefore we need to "clean"  other models.
                this.cleanModel();
            }.bind(this));
        },

        dismissNotification: function (notificationId) {
            // if the service call is successful, we will get the updated model from the service via the standard update.
            // if the operation fails, the model won't be changed, so we just need to call "updateItems" on the list,
            // since the model contains the dismissed notification.
            var that = this,
                oRemovedNotification = this.removeNotificationFromModel(notificationId),
                oPromise = this.oNotificationsService.dismissNotification(notificationId);
            // There is need to load again the other 2 tabs, therefore we need to "clean"  other models.
            this.cleanModel();
            oPromise.fail(function () {
                sap.ushell.Container.getService("Message").error(resources.i18n.getText("notificationsFailedDismiss"));
                that.addNotificationToModel(oRemovedNotification.obj, oRemovedNotification.index);
            });
        },

        dismissBulkNotifications: function (oGroup) {
            var oRemovedGroup = this.removeGroupFromModel(oGroup),
                oPromise = this.oNotificationsService.dismissBulkNotifications(oGroup.Id);
            // There is need to load again the other 2 tabs, therefore we need to "clean"  other models.
            this.cleanModel();
            oPromise.fail(function () {
                sap.ushell.Container.getService("Message").error(resources.i18n.getText("notificationsFailedExecuteBulkAction"));
                this.reAddFailedGroup(oRemovedGroup);
            }.bind(this));
        },

        onListItemPress: function (sNotificationId, sSemanticObject, sAction, aParameters) {
            var viewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            if (viewPortContainer) { // qUnits do not create the viewport container
                viewPortContainer.switchState("Center");
            }
            utils.toExternalWithParameters(sSemanticObject, sAction, aParameters);
            this.markRead(sNotificationId);
        },

        //*********************************************************************************************************
        //******************************************* Scrolling ***************************************************

        scrollToItem: function (oTopNotificationData) {
            var jqNotificationItems = this._getJqNotificationObjects(),
                jqNotificationContainerContent = jqNotificationItems[0],
                jqNotificationsContent = jqNotificationItems[1],
                jqNotificationsList = jqNotificationItems[2],
                jqNotificationItem = jqNotificationItems[3],
                itemHeight,
                notificationIndex,
                indexOffSet,
                containerPadding,
                notificationContainerOffSet;

            if (jqNotificationContainerContent.length > 0
                && jqNotificationsContent.length > 0
                && jqNotificationsList.length > 0
                && jqNotificationItem.length > 0) {
                itemHeight = jqNotificationItem.outerHeight(true) - window.parseInt(jqNotificationItem.css("margin-top").replace("px", ""));
                notificationIndex = this.getIndexInModelByItemId(oTopNotificationData.topItemId);
                notificationIndex = notificationIndex || 0;
                indexOffSet = notificationIndex * itemHeight + window.parseInt(jqNotificationItem.css("margin-top").replace("px", ""));

                containerPadding = window.parseInt(jqNotificationsContent.css("padding-top").replace("px", ""))
                    + window.parseInt(jqNotificationsList.css("padding-top").replace("px", ""));
                notificationContainerOffSet = jqNotificationContainerContent.offset().top;

                jqNotificationContainerContent.scrollTop(indexOffSet + containerPadding + notificationContainerOffSet - oTopNotificationData.offSetTop);
            }
            this._oTopNotificationData = undefined;
        },

        _getJqNotificationObjects: function () {
            var jqNotificationContainerContent = jQuery("#notificationIconTabBar-containerContent"),
                jqNotificationsContent = jqNotificationContainerContent.children(),
                jqNotificationsList = jqNotificationsContent.children(),
                jqNotificationItem = jqNotificationContainerContent.find("li").eq(0);

            return [jqNotificationContainerContent, jqNotificationsContent, jqNotificationsList, jqNotificationItem];
        },

        getTopOffSet: function () {
            var topOffSet = 0,
                jqContainerContent = this._getJqNotificationObjects()[0];
            if (jqContainerContent.children().length > 0 && jqContainerContent.children().children().length > 0) {
                // Get the outer space/margin
                topOffSet += jqContainerContent.children().outerHeight() - jqContainerContent.children().height();
                // Get the inner space/margin
                topOffSet += jqContainerContent.children().children().outerHeight() - jqContainerContent.children().children().height();
            }
            return topOffSet;
        },

        /**
         * Get top visible notification item
         * @returns {object} the notification ID of the top notification item in the screen, and the actual offset of the element from the top
         */
        getTopItemOnTheScreen: function () {
            // The notifications list control including top offset (until the tabs bar)
            var jqContainerContent = this._getJqNotificationObjects()[0],
                topOffSet = 0,
                sItemId,
                itemOffsetTop = 0,
                that = this;

            topOffSet = this.getTopOffSet();

            jqContainerContent.find("li").each(function () {
                // The distance between the top of an item from the top of the screen
                itemOffsetTop = jQuery(this).offset().top;
                // Check if this element is in the interested viewport, the first element whose itemOffsetTop is bigger then topOffSet -
                // is the highest visible element in the list
                if (itemOffsetTop >= topOffSet) {
                    sItemId = that.getItemNotificationId(this);
                    return false;
                }
            });
            return { topItemId: sItemId, offSetTop: itemOffsetTop };
        },

        //*********************************************************************************************************
        //***************************************** Error Handling ************************************************

        handleError: function () {
            try {
                sap.ushell.Container.getService("Message").error(resources.i18n.getText("errorOccurredMsg"));
            } catch (e) {
                Log.error("Getting Message service failed.");
            }
        },

        //*********************************************************************************************************
        //****************************************** Busy Indicator ***********************************************

        addBusyIndicatorToTabFilter: function (sSorting) {
            var oList = this.getNotificationList(sSorting);
            oList.setBusy(true);
            // during the loading we don't need to show noData text, because the data is not still loaded
            oList.setShowNoData(false);
        },

        removeBusyIndicatorToTabFilter: function (sSorting) {
            var oList = this.getNotificationList(sSorting);
            oList.setBusy(false);
            oList.setShowNoData(true);
        },

        //*********************************************************************************************************
        //***************************************** Model functions ***********************************************

        addNotificationToModel: function (oNotification, index) {
            var oModel = this.getView().getModel(),
                notifications = oModel.getProperty("/" + this.sCurrentSorting + "/aNotifications");
            notifications.splice(index, 0, oNotification);
            oModel.setProperty("/" + this.sCurrentSorting + "/aNotifications", notifications);
        },

        removeNotificationFromModel: function (notificationId) {
            var oModel = this.getView().getModel(),
                index,
                aGroups,
                notifications,
                sNotificationsModelPath,
                oRemovedNotification = {};

            if (this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING ||
                this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING ||
                this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING) {
                sNotificationsModelPath = "/" + this.sCurrentSorting + "/aNotifications";
                notifications = oModel.getProperty(sNotificationsModelPath);
                notifications.some(function (notification, index, array) {
                    if (notification.Id && notification.Id === notificationId) {
                        oRemovedNotification.obj = array.splice(index, 1)[0];
                        oRemovedNotification.index = index;
                        return true;
                    }
                });
                oModel.setProperty(sNotificationsModelPath, notifications);
                return oRemovedNotification;
            }

            aGroups = oModel.getProperty("/notificationsByTypeDescending");
            for (index = 0; index < aGroups.length; index++) {
                notifications = aGroups[index].aNotifications;
                if (notifications) {
                    if (notifications.length === 1 && notifications[0].Id === notificationId) {
                        aGroups.splice(index, 1);
                    } else {
                        notifications.some(function (notification, index, array) {
                            if (notification.Id && notification.Id === notificationId) {
                                oRemovedNotification.obj = array.splice(index, 1)[0];
                                oRemovedNotification.index = index;
                                return true;
                            }
                        });
                        aGroups[index].aNotifications = notifications;
                    }
                }
            }
            // update the header
            this.updateGroupHeaders();
            oModel.setProperty("/notificationsByTypeDescending", aGroups);
            return oRemovedNotification;
        },

        /**
         * Gets notification index
         * @param {string} sNotificationId notification Id
         * @returns {number} the index of the notification item in the model
         */
        getIndexInModelByItemId: function (sNotificationId) {
            var aNotifications,
                index;

            if (this.notificationsByTypeDescending === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                aNotifications = this.getView().getModel().getProperty("/" + this.sCurrentExpandedType + "/aNotifications");
            } else {
                aNotifications = this.getView().getModel().getProperty("/" + this.sCurrentSorting + "/aNotifications");
            }
            if (aNotifications === undefined || aNotifications.length === 0) {
                return 0;
            }
            for (index = 0; index < aNotifications.length; index++) {
                if (aNotifications[index].Id === sNotificationId) {
                    return index;
                }
            }
        },

        /**
         * Initializes (i.e. empties) the branched in the model of the tabs/sorting which are not the current one
         */
        cleanModel: function () {
            var that = this,
                oSortingTypesArray = this.getView().getModel().getProperty("/");

            Object.keys(oSortingTypesArray).forEach(function (sSortKey) {
                if (sSortKey !== that.sCurrentSorting && sSortKey !== that.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                    oSortingTypesArray[sSortKey] = that.getInitialSortingModelStructure();
                }
            });

            this.getView().getModel().setProperty("/", oSortingTypesArray);
        },

        replaceItemsInModel: function (sSorting, oResult, iNumberOfItemsToFetch) {
            var aCurrentItems = this.getItemsFromModel(sSorting),
                iCurrentNumberOfItems = aCurrentItems.length,
                hasMoreItemsToFetch = oResult.length >= iNumberOfItemsToFetch;
            if (iCurrentNumberOfItems) {
                this._oTopNotificationData = this.getTopItemOnTheScreen();
            }

            this.getView().getModel().setProperty("/" + sSorting + "/hasMoreItemsInBackend", hasMoreItemsToFetch);

            this.getView().getModel().setProperty("/" + sSorting + "/aNotifications", oResult);

            this.getView().getModel().setProperty("/" + sSorting + "/inUpdate", false);
            this.handleMaxReached(sSorting);
        },

        setMarkReadOnModel: function (notificationId, bIsRead) {
            var oModel = this.getView().getModel(),
                sPath = "/" + this.sCurrentSorting,
                aNotifications,
                oData,
                bGroupFound,
                i;

            oData = oModel.getProperty(sPath);
            if (this.sCurrentSorting === "notificationsByTypeDescending") {
                for (i = 0; i < oData.length; i++) {
                    if (oData[i].Id === this.sCurrentExpandedType) {
                        sPath = sPath + "/" + i;
                        bGroupFound = true;
                        break;
                    }
                }
                if (!bGroupFound) {
                    return;
                }
            }
            sPath = sPath + "/aNotifications";

            aNotifications = oModel.getProperty(sPath);
            aNotifications.some(function (notification) {
                if (notification.Id === notificationId) {
                    notification.IsRead = bIsRead;
                    return true;
                }
            });
            oModel.setProperty(sPath, aNotifications);
        },

        //*********************************************************************************************************
        //**************************************** Handler functions ***********************************************

        onTabSelected: function (evt) {
            var key = evt.getParameter("key");

            if (key === "sapUshellNotificationIconTabByDate") {
                // If the previous tab was ByDate descending, the sorting should change
                var sByDateSorting;
                if (this.oPreviousTabKey === "sapUshellNotificationIconTabByDate") {
                    sByDateSorting = this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING ?
                        this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING : this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;
                    this._changeDateListBinding(sByDateSorting, evt.getParameter("item"));
                    this.oPreviousByDateSorting = sByDateSorting;
                } else {
                    sByDateSorting = this.oPreviousByDateSorting;
                }

                this.sCurrentSorting = sByDateSorting;
                if (this.getItemsFromModel(sByDateSorting).length === 0) {
                    this.getNextBuffer(sByDateSorting);
                }
            } else if (key === "sapUshellNotificationIconTabByType" && this.oPreviousTabKey !== "sapUshellNotificationIconTabByType") {
                this.sCurrentSorting = this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;
                this.addBusyIndicatorToTabFilter(this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
                this.reloadGroupHeaders();
                this.getView().byId("notificationIconTabBar").addStyleClass("sapUshellNotificationIconTabByTypeWithBusyIndicator");
            } else { // by Priority
                this.sCurrentSorting = this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;
                if (this.getItemsFromModel(this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING).length === 0) {
                    this.getNextBuffer(this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);
                }
            }
            this.oPreviousTabKey = key;
        },

        _changeDateListBinding: function (sSorting, oTab) {
            if (sSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING) {
                oTab.$("text").attr("aria-label", resources.i18n.getText("notificationsSortByDateDescendingTooltip"));
                this.getView().byId("sapUshellNotificationsListDate").bindItems(
                    "/notificationsByDateDescending/aNotifications",
                    sap.ui.xmlfragment("sap.ushell.components.shell.Notifications.NotificationsListItem", this)
                );
            } else {
                oTab.$("text").attr("aria-label", resources.i18n.getText("notificationsSortByDateAscendingTooltip"));
                this.getView().byId("sapUshellNotificationsListDate").bindItems(
                    "/notificationsByDateAscending/aNotifications",
                    sap.ui.xmlfragment("sap.ushell.components.shell.Notifications.NotificationsListItem", this)
                );
            }
        },

        onNotificationItemPress: function (oEvent) {
            var oModelPath = oEvent.getSource().getBindingContextPath(),
                oModelPart = this.getView().getModel().getProperty(oModelPath),
                sSemanticObject = oModelPart.NavigationTargetObject,
                sAction = oModelPart.NavigationTargetAction,
                aParameters = oModelPart.NavigationTargetParams,
                sNotificationId = oModelPart.Id;
            this.onListItemPress(sNotificationId, sSemanticObject, sAction, aParameters);
        },

        onNotificationItemClose: function (oEvent) {
            this._retainFocus();

            var sNotificationPathInModel = oEvent.getSource().getBindingContextPath(),
                oNotificationModelEntry = this.getView().getModel().getProperty(sNotificationPathInModel),
                sNotificationId = oNotificationModelEntry.Id;
            this.dismissNotification(sNotificationId);
        },

        onNotificationItemButtonPress: function (oEvent) {
            this._retainFocus();

            var sNotificationPathInModel = oEvent.getSource().getBindingContext().getPath(),
                oModel = this.getView().getModel(),
                oNotificationModelPart = oModel.getProperty(sNotificationPathInModel),
                aPathParts = sNotificationPathInModel.split("/"),
                bTypeTabSelected = this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,
                sPathToNotification = bTypeTabSelected ? "/" + aPathParts[1] + "/" + aPathParts[2] + "/" + aPathParts[3] + "/" + aPathParts[4] : "/" + aPathParts[1] + "/" + aPathParts[2] + "/" + aPathParts[3],
                oNotificationModelEntry = oModel.getProperty(sPathToNotification),
                sNotificationId = oNotificationModelEntry.Id;

            oModel.setProperty(sPathToNotification + "/Busy", true);

            this.executeAction(sNotificationId, oNotificationModelPart.ActionId).done(function (responseAck) {
                if (responseAck && responseAck.isSucessfull) {
                    sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                        if (responseAck.message && responseAck.message.length) {
                            MessageToast.show(responseAck.message, { duration: 4000 });
                        } else {
                            var sActionText = oNotificationModelPart.ActionText;
                            MessageToast.show(resources.i18n.getText("ActionAppliedToNotification", sActionText), { duration: 4000 });
                        }
                    });

                    // Notification should remain in the UI (after action executed) only if DeleteOnReturn flag exists, and equals false
                    if (responseAck.DeleteOnReturn !== false) {
                        this.removeNotificationFromModel(sNotificationId);
                        sap.ushell.Container.getService("Notifications")._addDismissNotifications(sNotificationId);

                        // There is need to load again the other 2 tabs, therefore we need to "clean" other models.
                        this.cleanModel();
                    }
                } else if (responseAck) {
                    sap.ushell.Container.getService("Message").error(responseAck.message);
                } else {
                    sap.ushell.Container.getService("Message").error(resources.i18n.getText("notificationsFailedExecuteAction"));
                }
                oModel.setProperty(sPathToNotification + "/Busy", false);
            }.bind(this)).fail(function () {
                oModel.setProperty(sPathToNotification + "/Busy", false);
                sap.ushell.Container.getService("Message").error(resources.i18n.getText("notificationsFailedExecuteAction"));
            });
        },

        onNotificationGroupItemClose: function (oEvent) {
            var sNotificationPathInModel = oEvent.getSource().getBindingContext().getPath(),
                aPathParts = sNotificationPathInModel.split("/"),
                sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                oNotificationModelEntry = this.getView().getModel().getProperty(sPathToNotification);

            this.dismissBulkNotifications(oNotificationModelEntry);
        },

        onNotificationGroupItemCollapse: function (oEvent) {
            var group = oEvent.getSource(),
                path = group.getBindingContext().getPath();
            if (!group.getCollapsed()) {
                this.getView().getModel().setProperty(path + "/Busy", true);
                this.expandedGroupIndex = path.substring(path.lastIndexOf("/") + 1);
                this.onExpandGroup(group);
            }
        },

        onNotificationGroupItemButtonPress: function (oEvent) {
            var oModel = this.getView().getModel(),
                sNotificationPathInModel = oEvent.getSource().getBindingContext().getPath(),
                oNotificationModelPart = oModel.getProperty(sNotificationPathInModel),
                aPathParts = sNotificationPathInModel.split("/"),
                sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                oNotificationModelEntry = oModel.getProperty(sPathToNotification);

            this._retainFocus();

            // mark the notification group as busy
            oModel.setProperty(sPathToNotification + "/Busy", true);

            this.executeBulkAction(oNotificationModelPart.ActionId, oEvent.getSource().getProperty("text"), oNotificationModelEntry, sPathToNotification);
        },

        onListUpdateStarted: function (oEvent) {
            if (oEvent.getParameter("reason") === "Growing") {
                if (!this.getView().getModel().getProperty("/" + this.sCurrentSorting + "/inUpdate")) {
                    this.getNextBuffer();
                }
            }
        },

        //*********************************************************************************************************
        //**************************************** Helper functions ***********************************************

        getNumberOfItemsInScreen: function () {
            var iItemsInScreen,
                iHeight = this.getWindowSize();

            iItemsInScreen = (iHeight - this.oPagingConfiguration.TAB_BAR_HEIGHT) / this.oPagingConfiguration.NOTIFICATION_ITEM_HEIGHT;
            return Math.ceil(iItemsInScreen);
        },

        getBasicBufferSize: function () {
            return Math.max(this.getNumberOfItemsInScreen() * 3, this.oPagingConfiguration.MIN_NOTIFICATION_ITEMS_PER_BUFFER);
        },

        getWindowSize: function () {
            return jQuery(window).height();
        },

        /**
         * Calculates and returns the number of items that should be requested from notification service, as part of the paging policy.
         * The function performs the following:
         *   - Calculated the number of required buffer according to the device / screen size
         *   - If the model already holds the  maximum number of item (per this device) - return 0
         *   - If the number of items in the model plus buffer size is bigger that the maximum - return the biggest possible number of items to fetch
         *   - Regular use case - return buffer size
         * @returns {number} Basic buffer size
         */
        getNumberOfItemsToFetchOnScroll: function (sSorting) {
            var iCurrentNumberOfItems = this.getItemsFromModel(sSorting).length,
                iBasicBufferSize = this.getBasicBufferSize();

            if (iCurrentNumberOfItems >= this.iMaxNotificationItemsForDevice) {
                return 0;
            }
            if (iCurrentNumberOfItems + iBasicBufferSize > this.iMaxNotificationItemsForDevice) {
                return this.iMaxNotificationItemsForDevice - iCurrentNumberOfItems;
            }
            return iBasicBufferSize;
        },

        /**
         * Calculated the number of items that should be required from the backend, according to:
         *   - (parameter) The number of items that are already in the model for the relevant sorting type
         *   - Basic buffer size
         * The number is rounded up to a product of basic buffer size
         * For example: if a basic buffer size is 50 and there are currently 24 items in the model - then 50 items (size of one basic buffer) are required.
         * @param {number} iNumberOfItemsInModel number of items
         * @returns {boolean} The smaller of the two following values:
         *   1. required number of items, which is the number of buffers * buffer size
         *   2. iMaxNotificationItemsForDevice
         */
        getNumberOfItemsToFetchOnUpdate: function (iNumberOfItemsInModel) {
            var iBasicBufferSize = this.getBasicBufferSize(),
                iNumberOfRequiredBasicBuffers = Math.ceil(iNumberOfItemsInModel / iBasicBufferSize),
                iReturnedValue;

            // If the number is less then one basic buffer - then one basic buffer is required
            iReturnedValue = iNumberOfRequiredBasicBuffers > 0 ? iNumberOfRequiredBasicBuffers * iBasicBufferSize : iBasicBufferSize;

            // Return no more then the maximum number of items for this device
            return iReturnedValue > this.iMaxNotificationItemsForDevice ? this.iMaxNotificationItemsForDevice : iReturnedValue;
        },

        getItemsFromModel: function (sortingType) {
            if (sortingType === undefined) {
                sortingType = this.sCurrentSorting;
            }
            return this.getView().getModel().getProperty("/" + sortingType + "/aNotifications");
        },

        getItemsOfTypeFromModel: function (sTypeHeader) {
            var oGroup = this.getGroupFromModel(sTypeHeader);
            if (oGroup) {
                return oGroup.aNotifications ? oGroup.aNotifications : [];
            }
            return [];
        },

        getGroupFromModel: function (sTypeHeader) {
            var aGroupHeaders = this.getView().getModel().getProperty("/" + this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
            return aGroupHeaders.find(function (group) {
                return group.Id === sTypeHeader;
            });
        },

        getGroupIndexFromModel: function (sTypeHeader) {
            var aGroupHeaders = this.getView().getModel().getProperty("/" + this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),
                iIndex;
            aGroupHeaders.forEach(function (group, index) {
                if (group.Id === sTypeHeader) {
                    iIndex = index;
                    return true;
                }
            });
            return iIndex;
        },

        // Return the Notification Id of the given notification item
        getItemNotificationId: function (elNotificationItem) {
            var sItemModelPath,
                sItemNotificationId;
            sItemModelPath = sap.ui.getCore().byId(elNotificationItem.getAttribute("Id")).getBindingContext().sPath;

            sItemNotificationId = this.getView().getModel().getProperty(sItemModelPath + "/Id");
            return sItemNotificationId;
        },

        getInitialSortingModelStructure: function () {
            return {
                hasMoreItemsInBackend: true,
                listMaxReached: false,
                aNotifications: [],
                inUpdate: false,
                moreNotificationCount: ""
            };
        },

        onExpandGroup: function (groupElement) {
            var listItems = this.getView().byId("sapUshellNotificationsListType").getItems(),
                groupElementId = groupElement.getId(),
                oGroup = this.getView().getModel().getProperty(groupElement.getBindingContextPath()),
                that = this;
            that.sCurrentExpandedType = oGroup.Id;
            that.getView().getModel().setProperty(groupElement.getBindingContextPath() + "/aNotifications", []);
            that.getView().getModel().setProperty(groupElement.getBindingContextPath() + "/hasMoreItems", true);
            listItems.forEach(function (item, index) {
                if (item.getId() === groupElementId) {
                    that.getNextBufferForType();
                } else if (item.getId() !== groupElementId && !item.getCollapsed()) {
                    item.setCollapsed(true);
                    that.getView().getModel().setProperty(item.getBindingContextPath() + "/hasMoreItems", true);
                }
            });
        },

        notificationsUpdateCallbackForType: function () {
            var selectedTypeId = this.sCurrentExpandedType,
                sSortingType = this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,
                oGroup = this.getGroupFromModel(selectedTypeId),
                aCurrentItems = oGroup ? oGroup.aNotifications : undefined,
                iNumberOfItemsInModel = 0,
                oPromise;


            if (aCurrentItems !== undefined) {
                iNumberOfItemsInModel = aCurrentItems.length;
            }

            this.getView().getModel().setProperty("/" + sSortingType + "/inUpdate", true);

            // First Fetch the Groups Headers
            this.updateGroupHeaders();

            // Fetch a buffer of notification items from notification service
            if (selectedTypeId) {
                oPromise = this.oNotificationsService.getNotificationsBufferInGroup(selectedTypeId, 0, this.getNumberOfItemsToFetchOnUpdate(iNumberOfItemsInModel));

                oPromise.done(function (oResult) {
                    this.addTypeBufferToModel(selectedTypeId, oResult, true);
                }.bind(this));

                oPromise.fail(function (oResult) {
                    this.getNextBufferFailHandler(oResult);
                }.bind(this));
            }
        },

        getNotificationList: function (sSorting) {
            var oList;

            if (sSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING ||
                sSorting === this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING) {
                oList = this.getView().byId("sapUshellNotificationsListDate");
            } else if (sSorting === this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING) {
                oList = this.getView().byId("sapUshellNotificationsListPriority");
            } else {
                oList = this.getView().byId("sapUshellNotificationsListType");
            }

            return oList;
        },

        /**
         * Helper method that removes the tabindex from the second child of the given object.
         *
         * @param {object} oObject Object that containts the child that loses its tabindex.
         */
        removeTabIndexFromList: function (sSorting) {
            var oListControl = this.getNotificationList(sSorting);
            var oListTag = oListControl.$().children().get(1);
            if (oListTag) {
                oListTag.removeAttribute("tabindex");
            }
        },

        handleListCSSClass: function (sSorting, bIsListEmpty) {
            this.getNotificationList(sSorting).toggleStyleClass("sapContrast", bIsListEmpty);
        },

        getMoreCircle: function (sType) {
            var oMoreText = new Text({ text: resources.i18n.getText("moreNotifications") }),
                oNotificationCountText = new Text({ text: "" }).addStyleClass("sapUshellNotificationsMoreCircleCount"),
                oMoreCircle = new VBox({
                    items: [oNotificationCountText, oMoreText],
                    alignItems: FlexAlignItems.Center
                }).addStyleClass("sapUshellNotificationsMoreCircle"),
                oBelowCircleTextPart1 = new Text({
                    text: resources.i18n.getText("moreNotificationsAvailable_message"),
                    textAlign: "Center"
                }).addStyleClass("sapUshellNotificationsMoreHelpingText"),
                oBelowCircleTextPart2 = new Text({
                    text: resources.i18n.getText("processNotifications_message"),
                    textAlign: "Center"
                }).addStyleClass("sapUshellNotificationsMoreHelpingText"),
                oVBox = new VBox({
                    items: [oMoreCircle, oBelowCircleTextPart1, oBelowCircleTextPart2]
                }).addStyleClass("sapUshellNotificationsMoreVBox"),
                oListItem = new CustomListItem({
                    type: ListType.Inactive,
                    content: oVBox
                }).addStyleClass("sapUshellNotificationsMoreListItem");

            oNotificationCountText.setModel(this.getView().getModel());
            oNotificationCountText.bindText("/" + sType + "/moreNotificationCount");
            this.oMoreListItem = oListItem;

            return oListItem;
        },

        // When the notifications view is opened in a popup, keep focus on an active tab to avoid the popup close due to focus loss
        _retainFocus: function () {
            var oIconTabBar = this.getView().byId("notificationIconTabBar"),
                sKey = oIconTabBar.getSelectedKey(),
                aItems = oIconTabBar.getItems(),
                iSelected = 0;

            aItems.forEach(function (oItem, index) {
                if (oItem.getKey() === sKey) {
                    iSelected = index;
                }
            });
            aItems[iSelected].focus();
        },

        //*********************************************************************************************************
        //**************************************** Formatter functions ********************************************

        priorityFormatter: function (priority) {
            if (priority) {
                priority = priority.charAt(0) + priority.substr(1).toLowerCase();
                return Priority[priority];
            }
        }
    });
});
},
	"sap/ushell/components/shell/Notifications/Notifications.view.xml":'<mvc:View\n    controllerName="sap.ushell.components.shell.Notifications.Notifications"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core"\n    class="sapUshellNotificationsView">\n    <IconTabBar\n        id="notificationIconTabBar"\n        backgroundDesign="Transparent"\n        headerBackgroundDesign="Transparent"\n        expandable="false"\n        selectedKey="sapUshellNotificationIconTabByDate"\n        select="onTabSelected"\n        class="sapUshellNotificationTabBar">\n        <items>\n            <IconTabFilter\n                id="sapUshellNotificationIconTabByDate"\n                key="sapUshellNotificationIconTabByDate"\n                text="{i18n>notificationsSortByDate}">\n                <List\n                    id="sapUshellNotificationsListDate"\n                    class="sapUshellNotificationsList sapContrast sapContrastPlus sapUshellPopoverList"\n                    mode="None"\n                    noDataText="{i18n>noNotificationsMsg}"\n                    growing="true"\n                    growingThreshold="10"\n                    growingScrollToLoad="true"\n                    updateStarted=".onListUpdateStarted"\n                    items="{path: \'/notificationsByDateDescending/aNotifications\', templateShareable: true}">\n                    <core:Fragment fragmentName="sap.ushell.components.shell.Notifications.NotificationsListItem" type="XML"/>\n                </List>\n            </IconTabFilter>\n            <IconTabFilter\n                id="sapUshellNotificationIconTabByType"\n                key="sapUshellNotificationIconTabByType"\n                text="{i18n>notificationsSortByType}">\n                <core:Fragment fragmentName="sap.ushell.components.shell.Notifications.NotificationsGroupListItem" type="XML"/>\n            </IconTabFilter>\n            <IconTabFilter\n                id="sapUshellNotificationIconTabByPrio"\n                key="sapUshellNotificationIconTabByPrio"\n                text="{i18n>notificationsSortByPriority}">\n                <List\n                    id="sapUshellNotificationsListPriority"\n                    class="sapUshellNotificationsList sapContrast sapContrastPlus sapUshellPopoverList"\n                    mode="None"\n                    noDataText="{i18n>noNotificationsMsg}"\n                    growing="true"\n                    growingThreshold="10"\n                    growingScrollToLoad="true"\n                    updateStarted=".onListUpdateStarted"\n                    items="{path: \'/notificationsByPriorityDescending/aNotifications\', templateShareable: true}">\n                    <core:Fragment fragmentName="sap.ushell.components.shell.Notifications.NotificationsListItem" type="XML"/>\n                </List>\n            </IconTabFilter>\n        </items>\n    </IconTabBar>\n</mvc:View>\n',
	"sap/ushell/components/shell/Notifications/NotificationsGroupListItem.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">\n\n    <List\n        id="sapUshellNotificationsListType"\n        class="sapUshellNotificationsList sapContrastPlus sapContrast sapUshellPopoverList"\n        mode="SingleSelect"\n        noDataText="{i18n>noNotificationsMsg}"\n        items="{/notificationsByTypeDescending}">\n        <NotificationListGroup\n            title="{GroupHeaderText}"\n            collapsed="{Collapsed}"\n            showEmptyGroup="true"\n            enableCollapseButtonWhenEmpty="true"\n            autoPriority="false"\n            datetime="{path: \'CreatedAt\', formatter: \'sap.ushell.utils.formatDate\'}"\n            priority="{ path: \'Priority\', formatter: \'.priorityFormatter\'}"\n            busy="{= ${Busy} ? ${Busy} : false}"\n            buttons="{\n                path:\'Actions\',\n                templateShareable: \'true\',\n                sorter: {\n                    path: \'Nature\',\n                    descending: \'true\'\n                }\n            }"\n            items="{\n                path: \'aNotifications\',\n                templateShareable: \'true\'\n            }"\n            close="onNotificationGroupItemClose"\n            onCollapse="onNotificationGroupItemCollapse">\n            <core:Fragment fragmentName="sap.ushell.components.shell.Notifications.NotificationsListItem" type="XML"/>\n            <buttons>\n                <Button\n                    press="onNotificationGroupItemButtonPress"\n                    text="{GroupActionText}" />\n            </buttons>\n        </NotificationListGroup>\n    </List>\n</core:FragmentDefinition>',
	"sap/ushell/components/shell/Notifications/NotificationsListItem.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">\n    <NotificationListItem\n        class="sapUshellNotificationsListItem sapContrastPlus sapContrast"\n        press="onNotificationItemPress"\n        close="onNotificationItemClose"\n        datetime="{path: \'CreatedAt\', formatter: \'sap.ushell.utils.formatDate\'}"\n        description="{SubTitle}"\n        title="{= ${SensitiveText} ? ${SensitiveText} : ${Text}}"\n        buttons="{\n            path: \'Actions\',\n            sorter: {\n                path: \'Nature\',\n                descending: true\n            },\n            templateShareable: true\n        }"\n        unread="{= !${IsRead}}"\n        busy="{= ${Busy} ? ${Busy} : false}"\n        priority="{ path: \'Priority\', formatter: \'.priorityFormatter\'}">\n        <buttons>\n            <Button\n                text="{ActionText}"\n                press="onNotificationItemButtonPress"/>\n        </buttons>\n    </NotificationListItem>\n</core:FragmentDefinition>\n',
	"sap/ushell/components/shell/Notifications/Settings.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * Notification settings View Controller
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/json/JSONModel"
], function (jQuery, JSONModel) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.Notifications.Settings", {
        /**
         * Main functionality:
         * - Getting the notification settings data from Notifications service
         * - Initializing rows data in the model
         * - In case of failure or no data - creating NoData UI
         * - Handling switch flags data initialization
         */
        onInit: function () {
            var that = this,
                oSettingsPromise = sap.ushell.Container.getService("Notifications").readSettings(),
                oModel = new JSONModel(),
                oView,
                oNoDataUI,
                oResponseData,
                aDeepCopyRows;

            oModel.setProperty("/aDitryRowsIndicator", []);
            oModel.setProperty("/rows", []);
            oModel.setProperty("/originalRows", []);
            oSettingsPromise.done(function (oResult) {
                oResponseData = JSON.parse(oResult);
                oModel.setProperty("/rows", oResponseData.value);
                aDeepCopyRows = JSON.parse(JSON.stringify(oResponseData.value));
                oModel.setProperty("/originalRows", aDeepCopyRows);
            });
            oSettingsPromise.fail(function () {
                // Getting notification types data failed. Creating the NoData UI and setting it as the View's content
                oNoDataUI = that.getView().getNoDataUI();
                that.getView().removeAllContent();
                that.getView().addContent(oNoDataUI);
            });

            this._handleSwitchFlagsDataInitialization(oModel);

            oView = this.getView();
            oView.setModel(oModel);
        },

        onExit: function () {
        },

        onBeforeRendering: function () {
        },

        /**
         * Initializing the copies of the data rows and the switch flags (i.e. originalRows and originalFlags).
         */
        onAfterRendering: function () {
            var oflags = this.getView().getModel().getProperty("/flags"),
                aRows = this.getView().getModel().getProperty("/rows"),
                aDeepCopyRows;

            // On the first time (after controller initialization) there might be a case in which the data rows still weren't fetched from the backend.
            // In this case aRows is undefined, hence we can't set /originalRows yet.
            // Setting "/originalRows" in this case occurs in the controller's onInit function, when the rows data arrives
            if (aRows !== undefined) {
                aDeepCopyRows = JSON.parse(JSON.stringify(aRows));
                this.getView().getModel().setProperty("/originalRows", aDeepCopyRows);
            }
            this.getView().getModel().setProperty("/originalFlags/highPriorityBannerEnabled", oflags.highPriorityBannerEnabled);

            this.getView().getModel().setProperty("/aDitryRowsIndicator", []);
        },

        getContent: function () {
            var oDfd = new jQuery.Deferred();
            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            var oDfd = new jQuery.Deferred();
            oDfd.resolve(" ");
            return oDfd.promise();
        },

        /**
         * Ignoring all the state changes done by the user, replacing them with the original state of the rows and the flags
         */
        onCancel: function () {
            var oOriginalFlags = this.getView().getModel().getProperty("/originalFlags"),
                oOriginalRows = this.getView().getModel().getProperty("/originalRows"),
                oDeepCopyOriginalRows = JSON.parse(JSON.stringify(oOriginalRows));

            this.getView().getModel().setProperty("/flags/highPriorityBannerEnabled", oOriginalFlags.highPriorityBannerEnabled);
            this.getView().getModel().setProperty("/rows", oDeepCopyOriginalRows);

            this.getView().getModel().setProperty("/originalFlags", {});
            this.getView().getModel().setProperty("/originalRows", []);

            this.getView().getModel().setProperty("/aDitryRowsIndicator", []);
        },

        /**
         * - Saving switch flag value
         * - Saving rows (i.e. notification types) that were changed
         * - Emptying dirty flags array
         */
        onSave: function () {
            var oDfd = new jQuery.Deferred(),
                aRows = this.getView().getModel().getProperty("/rows"),
                aOriginalRows = this.getView().getModel().getProperty("/originalRows"),
                oTempRow,
                oTempOriginalRow,
                iIndex,
                aDitryRowsIndicator = this.getView().getModel().getProperty("/aDitryRowsIndicator");

            oDfd.resolve();

            // Save the switch flags ("Show Alerts" and "Show Preview")
            this._handleSwitchFlagsSave();

            // Saving the rows that were changed (i.e. at least one of the flags was changed by the user)
            for (iIndex = 0; iIndex < aRows.length; iIndex++) {
                // Check the "dirty" flag if the current row
                if (aDitryRowsIndicator[iIndex] && aDitryRowsIndicator[iIndex] === true) {
                    oTempRow = aRows[iIndex];
                    oTempOriginalRow = aOriginalRows[iIndex];
                    // Check the current state of the row is different then the original state
                    if (!this._identicalRows(oTempRow, oTempOriginalRow)) {
                        sap.ushell.Container.getService("Notifications").saveSettingsEntry(oTempRow);
                    }
                }
            }
            this.getView().getModel().setProperty("/aDitryRowsIndicator", []);
            return oDfd.promise();
        },

        /**
         * Setting a "dirty flag" (to true) for a row, when the status of the row was changed by the user (e.g. a checkbox was checked/unchecked).
         *
         * The array of "dirty flags" (each one represents a row in the notification types table) is in the model in "/aDitryRowsIndicator".
         * The index of the correct item in the array/model is the index of the row in the table and is extracted from this.getBindingContext().sPath
         */
        setControlDirtyFlag: function () {
            var oContextPath = this.getBindingContext().sPath,
                iIndexInArray = oContextPath.substring(oContextPath.lastIndexOf("/") + 1, oContextPath.length),
                oObjectInModel = this.getModel().getProperty("/aDitryRowsIndicator");

            if (oObjectInModel !== undefined) {
                this.getModel().setProperty("/aDitryRowsIndicator/" + iIndexInArray, true);
            }
        },

        _handleSwitchFlagsDataInitialization: function (oModel) {
            var oSwitchBarDataPromise = sap.ushell.Container.getService("Notifications").getUserSettingsFlags(),
                bMobilePushEnabled = sap.ushell.Container.getService("Notifications")._getNotificationSettingsMobileSupport(),
                bEmailPushEnabled = sap.ushell.Container.getService("Notifications")._getNotificationSettingsEmailSupport();

            oSwitchBarDataPromise.done(function (oSwitchBarData) {
                oModel.setProperty("/flags", {});
                oModel.setProperty("/flags/highPriorityBannerEnabled", oSwitchBarData.highPriorityBannerEnabled);
                oModel.setProperty("/flags/mobileNotificationsEnabled", bMobilePushEnabled);
                oModel.setProperty("/flags/emailNotificationsEnabled", bEmailPushEnabled);
                oModel.setProperty("/originalFlags", {});
                oModel.setProperty("/originalFlags/highPriorityBannerEnabled", oSwitchBarData.highPriorityBannerEnabled);
            });
        },

        /**
         * Handle the saving of "Show Alerts" (i.e. enable banner) and "Show Preview" flags,
         * and update the original flags (in "/originalFlags") for the next time the settings UI is opened.
         */
        _handleSwitchFlagsSave: function () {
            var bHighPriorityBannerEnabled = this.getView().getModel().getProperty("/flags/highPriorityBannerEnabled"),
                bOriginalHighPriorityBannerEnabled = this.getView().getModel().getProperty("/originalFlags/highPriorityBannerEnabled");

            if (bOriginalHighPriorityBannerEnabled !== bHighPriorityBannerEnabled) {

                sap.ushell.Container.getService("Notifications").setUserSettingsFlags({
                    highPriorityBannerEnabled: bHighPriorityBannerEnabled
                });

                // Set the flags in "/originalFlags" with the values that were just saved
                // so the next time settings UI is opened - "/originalFlags" will contain the correct values
                this.getView().getModel().setProperty("/originalFlags/highPriorityBannerEnabled", bHighPriorityBannerEnabled);
            }
        },

        /**
         * Returning a boolean value indicating whether the two given rows (i.e. notification types) are identical or not,
         * The relevant properties that are being compared are the ID, and the flags that can be changed by the user
         */
        _identicalRows: function (row1, row2) {
            if ((row1.NotificationTypeId === row2.NotificationTypeId) &&
                (row1.PriorityDefault === row2.PriorityDefault) &&
                (row1.DoNotDeliver === row2.DoNotDeliver) &&
                (row1.DoNotDeliverMob === row2.DoNotDeliverMob) &&
                (row1.DoNotDeliverEmail === row2.DoNotDeliverEmail)) {
                return true;
            }
            return false;
        }
    });
});
},
	"sap/ushell/components/shell/Notifications/Settings.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * Notification settings View.
 * The View contains a sap.m.VBox, including:
 *   - A header that includes a switch control for the "DoNotDisturb" feature
 *   - A table of notification types, allowing the user to set presentation-related properties
 */
sap.ui.define([
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/CheckBox",
    "sap/m/Switch",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/FlexBox",
    "sap/ui/core/Icon",
    "sap/m/ColumnListItem",
    "sap/ui/model/Sorter",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/ushell/resources"
], function (
    Table,
    Column,
    CheckBox,
    Switch,
    Text,
    Label,
    VBox,
    HBox,
    FlexBox,
    Icon,
    ColumnListItem,
    Sorter,
    library,
    mLibrary,
    resources
) {
    "use strict";

    var ListSeparators = mLibrary.ListSeparators;
    var BackgroundDesign = mLibrary.BackgroundDesign;
    var TextAlign = library.TextAlign;

    sap.ui.jsview("sap.ushell.components.shell.Notifications.Settings", {
        /**
         * The content of the View:
         *   - Notification types settings table
         *   - Switch buttons bar (i.e. the header)
         * Both controls are put in a sap.m.VBox
         */
        createContent: function (/*oController*/) {
            var that = this,
                oNotificationTypeTable,
                oTableRowTemplate,
                oSwitchButtonsBar,
                oVBox,
                oHeaderVBox,
                oResourceBundle = resources.i18n;

            oNotificationTypeTable = new Table("notificationSettingsTable", {
                backgroundDesign: BackgroundDesign.Transparent,
                showSeparators: ListSeparators.All,
                fixedLayout: false,
                columns: [
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("notificationType_column"),
                            tooltip: oResourceBundle.getText("notificationType_columnTooltip")
                        }),
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("iOSNotification_column"),
                            tooltip: oResourceBundle.getText("iOSNotification_columnTooltip")
                        }),
                        visible: "{/flags/mobileNotificationsEnabled}",
                        // When the screen size is smaller than Tablet -
                        // the cells of this column should be placed under the cells of the previous column
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("eMailFld"),
                            tooltip: oResourceBundle.getText("email_columnTooltip")
                        }),
                        visible: "{/flags/emailNotificationsEnabled}",
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        vAlign: "Middle",
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("highNotificationsBanner_column"),
                            tooltip: oResourceBundle.getText("highNotificationsBanner_columnTooltip")
                        }),
                        // When the screen size is smaller than Tablet -
                        // the cells of this column should be placed under the cells of the previous column
                        minScreenWidth: "Tablet",
                        demandPopin: true,
                        hAlign: "Left"
                    }),
                    new Column({
                        header: new Text({
                            text: oResourceBundle.getText("Notifications_Settings_Show_Type_column"),
                            tooltip: oResourceBundle.getText("notificationTypeEnable_columnTooltip")
                        }),
                        vAlign: "Middle",
                        hAlign: "Left"
                    })
                ]
            });

            oTableRowTemplate = new ColumnListItem({
                cells: [
                    new Label({ text: "{NotificationTypeDesc}" }),
                    new CheckBox({
                        selected: {
                            parts: ["DoNotDeliverMob"],
                            formatter: function (bDoNotDeliverMob) {
                                return !bDoNotDeliverMob;
                            }
                        },
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            that.getModel().setProperty(sPath + "/DoNotDeliverMob", !oEvent.mParameters.selected);
                        }
                    }),
                    new CheckBox({
                        visible: {
                            parts: ["IsEmailEnabled", "IsEmailIdMaintained", "DoNotDeliver"],
                            formatter: function (bEmailEnabled, bEmailIdMaintained, bDoNotDeliver) {
                                return bEmailEnabled && bEmailIdMaintained && !bDoNotDeliver;
                            }
                        },
                        selected: {
                            path: "DoNotDeliverEmail",
                            formatter: function (bDoNotDeliverEmail) {
                                return !bDoNotDeliverEmail;
                            }
                        },
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            that.getModel().setProperty(sPath + "/DoNotDeliverEmail", !oEvent.mParameters.selected);
                        }
                    }),
                    new CheckBox({
                        // When the "High Priority" property is checked - the value in the model should be "40-HIGH".
                        // when it is unchecked - - the value in the model should be an empty string.
                        select: function (oEvent) {
                            that.getController().setControlDirtyFlag.apply(this);
                            var sPath = oEvent.getSource().getBindingContext().sPath;
                            if (oEvent.mParameters.selected === true) {
                                that.getModel().setProperty(sPath + "/PriorityDefault", "40-HIGH");
                            } else {
                                that.getModel().setProperty(sPath + "/PriorityDefault", "");
                            }
                        },
                        selected: {
                            parts: ["PriorityDefault"],
                            // The checkbox for PriorityDefault should be checked when the priority of the corresponding
                            // ...notification type is HIGH (i.e. the string "40-HIGH"), and unchecked otherwise
                            formatter: function (sPriorityDefault) {
                                that.getController().setControlDirtyFlag.apply(this);
                                if (sPriorityDefault === "40-HIGH") {
                                    return true;
                                }
                                return false;
                            }
                        }
                    }),
                    new Switch({
                        state: {
                            parts: ["DoNotDeliver"],
                            formatter: function (bDoNotDeliver) {
                                return !bDoNotDeliver;
                            }
                        },
                        customTextOn: " ",
                        customTextOff: " ",
                        change: function (oEvent) {
                            var bNewState = oEvent.getParameter("state"),
                                sPath = oEvent.getSource().getBindingContext().sPath;

                            that.getModel().setProperty(sPath + "/DoNotDeliver", !bNewState);
                            that.getController().setControlDirtyFlag.apply(this);
                        }
                    })
                ]
            });

            oNotificationTypeTable.bindAggregation("items", {
                path: "/rows",
                template: oTableRowTemplate,
                // Table rows (i.e. notification types) are sorted by type name, which is the NotificationTypeDesc field
                sorter: new Sorter("NotificationTypeDesc")
            });

            // The main container in the View.
            // Contains the header (switch flags) and the notification types table
            oVBox = new VBox();

            // Create the header, which is a sap.m.Bar that contain two switch controls
            oSwitchButtonsBar = this.createSwitchControlBar();

            // Create wrapper to the switch button in order to support belize plus theme
            oHeaderVBox = new VBox();
            oHeaderVBox.addStyleClass("sapContrastPlus");
            oHeaderVBox.addItem(oSwitchButtonsBar);

            oVBox.addItem(oHeaderVBox);
            oVBox.addItem(oNotificationTypeTable);

            return [oVBox];
        },

        /**
         * Creates and returns a UI control (sap.m.Bar)
         * that contains the DoNotDisturb and EnablePreview switch controls and labels.
         * The switch control for enabling/disabling notifications preview is created and added
         * only when preview is configured as enabled and the device screen is wide enough for presenting the preview
         *
         * @returns sap.m.HBox containing the switch controls that appear at the top part of the settings UI
         */
        createSwitchControlBar: function () {
            var oDoNotDisturbSwitch,
                oDoNotDisturbLabel,
                oDoNotDisturbHBox,
                oSwitchButtonsBar,
                oResourceBundle = resources.i18n;

            oSwitchButtonsBar = new FlexBox("notificationSettingsSwitchBar");

            oDoNotDisturbLabel = new Label("doNotDisturbLabel", {
                text: oResourceBundle.getText("Show_High_Priority_Alerts_title")
            });

            oDoNotDisturbSwitch = new Switch("doNotDisturbSwitch", {
                tooltip: oResourceBundle.getText("showAlertsForHighNotifications_tooltip"),
                state: "{/flags/highPriorityBannerEnabled}",
                customTextOn: oResourceBundle.getText("Yes"),
                customTextOff: oResourceBundle.getText("No")
            }).addAriaLabelledBy(oDoNotDisturbLabel);

            oDoNotDisturbHBox = new HBox("notificationDoNotDisturbHBox", {
                items: [
                    oDoNotDisturbSwitch,
                    oDoNotDisturbLabel
                ]
            });

            oSwitchButtonsBar.addItem(oDoNotDisturbHBox);
            return oSwitchButtonsBar;
        },

        /**
         * Creates and returns the UI that is shown in the settings view in case that no Notification type rows are available.<br>
         * The UI consists of a sap.m.VBox, in which the is an icon, a message header (text), and the actual text message.
         */
        getNoDataUI: function () {
            var oNoDataVBox,
                oNoDataIcon,
                oNoDataHeaderLabel,
                oNoDataLabel,
                oResourceBundle = resources.i18n;

            if (oNoDataVBox === undefined) {
                oNoDataIcon = new Icon("notificationSettingsNoDataIcon", {
                    size: "5rem",
                    src: "sap-icon://message-information"
                });
                oNoDataHeaderLabel = new Text("notificationSettingsNoDataTextHeader", {
                    text: oResourceBundle.getText("noNotificationTypesEnabledHeader_message")
                }).setTextAlign(TextAlign.Center);
                oNoDataLabel = new Text("notificationSettingsNoDataText", {
                    text: oResourceBundle.getText("noNotificationTypesEnabled_message")
                }).setTextAlign(TextAlign.Center);

                oNoDataVBox = new VBox("notificationSettingsNoDataInnerBox", {
                    items: [
                        oNoDataIcon,
                        oNoDataHeaderLabel,
                        oNoDataLabel
                    ]
                });
            }
            return oNoDataVBox;
        },
        getControllerName: function () {
            return "sap.ushell.components.shell.Notifications.Settings";
        }
    });
});
}
},"Component-preload"
);
