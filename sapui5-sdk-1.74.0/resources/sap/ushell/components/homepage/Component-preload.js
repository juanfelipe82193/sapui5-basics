//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/homepage/ActionMode.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Tile action mode implementation.
 *
 * In tile action mode the user can launch an action associated with a tile.
 * The mode is launched when clicking on the Edit button in the user menu.
 *
 * Tile action mode can be activated only from the launchpad. it is not accessible from the catalog or from an application.
 * When the mode is active and the user clicks on a tile - the tile's corresponding actions are presented in an action sheet
 *  and the user can click/launch any of them.
 *
 * Every user action (e.g. menu buttons, drag-and-drop) except for clicking a tile - stops/deactivates the action mode.
 *
 * This module Contains the following:
 *  - Constructor function that creates action mode activation buttons
 *  - Activation handler
 *  - Deactivation handler
 *  - Rendering tile action menu
 *
 * @version 1.74.0
 */
/**
 * @namespace
 * @name sap.ushell.components.homepage.ActionMode
 * @since 1.26.0
 * @private
 */
sap.ui.define([
    "sap/ushell/resources",
    "sap/m/library",
    "sap/m/Button",
    "sap/ui/thirdparty/jquery"
], function (
    resources,
    mobileLibrary,
    Button,
    jQuery
) {
    "use strict";

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    /* global hasher */

    /**
     * Constructor function
     * Creates action mode activation buttons:
     *  1. A new button in the user menu
     *  2. A floating button
     */
    var ActionMode = function () {
        this.oEventBus = sap.ui.getCore().getEventBus();

        this.init = function (oModel) {
            this.oModel = oModel;
        };
    };

    /**
     * Activation handler of tile actions mode
     *
     * Performs the following actions:
     * - Shows a toast message indicating the activated mode
     * - Sets the feature's model property to indicate that the feature is activated
     * - Registers deactivation click handler, called when the user clicks outside of a tile
     * - Adds the cover DIV to all tiles adding the mode's grey opacity and click handler for opening the actions menu
     * - Disables drag capability on tiles
     * - Changes the appearance of the floating activation button
     */
    ActionMode.prototype._activate = function () {
        this.oModel.setProperty("/tileActionModeActive", true);
        this.aOrigHiddenGroupsIds = this.getHomepageManager().getCurrentHiddenGroupIds(this.oModel);
        var oDashboardGroups = sap.ui.getCore().byId("dashboardGroups");
        oDashboardGroups.addLinksToUnselectedGroups();

        // Change action mode button display in the user actions menu
        var oTileActionsButton = sap.ui.getCore().byId("ActionModeBtn");
        if (oTileActionsButton) {
            oTileActionsButton.setTooltip(resources.i18n.getText("exitEditMode"));
            oTileActionsButton.setText(resources.i18n.getText("exitEditMode"));
            // only avaiable if the action mode button is in the shell header
            if (oTileActionsButton.setSelected) {
                oTileActionsButton.setSelected(true);
            }
        }
        this.oEventBus.publish("launchpad", "actionModeActive");
    };

    /**
     * Deactivation handler of tile actions mode
     *
     * Performs the following actions:
     * - Unregisters deactivation click handler
     * - Sets the feature's model property to indicate that the feature is deactivated
     * - Enables drag capability on tiles
     * - Destroys the tile actions menu control
     * - Removed the cover DIV from to all the tiles
     * - Adds the cover DIV to all tiles adding the mode's grey opacity and click handler for opening the actions menu
     * - Changes the appearance of the floating activation button
     */
    ActionMode.prototype._deactivate = function () {
        this.oModel.setProperty("/tileActionModeActive", false);
        this.oEventBus.publish("launchpad", "actionModeInactive", this.aOrigHiddenGroupsIds);

        var tileActionsMenu = sap.ui.getCore().byId("TileActions");
        if (tileActionsMenu !== undefined) {
            tileActionsMenu.destroy();
        }
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
            MessageToast.show(resources.i18n.getText("savedChanges"), { duration: 4000 });
        });

        // Change action mode button display in the user actions menu
        var oTileActionsButton = sap.ui.getCore().byId("ActionModeBtn");
        if (oTileActionsButton) {
            oTileActionsButton.setTooltip(resources.i18n.getText("activateEditMode"));
            oTileActionsButton.setText(resources.i18n.getText("activateEditMode"));
            // only avaiable if the action mode button is in the shell header
            if (oTileActionsButton.setSelected) {
                oTileActionsButton.setSelected(false);
            }
        }
    };

    ActionMode.prototype.toggleActionMode = function (oModel, sSource, dashboardGroups) {
        dashboardGroups = dashboardGroups || [];

        var visibleGroups = dashboardGroups.filter(function (group) {
            return group.getVisible();
        });

        var oData = {
            group: visibleGroups[oModel.getProperty("/topGroupInViewPortIndex")],
            restoreLastFocusedTile: true
        };

        if (oModel.getProperty("/tileActionModeActive")) {
            this._deactivate();

            // if the TileContainer header was focused, we need to restore focus to the closest tile
            var jqLastFocusedHeader = jQuery(".sapUshellTileContainerHeader[tabindex=0]");
            if (jqLastFocusedHeader.length) {
                var jqTileContainer = jqLastFocusedHeader[0].closest(".sapUshellTileContainer");
                if (jqTileContainer) {
                    oData.restoreLastFocusedTileContainerById = jqTileContainer.id;
                }
            }
        } else {
            this._activate();
        }

        this.oEventBus.publish("launchpad", "scrollToGroup", oData);
    };

    /**
     * Apply action/edit mode CSS classes on a group.
     * This function is called when in edit/action mode and tiles were dragged,
     *  since the group is being re-rendered and the dashboard is still in action/edit mode
     */
    ActionMode.prototype.activateGroupEditMode = function (oGroup) {
        var jqGroupElement = jQuery(oGroup.getDomRef()).find(".sapUshellTileContainerContent");

        jqGroupElement.addClass("sapUshellTileContainerEditMode");
    };
    ActionMode.prototype.getHomepageManager = function () {
        if (!this.oHomepageManager) {
            this.oHomepageManager = sap.ushell.components.getHomepageManager();
        }
        return this.oHomepageManager;
    };

    /**
     * Opens the tile menu, presenting the tile's actions
     *
     * Performs the following actions:
     * - Returning the clicked tile to its original appearance
     * - Tries to get an existing action sheet in case actions menu was already opened during this session of action mode
     * - If this is the first time the user opens actions menu during this session of action mode - lazy creation a new action sheet
     * - Gets the relevant tile's actions from launch page service and create buttons accordingly
     * - Open the action sheet by the clicked tile
     *
     * @param oEvent Event object of the tile click action
     */
    ActionMode.prototype._openActionsMenu = function (oEvent, oView) {
        var that = this,
            oTileControl = oView || oEvent.getSource(),
            aActions = [],
            oActionSheet = sap.ui.getCore().byId("TileActions"),
            oActionSheetTarget,
            index,
            aActionsButtons = [],
            noActionsButton,
            oButton,
            oAction,
            oTile,
            fnHandleActionPress,
            coverDiv;

        if (oTileControl) {
            oTile = oTileControl.getBindingContext().getObject().object;
            aActions = this.getHomepageManager().getTileActions(oTile);
        }
        that.oTileControl = oTileControl;
        jQuery(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");

        coverDiv = jQuery(oEvent.getSource().getDomRef()).find(".sapUshellTileActionLayerDiv");
        coverDiv.addClass("sapUshellTileActionLayerDivSelected");

        //in a locked group we do not show any action
        //(this is here to prevent the tile-settings action added by Dynamic & Static tiles from being opened)
        //NOTE - when removing this check (according to requirements by PO)
        //- we must disable the tileSettings action in a different way
        var oTileModel = oTileControl.getModel();
        var sGroupBindingPath = oTileControl.getParent().getBindingContext().getPath();
        if (aActions.length === 0 || oTileModel.getProperty(sGroupBindingPath + "/isGroupLocked")) {
            // Create a single button for presenting "Tile has no actions" message to the user
            noActionsButton = new Button({
                text: resources.i18n.getText("tileHasNoActions"),
                enabled: false
            });
            aActionsButtons.push(noActionsButton);
        } else {
            for (index = 0; index < aActions.length; index++) {
                oAction = aActions[index];
                // The press handler of a button (representing a single action) in a tile's action sheet
                fnHandleActionPress = (function (oAction) {
                    return function () {
                        that._handleActionPress(oAction, oTileControl);
                    };
                }(oAction));
                oButton = new Button({
                    text: oAction.text,
                    icon: oAction.icon,
                    press: fnHandleActionPress
                });
                aActionsButtons.push(oButton);
            }
        }

        //For tiles - actions menu is opened by "more" icon, for links, there is an action button
        //Which cannot be controlled by FLP code.
        //In case of link, we first try to access the "more" button and open an action sheet by it.
        //Otherwise the action sheet will not be located under the "more" button and other weird things will happen.
        oActionSheetTarget = oEvent.getSource().getActionSheetIcon ? oEvent.getSource().getActionSheetIcon() : undefined;
        if (!oActionSheetTarget) {
            var oMoreAction = sap.ui.getCore().byId(oEvent.getSource().getId() + "-action-more");
            if (oMoreAction) {
                oActionSheetTarget = oMoreAction;
            } else {
                oActionSheetTarget = oEvent.getSource();
            }
        }

        if (!oActionSheet) {
            sap.ui.require(["sap/m/ActionSheet"], function (ActionSheet) {
                oActionSheet = new ActionSheet("TileActions", {
                    placement: PlacementType.Bottom,
                    afterClose: function () {
                        jQuery(".sapUshellTileActionLayerDivSelected").removeClass("sapUshellTileActionLayerDivSelected");
                        var oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("dashboard", "actionSheetClose", that.oTileControl);
                    }
                });
                that._openActionSheet(oActionSheet, aActionsButtons, oActionSheetTarget);
            });
        } else {
            that._openActionSheet(oActionSheet, aActionsButtons, oActionSheetTarget);
        }
    };

    /*
     *  This function is used to open the Action Sheet on the given target with the provided buttons.
     */
    ActionMode.prototype._openActionSheet = function (oActionSheet, aButtons, oTarget) {
        aButtons = aButtons || [];
        oActionSheet.destroyButtons();
        aButtons.forEach(function (oButton) {
            oActionSheet.addButton(oButton);
        });
        oActionSheet.openBy(oTarget);
    };

    /**
     * Press handler of a button (representing a single action) in a tile's action sheet
     *
     * @param {Object} oAction The event object initiated by the click action on an element in the tile's action sheet.
     *   In addition to the text and icon properties, oAction contains one of the following:
     *     1. A "press" property that includes a callback function.
     *        In this case the action (chosen by the user) is launched by calling the callback is called
     *     2. A "targetUrl" property that includes either a hash part of a full URL.
     *        In this case the action (chosen by the user) is launched by navigating to the URL
     */
    ActionMode.prototype._handleActionPress = function (oAction, oTileControl) {
        if (oAction.press) {
            oAction.press.call(oAction, oTileControl);
        } else if (oAction.targetURL) {
            if (oAction.targetURL.indexOf("#") === 0) {
                hasher.setHash(oAction.targetURL);
            } else {
                window.open(oAction.targetURL, "_blank");
            }
        } else {
            sap.ui.require([
                "sap/m/MessageToast"
            ], function (MessageToast) {
                MessageToast.show("No Action");
            });
        }
    };

    return new ActionMode();
}, /* bExport= */ true);
},
	"sap/ushell/components/homepage/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/bootstrap/common/common.load.model",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (
        UIComponent,
        oModelWrapper,
        HomepageManager,
        oSharedComponentUtils,
        Config,
        resources
) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.homepage.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // model instantiated by the model wrapper
            this.oModel = oModelWrapper.getModel();
            this.setModel(this.oModel);

            // This needs to be called _after_ the model is created
            UIComponent.prototype.init.apply(this, arguments);

            // TODO: Please remove all 'NewHomepageManager' references after complete alignment!
            var oDashboardMgrData = {
                model: this.oModel,
                view: this.oDashboardView
            };
            this.oHomepageManager = new HomepageManager("dashboardMgr", oDashboardMgrData);

            this.setModel(resources.i18nModel, "i18n");

            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.UsageAnalytics", "usageAnalyticsStarted", function () {
                sap.ui.require(["sap/ushell/components/homepage/FLPAnalytics"]);
            });

            oSharedComponentUtils.toggleUserActivityLog();

            // don't use the returned promise but register to the config change
            // for future config changes
            oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");
            Config.on("/core/home/homePageGroupDisplay").do(function (sNewDisplayMode) {
                this.oHomepageManager.handleDisplayModeChange(sNewDisplayMode);
            }.bind(this));

            oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");
            Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                var oModel = this.oHomepageManager.getModel();

                oModel.setProperty("/sizeBehavior", sSizeBehavior);
            }.bind(this));
        },

        createContent: function () {
            this.oDashboardView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });
            return this.oDashboardView;
        },

        exit: function () {
            this.oHomepageManager.destroy();
        }
    });
});
},
	"sap/ushell/components/homepage/DashboardContent.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "./DashboardUIActions",
    "sap/ushell/utils",
    "sap/ushell/EventHub",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ushell/Layout",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/base/Log"
], function (
    jQuery,
    DashboardUIActions,
    utils,
    EventHub,
    Device,
    resources,
    Layout,
    Filter,
    FilterOperator,
    Log
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.homepage.DashboardContent", {
        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            this.handleDashboardScroll = this._handleDashboardScroll.bind(this);

            oEventBus.subscribe("sap.ushell", "appOpened", this._appOpenedHandler, this);
            oEventBus.subscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            oEventBus.subscribe("launchpad", "actionModeInactive", this._handleGroupVisibilityChanges, this);
            oEventBus.subscribe("launchpad", "switchTabBarItem", this._handleTabBarItemPressEventHandler, this);

            //when the browser tab is hidden we want to stop sending requests from tiles
            window.document.addEventListener("visibilitychange", utils.handleTilesVisibility, false);

            //On Android 4.x, and Safari mobile in Chrome and Safari browsers sometimes we can see bug with screen rendering
            //so _webkitMobileRenderFix function meant to fix it after  `contentRefresh` event.
            if (Device.browser.mobile) {
                oEventBus.subscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
            }
            this.isDesktop = (Device.system.desktop && (navigator.userAgent.toLowerCase().indexOf("tablet") < 0));
        },

        onExit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
            oEventBus.unsubscribe("sap.ushell", "appOpened", this._appOpenedHandler, this);
            oEventBus.unsubscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            oEventBus.unsubscribe("launchpad", "switchTabBarItem", this._handleTabBarItemPressEventHandler, this);
            window.document.removeEventListener("visibilitychange", utils.handleTilesVisibility, false);
            if (this.oDashboardUIActionsModule) {
                this.oDashboardUIActionsModule.destroy();
                delete this.oDashboardUIActionsModule;
            }
        },

        onAfterRendering: function () {
            utils.setPerformanceMark("FLP - dashboard after rendering");

            var oHomepageManager = sap.ushell.components.getHomepageManager();
            if (!oHomepageManager.getPreparedGroupModel()) {
                oHomepageManager.loadPersonalizedGroups();
            } else {
                EventHub.once("firstSegmentCompleteLoaded").do(oHomepageManager.handleFirstSegmentLoaded.bind(oHomepageManager));
            }

            var oEventBus = sap.ui.getCore().getEventBus(),
                oModel,
                topViewPortGroupIndex,
                oGroup,
                bIsInEditTitle,
                timer;

            //Bind launchpad event handlers
            oEventBus.unsubscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);
            oEventBus.unsubscribe("launchpad", "scrollToGroupByName", this._scrollToGroupByName, this);
            oEventBus.subscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);
            oEventBus.subscribe("launchpad", "scrollToGroupByName", this._scrollToGroupByName, this);

            Device.orientation.attachHandler(function () {
                var jqTileContainers = jQuery("#dashboardGroups").find(".sapUshellTileContainer").filter(":visible");
                if (jqTileContainers.length) {
                    oModel = this.getView().getModel();
                    topViewPortGroupIndex = oModel.getProperty("/topGroupInViewPortIndex");

                    if (jqTileContainers.get(topViewPortGroupIndex)) {
                        oGroup = sap.ui.getCore().byId(jqTileContainers.get(topViewPortGroupIndex).id);
                        bIsInEditTitle = oModel.getProperty("/editTitle");
                        this._publishAsync("launchpad", "scrollToGroup", {
                            group: oGroup,
                            isInEditTitle: bIsInEditTitle
                        });
                    }
                }
            }, this);

            jQuery(window).bind("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(this.resizeHandler.bind(this), 300);
            }.bind(this));

            this._updateTopGroupInModel();
        },

        _dashboardDeleteTileHandler: function (oEvent) {
            var oTileControl = oEvent.getSource(),
                oTileModel = oTileControl.getBindingContext().getObject(),
                oData = { tileId: oTileModel.uuid };
            sap.ui.getCore().getEventBus().publish("launchpad", "deleteTile", oData, this);
        },

        dashboardTilePress: function (oEvent) {
            var oTileControl = oEvent.getSource();
            if (!oTileControl) {
                return;
            }

            // Set focus on tile upon clicking on the tile on a desktop
            // Unless there is an input element inside tile, or tile is slide tile then leave the focus on it
            if (Device.system.desktop) {
                var bSlideTile = document.activeElement.id.indexOf("feedTile") !== -1;
                if (document.activeElement.tagName !== "INPUT" && bSlideTile !== true) {
                    if (sap.ui.getCore().byId(oTileControl.getId())) {
                        sap.ushell.components.ComponentKeysHandler.setTileFocus(oTileControl.$());
                    }
                }
            }
            sap.ui.getCore().getEventBus().publish("launchpad", "dashboardTileClick", { uuid: oTileControl.getUuid() });
        },

        _updateTopGroupInModel: function () {
            var oModel = this.getView().getModel(),
                topViewPortGroupIndex = this._getIndexOfTopGroupInViewPort();

            var iSelectedGroupInModel = this._getModelGroupFromVisibleIndex(topViewPortGroupIndex);

            oModel.setProperty("/iSelectedGroup", iSelectedGroupInModel);
            oModel.setProperty("/topGroupInViewPortIndex", topViewPortGroupIndex);
        },

        _getIndexOfTopGroupInViewPort: function () {
            var oView = this.getView(),
                oDomRef = oView.getDomRef(),
                oScrollableElement = oDomRef.getElementsByTagName("section"),
                jqTileContainers = jQuery(oScrollableElement).find(".sapUshellTileContainer"),
                oOffset = jqTileContainers.not(".sapUshellHidden").eq(0).offset(),
                firstContainerOffset = (oOffset && oOffset.top) || 0,
                aTileContainersTopAndBottoms = [],
                nScrollTop = oScrollableElement[0].scrollTop,
                topGroupIndex = 0;

            // In some weird corner cases, those may not be defined -> bail out.
            if (!jqTileContainers || !oOffset) {
                return topGroupIndex;
            }

            jqTileContainers.each(function () {
                if (!jQuery(this).hasClass("sapUshellHidden")) {
                    var nContainerTopPos = jQuery(this).parent().offset().top;
                    aTileContainersTopAndBottoms.push([nContainerTopPos, nContainerTopPos + jQuery(this).parent().height()]);
                }
            });
            var viewPortTop = nScrollTop + firstContainerOffset;

            jQuery.each(aTileContainersTopAndBottoms, function (index, currentTileContainerTopAndBottom) {
                var currentTileContainerTop = currentTileContainerTopAndBottom[0],
                    currentTileContainerBottom = currentTileContainerTopAndBottom[1];

                //'24' refers to the hight decrementation of the previous TileContainer to improve the sync between the  top group in the viewport and the  selected group in the anchor bar.
                if (currentTileContainerTop - 24 <= viewPortTop && viewPortTop <= currentTileContainerBottom) {
                    topGroupIndex = index;
                    return false;
                }
            });
            return topGroupIndex;
        },

        _handleDashboardScroll: function () {
            var oView = this.getView(),
                oModel = oView.getModel(),
                nDelay = 400;

            var sHomePageGroupDisplay = oModel.getProperty("/homePageGroupDisplay"),
                bEnableAnchorBar = sHomePageGroupDisplay !== "tabs",
                bTileActionModeActive = oModel.getProperty("/tileActionModeActive");

            // We want to set tiles visibility only after the user finished the scrolling.
            // In IE this event is thrown also after scroll direction change, so we wait 1 second to
            // determine whether scrolling was ended completely or not
            function fHandleTilesVisibility () {
                utils.handleTilesVisibility();
            }
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(fHandleTilesVisibility, nDelay);

            if (!Device.system.phone) {
                //close anchor popover if it is open
                oView.oAnchorNavigationBar.closeOverflowPopup();
            }

            if (bEnableAnchorBar || bTileActionModeActive) {
                this._updateTopGroupInModel();
            }

            //update anchor navigation bar
            oView.oAnchorNavigationBar.reArrangeNavigationBarElements();
        },

        //Delete or Reset a given group according to the removable state.
        _handleGroupDeletion: function (oGroupBindingCtx) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oGroup = oGroupBindingCtx.getObject(),
                bIsGroupRemovable = oGroup.removable,
                sGroupTitle = oGroup.title,
                sGroupId = oGroup.groupId,
                oResourceBundle = resources.i18n,
                oMessageSrvc = sap.ushell.Container.getService("Message"),
                mActions,
                mCurrentAction;

            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                mActions = MessageBox.Action;
                mCurrentAction = (bIsGroupRemovable ? mActions.DELETE : oResourceBundle.getText("ResetGroupBtn"));
                oMessageSrvc.confirm(oResourceBundle.getText(bIsGroupRemovable ? "delete_group_msg" : "reset_group_msg", sGroupTitle), function (oAction) {
                    if (oAction === mCurrentAction) {
                        oEventBus.publish("launchpad", bIsGroupRemovable ? "deleteGroup" : "resetGroup", {
                            groupId: sGroupId
                        });
                    }
                }, oResourceBundle.getText(bIsGroupRemovable ? "delete_group" : "reset_group"), [mCurrentAction, mActions.CANCEL]);
            });
        },

        _modelLoaded: function () {
            this.bModelInitialized = true;
            sap.ushell.Layout.getInitPromise().then(function () { // TODO: pending dependency migration
                this._initializeUIActions();
            }.bind(this));
        },

        _initializeUIActions: function () {
            if (!this.oDashboardUIActionsModule) {
                this.oDashboardUIActionsModule = new DashboardUIActions();
            }
            this.oDashboardUIActionsModule.initializeUIActions(this);
        },

        //force browser to repaint Body, by setting it `display` property to 'none' and to 'block' again
        _forceBrowserRerenderElement: function (element) {
            var animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
            if (animationFrame) {
                animationFrame(function () {
                    var display = element.style.display;
                    element.style.display = "none";
                    element.style.display = display;
                });
            } else {
                Log.info("unsupported browser for animation frame");
            }
        },

        //function fixes Android 4.x Chrome, and Safari bug with poor rendering
        _webkitMobileRenderFix: function () {
            //force Chrome to repaint Body, by setting it `display` property to 'none' and to 'block' again
            if (Device.browser.chrome || Device.os.android) {
                // this includes almost all browsers and devices
                // if this is the IOS6 (as the previous fix causes double flickering
                // and this one only one flickering)
                this._forceBrowserRerenderElement(document.body);
            }
        },

        resizeHandler: function () {
            utils.recalculateBottomSpace();
            utils.handleTilesVisibility();

            // "reset" the appRendered event in case the user wants to navigate back to the same app.
            if (EventHub.last("AppRendered") !== undefined) {
                EventHub.emit("AppRendered", undefined);
            }

            // Layout calculation is relevant only when the dashboard is presented
            if (Layout && jQuery("#dashboardGroups").is(":visible")) {
                Layout.reRenderGroupsLayout(null);
                this._initializeUIActions();
            }
        },

        _appOpenedHandler: function (sChannelId, sEventId, oData) {
            var oParentComponent,
                sParentName,
                oModel = this.getView().getModel();

            // checking if application component opened is not the FLP App Component (e.g. navigation to an app, not 'Home')
            // call to set all tiles visibility off (so no tile calls will run in the background)
            oParentComponent = this.getOwnerComponent();
            sParentName = oParentComponent.getMetadata().getComponentName();
            if (oData.additionalInformation && oData.additionalInformation.indexOf(sParentName) === -1) {
                utils.setTilesNoVisibility(); // setting no visibility on all visible tiles
            }

            // in a direct navigation scenario the ActionMode might not exist yet.
            // In this case we would like to skip this check.

            if (oModel.getProperty("/tileActionModeActive") && sap.ushell.components.homepage.ActionMode) {
                sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
            }

            if (this.oDashboardUIActionsModule) {
                this.oDashboardUIActionsModule.disableAllDashboardUiAction();
            }
        },

        /**
         * Scrolling the dashboard according to group name, in order to show a desired group
         */
        _scrollToGroupByName: function (sChannelId, sEventId, oData) {
            var aGroups = this.getView().getModel().getProperty("/groups"),
                sGroupName = oData.groupName,
                oLaunchPageSrv = sap.ushell.Container.getService("LaunchPage");

            aGroups.forEach(function (oGroup) {
                if (oLaunchPageSrv.getGroupTitle(oGroup.object) === sGroupName) {
                    this._scrollToGroup(sChannelId, sEventId, {
                        groupId: oGroup.groupId
                    });
                }
            }.bind(this));
        },

        /**
         * Scrolling the dashboard in order to show a desired group
         */
        _scrollToGroup: function (sChannelId, sEventId, oData) {
            // don't display group header after scroll in non edit mode. Group header will be visible in the anchor bar
            // check if group header is visible, and only then scroll additional 3rem to hide it
            // in edit mode hide the before content + 0.5rem padding
            var sGroupId = oData.group ? oData.group.getGroupId() : oData.groupId;
            var oGroup;

            if (this.oView.oDashboardGroupsBox.getGroups()) {
                // Calling again getGroups() because of the lazy loading mechanism
                oGroup = this.oView.oDashboardGroupsBox.getGroups().reduce(function (result, group) {
                    return group && group.getGroupId() === sGroupId ? group : result;
                }, null);
            }

            var oGroupElement = oGroup && oGroup.getDomRef();

            if (!oGroupElement) {
                return;
            }

            var oTopElement = oGroupElement.querySelector(".sapUshellTileContainerEditMode") || oGroupElement.querySelector(".sapUshellTilesContainer-sortable");

            if (!oTopElement) {
                return;
            }

            document.getElementById("sapUshellDashboardPage-cont").scrollTop = oTopElement.offsetTop;

            setTimeout(function () {

                if (Device.system.desktop) {
                    var jqTileContainer = oGroup.$();
                    // regardless to group change - if we need to restore last focused tile we must do so.
                    if (oData.restoreLastFocusedTile) {
                        var bLookForLastVisitedInSameGroup = false;

                        // if we need to restore focus on a specific tile-container (rather then current group)
                        // then we supply the tile container and set true to bLookForLastVisitedInSameGroup (see goToLastVisitedTile method)
                        if (oData.restoreLastFocusedTileContainerById) {
                            jqTileContainer = jQuery("#" + oData.restoreLastFocusedTileContainerById);
                            bLookForLastVisitedInSameGroup = true;
                        }

                        sap.ushell.components.ComponentKeysHandler.goToLastVisitedTile(jqTileContainer, bLookForLastVisitedInSameGroup);
                    } else if (oData.groupChanged) {
                        // set focus on the first content of the group we scrolled to
                        var jqGroupContent = jqTileContainer.find(".sapUshellTile, .sapMGTLineMode, .sapFCard").filter(":visible").eq(0);

                        if (jqGroupContent.length) {
                            sap.ushell.components.ComponentKeysHandler.setTileFocus(jqGroupContent);
                        }
                    }
                }

                if (oData.isInEditTitle) {
                    oGroup.setEditMode(true);
                }
                utils.handleTilesVisibility();
            }, 0);
        },

        /**
         * Handler for dropping a tile object at the end of drag and drop action.
         *
         * @param event
         * @param ui : tile DOM Reference
         * @private
         */
        _handleDrop: function (event, ui) {
            var oLayout = Layout.getLayoutEngine(),
                tileMoveInfo = oLayout.layoutEndCallback(),
                bIsShortDrop = !tileMoveInfo.dstArea,
                oEventBus = sap.ui.getCore().getEventBus(),
                noRefreshSrc,
                noRefreshDst,
                sTileUuid,
                oDeferred = jQuery.Deferred(),
                oView = this.getView(),
                oModel = oView.getModel(),
                bTabMode = oModel.getProperty("/homePageGroupDisplay") && oModel.getProperty("/homePageGroupDisplay") === "tabs",
                bEditMode = oModel.getProperty("/tileActionModeActive"),
                bIsShortDropToLocked = true,
                ieHtml5DnD = !!(oModel.getProperty("/personalization") && (Device.browser.msie || Device.browser.edge) && Device.browser.version >= 11 &&
                    (Device.system.combi || Device.system.tablet)),
                bIsLinkPersonalizationSupported = tileMoveInfo.tile.getBindingContext().getObject().isLinkPersonalizationSupported;

            Layout.getLayoutEngine()._toggleAnchorItemHighlighting(false);
            //Short drop to a locked group
            if (tileMoveInfo.dstGroup) {
                var dstGroupBindingContext = tileMoveInfo.dstGroup.getBindingContext(),
                    isDestGroupLocked = dstGroupBindingContext.getProperty(dstGroupBindingContext.sPath).isGroupLocked;
                bIsShortDropToLocked = bIsShortDrop && isDestGroupLocked;
            }

            if (!tileMoveInfo.tileMovedFlag || (ieHtml5DnD && oLayout.isTabBarCollision()) || bIsShortDropToLocked || (!bIsLinkPersonalizationSupported && tileMoveInfo.dstArea === "links")) {
                oEventBus.publish("launchpad", "sortableStop");
                return null; //tile was not moved
            }

            //If we are in EditMode and the target group has no links (empty links area) and the anchor bar isn't in tabs mode,
            //then we continue as tile was not moved.
            if (!bEditMode && !bTabMode && tileMoveInfo.dstArea === "links" && !tileMoveInfo.dstGroupData.getLinks().length) {
                oEventBus.publish("launchpad", "sortableStop");
                return null; //tile was not moved
            }

            noRefreshSrc = true;
            noRefreshDst = true; //Default - suppress re-rendering after drop
            //if src and destination groups differ - refresh src and dest groups
            //else if a tile has moved & dropped in a different position in the same group - only dest should refresh (dest == src)
            //if a tile was picked and dropped - but never moved - the previous if would have returned
            if ((tileMoveInfo.srcGroup !== tileMoveInfo.dstGroup)) {
                noRefreshSrc = noRefreshDst = false;
            } else if (tileMoveInfo.tile !== tileMoveInfo.dstGroup.getTiles()[tileMoveInfo.dstTileIndex]) {
                noRefreshDst = false;
            }

            sTileUuid = this._getTileUuid(tileMoveInfo.tile);
            if (tileMoveInfo.srcGroup && tileMoveInfo.srcGroup.removeAggregation && tileMoveInfo.srcArea) {
                tileMoveInfo.srcGroup.removeAggregation("tiles", tileMoveInfo.tile, noRefreshSrc);
            }

            // If this is Tab Bar use-case, and the action is "long" Drag&Drop of a tile on a tab (group):
            // the destination group (whose aggregation needs to be updated) is not in the dashboard, unless the drag is to the same group.
            // Instead - the publish of movetile event will update the group in the model
            var bSameDropArea = tileMoveInfo.dstGroupData && tileMoveInfo.dstGroupData.insertAggregation && tileMoveInfo.dstArea === tileMoveInfo.srcArea;

            //Handles two scenarios - 1. Same group drop - tile to tile/link to link 2. Long drop - tile to tile/link to link
            if (bSameDropArea) {
                tileMoveInfo.tile.sParentAggregationName = tileMoveInfo.dstArea;//"tiles"
                tileMoveInfo.dstGroupData.insertAggregation(tileMoveInfo.dstArea, tileMoveInfo.tile, tileMoveInfo.dstTileIndex, noRefreshDst);

                oDeferred = this._handleSameTypeDrop(tileMoveInfo, sTileUuid, bSameDropArea);

                //Handles three scenarios - 1. Short drop 2. Same group - tile to link/link to tile 3. Long drop - tile to link/link to tile
            } else if (bIsShortDrop) {
                oDeferred = this._handleShortDrop(tileMoveInfo, sTileUuid, bSameDropArea);
            } else {
                oDeferred = this._handleConvertDrop(tileMoveInfo, bSameDropArea, ui);
            }

            if (this.getView().getModel()) {
                this.getView().getModel().setProperty("/draggedTileLinkPersonalizationSupported", true);
            }
            oEventBus.publish("launchpad", "sortableStop");
            return oDeferred.promise();
        },

        _handleSameTypeDrop: function (tileMoveInfo, sTileUuid, bSameDropArea) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oDeferred = jQuery.Deferred();
            tileMoveInfo.tile._getBindingContext().oModel.setProperty(tileMoveInfo.tile._getBindingContext().sPath + "/draggedInTabBarToSourceGroup", false);
            oEventBus.publish("launchpad", "movetile", {
                sTileId: sTileUuid,
                sToItems: tileMoveInfo.dstArea ? tileMoveInfo.dstArea : "tiles",
                sFromItems: tileMoveInfo.srcArea ? tileMoveInfo.srcArea : "tiles",
                sTileType: tileMoveInfo.dstArea ? tileMoveInfo.dstArea.substr(0, tileMoveInfo.dstArea.length - 1) : undefined,
                toGroupId: tileMoveInfo.dstGroupData.getGroupId ? tileMoveInfo.dstGroupData.getGroupId() : tileMoveInfo.dstGroupData.groupId,
                toIndex: tileMoveInfo.dstTileIndex,
                longDrop: bSameDropArea,
                callBack: function () {
                    oDeferred.resolve();
                }
            });
            return oDeferred.promise();
        },

        _handleShortDrop: function (tileMoveInfo, sTileUuid, bSameDropArea) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oDeferred = jQuery.Deferred();
            oEventBus.publish("launchpad", "movetile", {
                sTileId: sTileUuid,
                sToItems: tileMoveInfo.srcArea || "tiles",
                sFromItems: tileMoveInfo.srcArea || "tiles",
                sTileType: tileMoveInfo.srcArea ? tileMoveInfo.srcArea.substr(0, tileMoveInfo.srcArea.length - 1) : undefined,
                toGroupId: tileMoveInfo.dstGroupData.getGroupId ? tileMoveInfo.dstGroupData.getGroupId() : tileMoveInfo.dstGroupData.groupId,
                toIndex: tileMoveInfo.dstTileIndex,
                longDrop: bSameDropArea,
                callBack: function () {
                    oDeferred.resolve();
                }
            });
            return oDeferred.promise();
        },

        _handleConvertDrop: function (tileMoveInfo, bSameDropArea, ui) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oDeferred = jQuery.Deferred();
            oEventBus.publish("launchpad", "convertTile", {
                toGroupId: tileMoveInfo.dstGroupData.getGroupId ? tileMoveInfo.dstGroupData.getGroupId() : tileMoveInfo.dstGroupData.groupId,
                toIndex: tileMoveInfo.dstTileIndex,
                tile: sap.ui.getCore().byId(ui.id),
                srcGroupId: tileMoveInfo.srcGroup.getGroupId ? tileMoveInfo.srcGroup.getGroupId() : tileMoveInfo.srcGroup.groupId,
                longDrop: bSameDropArea,
                callBack: function () {
                    oDeferred.resolve();
                }
            });
            return oDeferred.promise();
        },

        _getTileUuid: function (oTileObject) {
            if (oTileObject.getUuid) {
                return oTileObject.getUuid();
            }

            var oTileModelObject = oTileObject.getBindingContext().getObject();

            if (oTileModelObject.getParent) {
                return oTileModelObject.getParent().getUuid();
            }

            return oTileModelObject.uuid;
        },

        _handleDrag: function (event, ui) {
            var tileDragInfo = Layout.getLayoutEngine().layoutEndCallback(),
                oTileModel = tileDragInfo.tile.getBindingContext().getObject(),
                oModel = this.getView().getModel();

            if (oModel) {
                oModel.setProperty("/draggedTileLinkPersonalizationSupported", oTileModel.isLinkPersonalizationSupported);
            }
        },

        _handleTabBarItemPressEventHandler: function (sChannelId, sEventId, oData) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                aGroups = oModel.getProperty("/groups"),
                iGroupIndex = oData.iGroupIndex;

            // first reset the isGroupSelected property for all groups.
            for (var i = 0; i < aGroups.length; i++) {
                oModel.setProperty("/groups/" + i + "/isGroupSelected", false);
            }
            // set the selected group (for the model update we use the original index)
            oModel.setProperty("/groups/" + iGroupIndex + "/isGroupSelected", true);

            this._handleTabBarItemPress(sChannelId, sEventId, iGroupIndex);
        },

        _handleTabBarItemPress: function (sChannelId, sEventId, iGroupIndex, oEvent) {
            var oView = this.getView(),
                // Fix the selected group index not to include the hidden groups.
                selectedGroupIndex,
                fixedIndex;

            if (oEvent) {
                selectedGroupIndex = oEvent.getParameter("group").getIndex();
            } else {
                selectedGroupIndex = iGroupIndex;
            }

            sap.ui.getCore().getEventBus().publish("launchpad", "tabSelected", { iSelectedGroup: selectedGroupIndex });

            fixedIndex = this._getVisibleGroupIndex(selectedGroupIndex);

            // apply the filter
            oView.oDashboardGroupsBox.removeLinksFromUnselectedGroups();
            oView.oDashboardGroupsBox.getBinding("groups").filter([oView.oFilterSelectedGroup]);
            // change the anchor bar selection
            oView.oAnchorNavigationBar.setSelectedItemIndex(fixedIndex);
            oView.oAnchorNavigationBar.reArrangeNavigationBarElements();
            // change tiles visibility of the new selected group
            setTimeout(function () {
                utils.handleTilesVisibility();
            }, 0);
        },

        _getVisibleGroupIndex: function (selectedGroupIndex) {
            var aGroups = this.getView().getModel().getProperty("/groups");
            var iHiddenGroupsCount = 0;

            // Go through the groups that are located before the selected group
            for (var i = 0; i < selectedGroupIndex; i++) {
                if (!aGroups[i].isGroupVisible || !aGroups[i].visibilityModes[0]) {
                    // Count all groups that are not visible in non-edit mode
                    iHiddenGroupsCount++;
                }
            }

            return selectedGroupIndex - iHiddenGroupsCount;
        },

        _getModelGroupFromVisibleIndex: function (selectedGroupIndex) {
            var aGroups = this.getView().getModel().getProperty("/groups"),
                iVisGroupsCount = 0;

            for (var i = 0; i < aGroups.length; i++) {
                if (aGroups[i].isGroupVisible && aGroups[i].visibilityModes[0]) {
                    // Count all groups that are not visible in non-edit mode
                    iVisGroupsCount++;

                    if (iVisGroupsCount > selectedGroupIndex) {
                        return i;
                    }
                }
            }

            return 0;
        },

        _handleAnchorItemPress: function (oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                aGroups = oModel.getProperty("/groups");

            //press on item could also be fired from overflow popup, but it will not have "manualPress" parameter
            if (Device.system.phone && oEvent.getParameter("manualPress")) {
                oEvent.oSource.openOverflowPopup();
            }

            // reset the isGroupSelected property for all groups before set the selected group
            for (var i = 0; i < aGroups.length; i++) {
                if (oModel.getProperty("/groups/" + i + "/isGroupSelected") === true) {
                    oModel.setProperty("/groups/" + i + "/isGroupSelected", false);
                }
            }
            // set the selected group (for the model update we use the original index)
            oModel.setProperty("/groups/" + oEvent.getParameter("group").getIndex() + "/isGroupSelected", true);
            oModel.setProperty("/iSelectedGroup", oEvent.getParameter("group").getIndex());

            // if tabs
            if (oModel.getProperty("/homePageGroupDisplay") && oModel.getProperty("/homePageGroupDisplay") === "tabs" && !oModel.getProperty("/tileActionModeActive")) {
                this._handleTabBarItemPress(undefined, undefined, undefined, oEvent);

                // else scroll or edit mode
            } else {
                // reset the filter

                if (!oModel.getProperty("/tileActionModeActive")) {
                    oView.oDashboardGroupsBox.getBinding("groups").filter([new Filter("isGroupVisible", FilterOperator.EQ, true)]);
                } else {
                    oView.oDashboardGroupsBox.getBinding("groups").filter([]);
                }

                // scroll to selected group
                this._scrollToGroup("launchpad", "scrollToGroup", {
                    group: oEvent.getParameter("group"),
                    groupChanged: true,
                    focus: (oEvent.getParameter("action") === "sapenter")
                });
            }
        },

        _addGroupHandler: function (oData) {
            var index,
                path = oData.getSource().getBindingContext().getPath(),
                parsePath = path.split("/");

            index = window.parseInt(parsePath[parsePath.length - 1], 10);

            if (oData.getSource().sParentAggregationName === "afterContent") {
                index = index + 1;
            }

            sap.ui.getCore().getEventBus().publish("launchpad", "createGroupAt", {
                title: "",
                location: index,
                isRendered: true
            });
        },

        _publishAsync: function (sChannelId, sEventId, oData) {
            var oBus = sap.ui.getCore().getEventBus();
            window.setTimeout(jQuery.proxy(oBus.publish, oBus, sChannelId, sEventId, oData), 1);
        },
        _changeGroupVisibility: function (oGroupBindingCtx) {
            var sBindingCtxPath = oGroupBindingCtx.getPath(),
                oModel = oGroupBindingCtx.getModel(),
                bGroupVisibilityState = oModel.getProperty(sBindingCtxPath + "/isGroupVisible");

            if (oModel.getProperty(sBindingCtxPath + "/isDefaultGroup")
                || oModel.getProperty(sBindingCtxPath + "/isGroupLocked")) {
                return;
            }

            oModel.setProperty(sBindingCtxPath + "/isGroupVisible", !bGroupVisibilityState);
        },

        //Persist the group visibility changes (hidden groups) in the back-end upon deactivation of the Actions Mode.
        _handleGroupVisibilityChanges: function (sChannelId, sEventId, aOrigHiddenGroupsIds) {
            var oLaunchPageSrv = sap.ushell.Container.getService("LaunchPage"),
                oModel = this.getView().getModel(),
                oHomepageManager = sap.ushell.components.getHomepageManager(),
                aCurrentHiddenGroupsIds = oHomepageManager.getCurrentHiddenGroupIds(oModel),
                bSameLength = aCurrentHiddenGroupsIds.length === aOrigHiddenGroupsIds.length,
                bIntersect = bSameLength,
                oPromise;

            //Checks whether there's a symmetric difference between the current set of hidden groups and the genuine one
            aCurrentHiddenGroupsIds.some(function (sHiddenGroupId, iIndex) {
                if (!bIntersect) {
                    return true;
                }
                bIntersect = aOrigHiddenGroupsIds && Array.prototype.indexOf.call(aOrigHiddenGroupsIds, sHiddenGroupId) !== -1;

                return !bIntersect;
            });

            if (!bIntersect) {
                oPromise = oLaunchPageSrv.hideGroups(aCurrentHiddenGroupsIds);
                oPromise.done(function () {
                    oModel.updateBindings("groups");
                });
                oPromise.fail(function () {
                    var msgService = sap.ushell.Container.getService("Message");

                    msgService.error(resources.i18n.getText("hideGroups_error"));
                });
            }

            window.setTimeout(function () {
                utils.recalculateBottomSpace();
            }, 0);
        },

        _updateShellHeader: function () {
            if (!this.oShellUIService) {
                this._initializeShellUIService();
            } else {
                // As the Dashboard is currently the default page for the Shell, we call set title and set hierarchy with no value
                // so the default value will be set
                this.oShellUIService.setTitle();
                this.oShellUIService.setHierarchy();
            }
        },

        _initializeShellUIService: function () {
            return sap.ui.require(["sap/ushell/ui5service/ShellUIService"], function (ShellUIService) {
                this.oShellUIService = new ShellUIService({
                    scopeObject: this.getOwnerComponent(),
                    scopeType: "component"
                });
                // As the Dashboard is currently the default page for the Shell, we call set title and set hierarchy with no value
                // so the default value will be set
                this.oShellUIService.setTitle();
                this.oShellUIService.setHierarchy();
                return this.oShellUIService;
            }.bind(this));
        },

        _deactivateActionModeInTabsState: function () {
            var oView = this.getView(),
                oModel = oView.getModel(),
                i;
            // First reset the isGroupSelected property for all groups.
            var aGroups = oModel.getProperty("/groups");
            for (i = 0; i < aGroups.length; i++) {
                oModel.setProperty("/groups/" + i + "/isGroupSelected", false);
            }

            var selectedIndex = oView.oAnchorNavigationBar.getSelectedItemIndex();

            var iHiddenGroupsCount = 0;
            // If the selected group is a hidden group, go to the first visible group
            if (!this._isGroupVisible(selectedIndex)) {
                for (i = 0; i < aGroups.length; i++) {
                    if (!this._isGroupVisible(i)) {
                        iHiddenGroupsCount++;
                    } else {
                        selectedIndex = i;
                        break;
                    }
                }
            } else {
                // Count all hidden groups that are located before the selected group
                for (i = 0; i < selectedIndex; i++) {
                    if (!this._isGroupVisible(i)) {
                        iHiddenGroupsCount++;
                    }
                }
            }

            // Fix the selected index not to include the hidden groups
            var fixedIndex = selectedIndex - iHiddenGroupsCount;
            // Change the anchor bar selection
            oView.oAnchorNavigationBar.setSelectedItemIndex(fixedIndex);
            oView.oAnchorNavigationBar.adjustItemSelection();

            // Set the selected group and then filter
            oModel.setProperty("/groups/" + selectedIndex + "/isGroupSelected", true);
            oView.oDashboardGroupsBox.removeLinksFromAllGroups();

            var sGroupsMode = oModel.getProperty("/homePageGroupDisplay");
            if (sGroupsMode && sGroupsMode === "tabs") {
                oView.oDashboardGroupsBox.getBinding("groups").filter([oView.oFilterSelectedGroup]);
            }
        },

        _isGroupVisible: function (groupIndex) {
            var aGroups = this.getView().getModel().getProperty("/groups");
            return (aGroups[groupIndex].isGroupVisible && aGroups[groupIndex].visibilityModes[0]);
        }
    });
});
},
	"sap/ushell/components/homepage/DashboardContent.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview The Fiori launchpad main view.<br>
 * The view is of type <code>sap.ui.jsview</code> that includes a <code>sap.m.page</code>
 * with a header of type <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>
 * and content of type <code>sap.ushell.ui.launchpad.DashboardGroupsContainer</code>.
 *
 * @version 1.74.0
 * @name sap.ushell.components.homepage.DashboardContent.view
 * @private
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/library",
    "sap/m/Page",
    "sap/ui/core/AccessibleLandmarkRole",
    "sap/ui/core/mvc/View",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ushell/components/homepage/DashboardGroupsBox",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AnchorItem",
    "sap/ushell/ui/launchpad/AnchorNavigationBar",
    "sap/ushell/utils",
    "sap/ui/core/Component",
    "sap/ui/model/FilterOperator"
], function (
    jQuery,
    oMLib,
    Page,
    AccessibleLandmarkRole,
    View,
    Device,
    Filter,
    DashboardGroupsBox,
    Config,
    EventHub,
    resources,
    AnchorItem,
    AnchorNavigationBar,
    utils,
    Component,
    FilterOperator
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.homepage.DashboardContent", {
        /*
        * Creating the content of the main dashboard view.
        * The view is basically a sap.m.Page control that contains:
        *  - AnchorNavigationBar as header.
        *  - DashboardGroupsBox that contains the groups and tiles as content.
        *  - Bar in the footer if edit mode is enabled.
        */
        createContent: function (oController) {
            this.oModel = this.getModel();

            var bEnablePersonalization = this.oModel.getProperty("/personalization"),
                oHomepageManager = sap.ushell.components.getHomepageManager ? sap.ushell.components.getHomepageManager() : undefined;

            this.isCombi = Device.system.combi;
            this.isTouch = this.isCombi ? false : (Device.system.phone || Device.system.tablet);
            this.parentComponent = Component.getOwnerComponentFor(this);
            this.addStyleClass("sapUshellDashboardView");
            this.ieHtml5DnD = bEnablePersonalization && oHomepageManager && oHomepageManager.isIeHtml5DnD();
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeInactive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeActive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRefresh", this._onDashboardShown, this);

            /**
             * In order to save performance we delay the actionmode, the footer creation and the overflow of the anchorBar
             * till core-ext file has been loaded.
             */
            this.oDoable = EventHub.once("CoreResourcesComplementLoaded").do(function () {
                this.oAnchorNavigationBar.setOverflowEnabled(true);

                if (bEnablePersonalization) {
                    sap.ui.require(["sap/ushell/components/homepage/ActionMode"], function (ActionMode) {
                        ActionMode.init(this.oModel);
                    }.bind(this));

                    this._createFooter();
                    this._createActionModeMenuButton();
                }
            }.bind(this));

            this.oRenderer.getRouter().getRoute("home").attachMatched(this._onDashboardShown, this);

            this.oAnchorNavigationBar = this._getAnchorNavigationBar(oController);

            var oDashboardGroupsBoxModule = new DashboardGroupsBox();
            // Create the DashboardGroupsBox object that contains groups and tiles
            this.oDashboardGroupsBox = oDashboardGroupsBoxModule.createGroupsBox(oController, this.oModel);

            this.oFilterSelectedGroup = new Filter("isGroupSelected", FilterOperator.EQ, true);

            this.oPage = new Page("sapUshellDashboardPage", {
                customHeader: this.oAnchorNavigationBar,
                landmarkInfo: {
                    headerRole: AccessibleLandmarkRole.Navigation,
                    headerLabel: resources.i18n.getText("NavigationBarLabel"),
                    contentRole: sap.ui.core.AccessibleLandmarkRole.Region,
                    contentLabel: resources.i18n.getText("DashboardGroupsLabel")
                },
                floatingFooter: true,
                content: [this.oDashboardGroupsBox]
            });

            this.oPage.addEventDelegate({
                onAfterRendering: function () {
                    var oDomRef = this.getDomRef(),
                        oScrollableElement = oDomRef.getElementsByTagName("section");

                    jQuery(oScrollableElement[0]).off("scrollstop", oController.handleDashboardScroll);
                    jQuery(oScrollableElement[0]).on("scrollstop", oController.handleDashboardScroll);
                }.bind(this)
            });

            return this.oPage;
        },

        getAnchorItemTemplate: function () {
            var that = this,
                bHelpEnabled = Config.last("/core/extension/enableHelp");
            var oAnchorItemTemplate = new AnchorItem({
                index: "{index}",
                title: "{title}",
                groupId: "{groupId}",
                defaultGroup: "{isDefaultGroup}",
                writeHelpId: bHelpEnabled,
                selected: false,
                isGroupRendered: "{isRendered}",
                visible: {
                    parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                    formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                        // Empty groups should not be displayed when personalization is off or
                        // if they are locked or default group not in action mode
                        if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                            return false;
                        }
                        return isGroupVisible || tileActionModeActive;
                    }
                },
                locked: "{isGroupLocked}",
                isGroupDisabled: {
                    parts: ["isGroupLocked", "/isInDrag", "/homePageGroupDisplay"],
                    formatter: function (bIsGroupLocked, bIsInDrag, sAnchorbarMode) {
                        return bIsGroupLocked && bIsInDrag && sAnchorbarMode === "tabs";
                    }
                },
                press: function (oEvent) {
                    that.oAnchorNavigationBar.handleAnchorItemPress(oEvent);
                }
            });

            oAnchorItemTemplate.attachBrowserEvent("focus", function () {
                this.setNavigationBarItemsVisibility();
            }.bind(this.oAnchorNavigationBar));

            return oAnchorItemTemplate;
        },

        _getAnchorNavigationBar: function (oController) {
            var oAnchorNavigationBar = new AnchorNavigationBar("anchorNavigationBar", {
                selectedItemIndex: "{/topGroupInViewPortIndex}",
                itemPress: [function (oEvent) {
                    this._handleAnchorItemPress(oEvent);
                }, oController],
                overflowEnabled: false // we will enable the overflow once coreExt will be loaded!!!
            });

            if (Device.system.desktop) {
                oAnchorNavigationBar.addEventDelegate({
                    onsapskipforward: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.components.ComponentKeysHandler.goToTileContainer(oEvent, this.bGroupWasPressed);
                        this.bGroupWasPressed = false;
                    },
                    onsapskipback: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    },
                    onsapenter: function (oEvent) {
                        oEvent.srcControl.getDomRef().click();
                    },
                    onsapspace: function (oEvent) {
                        oEvent.srcControl.getDomRef().click();
                    }
                });
            }

            oAnchorNavigationBar.addStyleClass("sapContrastPlus");

            return oAnchorNavigationBar;
        },

        _actionModeButtonPress: function () {
            this.oDashboardGroupsBox.getBinding("groups").filter([]); // replace model filter inorder to show hidden groups
            var dashboardGroups = this.oDashboardGroupsBox.getGroups();
            sap.ushell.components.homepage.ActionMode.toggleActionMode(this.oModel, "Menu Item", dashboardGroups);
            this._updateAnchorNavigationBarVisibility();
            if (this.oModel.getProperty("/homePageGroupDisplay") === "tabs") {
                if (this.oModel.getProperty("/tileActionModeActive")) { // To edit mode
                    // find the selected group
                    var aGroups = this.oModel.getProperty("/groups"),
                        selectedGroup;
                    for (var i = 0; i < aGroups.length; i++) {
                        if (aGroups[i].isGroupSelected) {
                            selectedGroup = i;
                            break;
                        }
                    }
                    // scroll to selected group
                    this.getController()._scrollToGroup("launchpad", "scrollToGroup", {
                        group: {
                            getGroupId: function () {
                                return aGroups[selectedGroup].groupId;
                            }
                        },
                        groupChanged: false,
                        focus: true
                    });
                } else { // To non-edit mode
                    this.getController()._deactivateActionModeInTabsState();
                }
            }
        },

        _createActionModeMenuButton: function () {
            var oActionButtonObjectData = {
                id: "ActionModeBtn",
                text: resources.i18n.getText("activateEditMode"),
                icon: "sap-icon://edit",
                press: this._actionModeButtonPress.bind(this)
            };

            // in case the edit home page button was moved to the shell header,
            // it was already created as an shell Head Item in Controll Manager
            // only here we have access to the text and press method
            this.oTileActionsButton = sap.ui.getCore().byId(oActionButtonObjectData.id);
            if (this.oTileActionsButton) {
                this.oTileActionsButton.setTooltip(oActionButtonObjectData.text);
                this.oTileActionsButton.setText(oActionButtonObjectData.text);
                this.oTileActionsButton.attachPress(oActionButtonObjectData.press);
            } else {
                var oAddActionButtonParameters = {
                    controlType: "sap.ushell.ui.launchpad.ActionItem",
                    oControlProperties: oActionButtonObjectData,
                    bIsVisible: true,
                    aStates: ["home"]
                };

                this.oRenderer.addUserAction(oAddActionButtonParameters).done(function (oActionButton) {
                    this.oTileActionsButton = oActionButton;
                    // if xRay is enabled
                    if (Config.last("/core/extension/enableHelp")) {
                        this.oTileActionsButton.addStyleClass("help-id-ActionModeBtn");// xRay help ID
                    }
                }.bind(this));
            }
        },

        _handleEditModeChange: function () {
            if (this.oTileActionsButton) {
                this.oTileActionsButton.toggleStyleClass("sapUshellAcionItemActive");
            }
        },

        _createFooter: function () {
            sap.ui.require([
                "sap/m/Bar",
                "sap/m/Button",
                "sap/m/ToolbarSpacer"
            ], function (Bar, Button, ToolbarSpacer) {
                var oFooter = new Bar("sapUshellDashboardFooter", {
                    visible: "{/tileActionModeActive}",
                    contentRight: [new ToolbarSpacer()]
                });

                var oDoneBtn = new Button("sapUshellDashboardFooterDoneBtn", {
                    type: oMLib.ButtonType.Emphasized,
                    text: resources.i18n.getText("closeEditMode"),
                    tooltip: resources.i18n.getText("exitEditMode"),
                    press: this._actionModeButtonPress.bind(this)
                });
                if (Device.system.desktop) {
                    oDoneBtn.addEventDelegate({
                        onsapskipforward: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        },
                        onsapskipback: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.goToFirstVisibleTileContainer();
                        },
                        onsaptabprevious: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.goToFirstVisibleTileContainer();
                        },
                        onsaptabnext: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    });
                }

                oFooter.addContentRight(oDoneBtn);
                this.oPage.setFooter(oFooter);
            }.bind(this));
        },

        _onDashboardShown: function () {
            var bInDashboard = this.oRenderer && this.oRenderer.getCurrentCoreView() === "home";

            if (bInDashboard) {
                if (!Device.system.phone) {
                    this.oRenderer.showRightFloatingContainer(false);
                }

                this._updateAnchorNavigationBarVisibility();

                this.getController().resizeHandler();
                utils.refreshTiles();
                if (Device.system.desktop) {
                    sap.ushell.components.ComponentKeysHandler.goToTileContainer();
                }
            }
        },

        _updateAnchorNavigationBarVisibility: function () {
            var bOldVisible = this.oPage.getShowHeader(),
                aVisibleGroups = this.oAnchorNavigationBar.getVisibleGroups(),
                bVisible = aVisibleGroups.length > 1;

            this.oPage.setShowHeader(bVisible);

            if (bVisible && !bOldVisible) {
                var aGroups = this.getModel().getProperty("/groups"),
                    iSelectedGroup = this.getModel().getProperty("/iSelectedGroup");

                for (var i = 0; i < aVisibleGroups.length; i++) {
                    if (aVisibleGroups[i].getGroupId() === aGroups[iSelectedGroup].groupId) {
                        this.oAnchorNavigationBar.setSelectedItemIndex(i);
                        break;
                    }
                }
            }
        },

        getControllerName: function () {
            return "sap.ushell.components.homepage.DashboardContent";
        },

        exit: function () {
            View.prototype.exit.apply(this, arguments);

            if (this.oAnchorNavigationBar) {
                this.oAnchorNavigationBar.handleExit();
                this.oAnchorNavigationBar.destroy();
            }
            if (this.oTileActionsButton) {
                this.oTileActionsButton.destroy();
            }

            if (this.oDoable) {
                this.oDoable.off();
            }

            if (this.oDoneBtnLabel) {
                this.oDoneBtnLabel.destroy();
            }

            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeInactive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeActive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "contentRefresh", this._onDashboardShown, this);
        }
    });
}, /* bExport= */ false);
},
	"sap/ushell/components/homepage/DashboardGroupsBox.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview A module that is responsible for creating the groups part (i.e. box) of the dashboard.<br>
 * Extends <code>sap.ui.base.Object</code><br>
 * Exposes the public function <code>createGroupsBox</code>
 * @see sap.ushell.components.homepage.DashboardContent.view
 *
 * @version 1.74.0
 * @name sap.ushell.components.homepage.DashboardGroupsBox
 * @since 1.35.0
 * @private
 */
sap.ui.define([
    "sap/ushell/Layout",
    "sap/ui/base/Object",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/ui/core/Component",
    "sap/m/GenericTile",
    "sap/ui/Device",
    "sap/ushell/ui/launchpad/PlusTile",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/TileContainer",
    "sap/ushell/ui/launchpad/LinkTileWrapper",
    "sap/m/Button",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/ui/launchpad/GroupHeaderActions",
    "sap/base/util/isEmptyObject",
    "sap/ui/thirdparty/jquery",
    "sap/ui/performance/Measurement"
], function (
    Layout,
    baseObject,
    Filter,
    FilterOperator,
    LaunchpadTile,
    DashboardGroupsContainer,
    Config,
    EventHub,
    utils,
    Component,
    GenericTile,
    Device,
    PlusTile,
    resources,
    TileContainer,
    LinkTileWrapper,
    Button,
    AccessibilityCustomData,
    GroupHeaderActions,
    isEmptyObject,
    jQuery,
    Measurement
) {
        "use strict";

        var DashboardGroupsBox = baseObject.extend("sap.ushell.components.homepage.DashboardGroupsBox", {
            metadata: {
                publicMethods: ["createGroupsBox"]
            },

            constructor: function (/*sId, mSettings*/) {
                // Make this class only available once
                if (sap.ushell.components.homepage.getDashboardGroupsBox && sap.ushell.components.homepage.getDashboardGroupsBox()) {
                    return sap.ushell.components.homepage.getDashboardGroupsBox();
                }
                sap.ushell.components.homepage.getDashboardGroupsBox = (function (value) {
                    return function () {
                        return value;
                    };
                }(this.getInterface()));

                this.oController = undefined;
                this.oGroupsContainer = undefined;
                this.isLinkPersonalizationSupported = sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported();

                sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeActive", this._handleActionModeChange, this);
                sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeInactive", this._handleActionModeChange, this);
                sap.ui.getCore().getEventBus().subscribe("launchpad", "GroupHeaderVisibility", this._updateGroupHeaderVisibility, this);
            },

            destroy: function () {
                sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeActive", this._handleActionModeChange, this);
                sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeInactive", this._handleActionModeChange, this);
                sap.ui.getCore().getEventBus().unsubscribe("launchpad", "GroupHeaderVisibility", this._updateGroupHeaderVisibility, this);
                sap.ushell.components.homepage.getDashboardGroupsBox = undefined;
            },

            calculateFilter: function () {
                // get the homeGroupDisplayMode and do the filter accordingly
                var filters = [];
                var oFilter;
                var sGroupsMode = this.oModel.getProperty("/homePageGroupDisplay"),
                    bEditMode = this.oModel.getProperty("/tileActionModeActive");

                if (!bEditMode) {
                    if (sGroupsMode && sGroupsMode === "tabs") {
                        oFilter = new Filter("isGroupSelected", FilterOperator.EQ, true);
                    } else {
                        oFilter = new Filter("isGroupVisible", FilterOperator.EQ, true);
                    }
                    filters.push(oFilter);
                }

                return filters;
            },

            /**
             * Creating the groups part (i.e. box) of the dashboard
             */
            createGroupsBox: function (oController, oModel) {
                this.oController = oController;
                var that = this,
                    fAfterLayoutInit,
                    fGroupsContainerAfterRenderingHandler,

                    getPlusTileFromGroup = function (oGroup) {
                        var groupDomRef,
                            plusTileDomRef;
                        if (oGroup && (groupDomRef = oGroup.getDomRef())) {
                            plusTileDomRef = groupDomRef.querySelector(".sapUshellPlusTile");
                            if (plusTileDomRef) {
                                return plusTileDomRef;
                            }
                        }
                        return null;
                    },

                    reorderTilesCallback = function (layoutInfo) {
                        var plusTileStartGroup = getPlusTileFromGroup(layoutInfo.currentGroup),
                            plusTileEndGroup = getPlusTileFromGroup(layoutInfo.endGroup),
                            isPlusTileVanishRequired = (layoutInfo.tiles[layoutInfo.tiles.length - 2] === layoutInfo.item) || (layoutInfo.endGroup.getTiles().length === 0);
                        if (isPlusTileVanishRequired) {
                            that._hidePlusTile(plusTileEndGroup);
                        } else {
                            that._showPlusTile(plusTileEndGroup);
                        }

                        if (layoutInfo.currentGroup !== layoutInfo.endGroup) {
                            that._showPlusTile(plusTileStartGroup);
                        }
                    };

                //Since the layout initialization is async, we need to execute the below function after initialization is done
                fAfterLayoutInit = function () {
                    //Prevent Plus Tile influence on the tiles reordering by exclude it from the layout matrix calculations
                    Layout.getLayoutEngine().setExcludedControl(PlusTile);
                    //Hide plus tile when collision with it
                    Layout.getLayoutEngine().setReorderTilesCallback.call(Layout.layoutEngine, reorderTilesCallback);
                };

                fGroupsContainerAfterRenderingHandler = function () {
                    if (!Layout.isInited) {
                        Layout.init({
                            getGroups: this.getGroups.bind(this),
                            getAllGroups: that.getAllGroupsFromModel.bind(that),
                            isTabBarActive: that.isTabBarActive.bind(that)
                        }).done(fAfterLayoutInit);

                        //when media is changed we need to rerender Layout
                        //media could be changed by SAPUI5 without resize, or any other events. look for internal Incident ID: 1580000668
                        Device.media.attachHandler(function () {
                            if (!this.bIsDestroyed) {
                                Layout.reRenderGroupsLayout(null);
                            }
                        }, this, Device.media.RANGESETS.SAP_STANDARD);

                        var oDomRef = this.getDomRef();
                        oController.getView().sDashboardGroupsWrapperId = !isEmptyObject(oDomRef) && oDomRef.parentNode ? oDomRef.parentNode.id : "";
                    }

                    if (this.getGroups().length) {
                        //Tile opacity is enabled by default, therefore we handle tile opacity in all cases except
                        //case where flag is explicitly set to false
                        if (this.getModel().getProperty("/enableTilesOpacity")) {
                            utils.handleTilesOpacity(this.getModel());
                        }
                    }
                    EventHub.emit("CenterViewPointContentRendered");
                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");
                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");
                    this.getBinding("groups").filter(that.calculateFilter());
                };

                this.isTabBarActive = function () {
                    return this.oModel.getProperty("/homePageGroupDisplay") === "tabs";
                };

                this.oModel = oModel;
                var filters = this.calculateFilter(),
                    bUseGridContainer = Config.last("/core/home/gridContainer");

                this.oGroupsContainer = new DashboardGroupsContainer("dashboardGroups", {
                    displayMode: "{/homePageGroupDisplay}",
                    afterRendering: fGroupsContainerAfterRenderingHandler
                });

                if (bUseGridContainer) {
                    sap.ui.require(["sap/ushell/ui/launchpad/GridContainer"], function (/*GridContainer*/) {
                        that.oGroupsContainer.bindAggregation("groups", {
                            filters: filters,
                            path: "/groups",
                            factory: function () {
                                var sSizeBehavior = Config.last("/core/home/sizeBehavior");
                                var oGridContainer = that._createGridContainer(oController, oModel);
                                oGridContainer.setTileSizeBehavior(sSizeBehavior);
                                return oGridContainer;
                            }
                        });
                    });
                    Config.on("/core/home/sizeBehavior").do(function (sTileSize) {
                        that.oGroupsContainer.getAggregation("groups").forEach(function (oGroup) {
                            oGroup.setTileSizeBehavior(sTileSize);
                        });
                    });
                } else {
                    this.oGroupsContainer.bindAggregation("groups", {
                        filters: filters,
                        path: "/groups",
                        factory: function () {
                            return that._createTileContainer(oController, oModel);
                        }
                    });
                }

                if (Device.system.desktop) {
                    this.oGroupsContainer.addEventDelegate({
                        onsapskipback: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);

                            if (jQuery(".sapUshellAnchorItem").is(":visible")) {
                                sap.ushell.components.ComponentKeysHandler.goToSelectedAnchorNavigationItem();
                            } else {
                                sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                            }
                        },

                        onsapskipforward: function (oEvent) {
                            oEvent.preventDefault();
                            var oDoneBtn = window.document.getElementById("sapUshellDashboardFooterDoneBtn");
                            if (oDoneBtn) {
                                oDoneBtn.focus();
                            } else if (jQuery("#sapUshellFloatingContainerWrapper").is(":visible") && oEvent.originalEvent.srcElement.id !== "") {
                                // if co-pilot exists and we came from tile - need to focus on copilot - otherwise - on the shell header
                                sap.ui.getCore().getEventBus().publish("launchpad", "shellFloatingContainerIsAccessible");
                            } else {
                                sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                            }
                        },

                        onsaptabnext: function (oEvent) {
                            if (that.oModel.getProperty("/tileActionModeActive")) {
                                if (jQuery(document.activeElement).closest(".sapUshellTileContainerHeader").length) {
                                    // We are inside the header.
                                    // ONLY focused element is last before the tiles-list we call to set focus on tiles list.
                                    // otherwise - let the browser handle it.

                                    var jqCurrentTileContainer = jQuery(document.activeElement).closest(".sapUshellTileContainer");

                                    // Inside header we can be on 2 section elements - title OR on a header action button
                                    // check if we are on the title itself
                                    var isCurrentElementTitle = jQuery(document.activeElement).hasClass("sapUshellContainerTitle");

                                    // Search for actions inside the header title element
                                    var jqChildActions = jqCurrentTileContainer.find(".sapUshellHeaderActionButton");

                                    if (isCurrentElementTitle && !jqChildActions.length || document.activeElement.id === jqChildActions.last()[0].id) {
                                        if (jqCurrentTileContainer.find(".sapUshellTile, .sapUshellLink, .sapFCard").is(":visible")) {
                                            oEvent.preventDefault();
                                            sap.ushell.components.ComponentKeysHandler.goToLastVisitedTile(jqCurrentTileContainer, true);
                                            return;
                                        }
                                    }

                                    if (jqChildActions.length && document.activeElement.id !== jqChildActions.last()[0].id) {
                                        return;
                                    }
                                }

                                var oDoneBtn = window.document.getElementById("sapUshellDashboardFooterDoneBtn");
                                if (oDoneBtn) {
                                    oEvent.preventDefault();
                                    oDoneBtn.focus();
                                    return;
                                }
                            }

                            oEvent.preventDefault();
                            if (jQuery("#sapUshellFloatingContainerWrapper").is(":visible") && (oEvent.originalEvent.srcElement.id) !== "") {
                                sap.ui.getCore().getEventBus().publish("launchpad", "shellFloatingContainerIsAccessible");
                            } else {
                                sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                            }
                        },

                        onsaptabprevious: function (oEvent) {
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            var jqFocused = jQuery(":focus");
                            if (that.oModel.getProperty("/tileActionModeActive") && !jqFocused.hasClass("sapUshellTileContainerHeader")) {
                                var jqActiveElement = jQuery(document.activeElement);

                                // only in case focus is on a tile we need custom behavior upon shift-tab
                                // otherwise let the browser handle it
                                if (jqActiveElement.hasClass("sapUshellTile") || jqActiveElement.hasClass("sapFCard")) {
                                    oEvent.preventDefault();

                                    // take reference to current tile container
                                    var jqCurrentTileContainer = jqActiveElement.closest(".sapUshellTileContainer");

                                    //  search for actions inside the header title element
                                    var jqLastAction = jqCurrentTileContainer.find(".sapUshellHeaderActionButton").filter(":visible").last();

                                    // check if actions exist on header title element
                                    // if there are actions of tile container header - focus on last one
                                    if (jqLastAction.length > 0) {
                                        jqLastAction.focus();
                                    } else {
                                        // else focus on title
                                        jqCurrentTileContainer.find(".sapUshellContainerTitle").focus();
                                    }
                                }
                            }
                        }
                    });
                }
                return this.oGroupsContainer;
            },

            getAllGroupsFromModel: function () {
                return this.oModel.getProperty("/groups");
            },

            _createTileContainer: function (oController/*, oModel*/) {
                var that = this,
                    oFilter = new Filter("isTileIntentSupported", FilterOperator.EQ, true),
                    oTilesContainer = new TileContainer({
                        headerText: "{title}",
                        showEmptyLinksArea: {
                            parts: ["/tileActionModeActive", "links/length", "isGroupLocked", "/isInDrag", "/homePageGroupDisplay"],
                            formatter: function (tileActionModeActive, numOfLinks, isGroupLocked, bIsInDrag, sAnchorbarMode) {
                                if (numOfLinks) {
                                    return true;
                                } else if (isGroupLocked) {
                                    return false;
                                }
                                return tileActionModeActive || bIsInDrag && sAnchorbarMode === "tabs";
                            }
                        },
                        showMobileActions: {
                            parts: ["/tileActionModeActive"],
                            formatter: function (bIsActionModeActive) {
                                return bIsActionModeActive && !this.getDefaultGroup();
                            }
                        },
                        showIcon: {
                            parts: ["/isInDrag", "/tileActionModeActive"],
                            formatter: function (bIsInDrag, bIsActionModeActive) {
                                return (this.getIsGroupLocked() && (bIsInDrag || bIsActionModeActive));
                            }
                        },
                        deluminate: {
                            parts: ["/isInDrag"],
                            formatter: function (bIsInDrag) {
                                //  return oEvent.oSource.getIsGroupLocked() && bIsInDrag;
                                return this.getIsGroupLocked() && bIsInDrag;
                            }
                        },
                        transformationError: {
                            parts: ["/isInDrag", "/draggedTileLinkPersonalizationSupported"],
                            formatter: function (bIsInDrag, bDraggedTileLinkPersonalizationSupported) {
                                return bIsInDrag && !bDraggedTileLinkPersonalizationSupported;
                            }
                        },
                        showBackground: "{/tileActionModeActive}",
                        tooltip: "{title}",
                        tileActionModeActive: "{/tileActionModeActive}",
                        ieHtml5DnD: oController.getView().ieHtml5DnD,
                        enableHelp: "{/enableHelp}",
                        groupId: "{groupId}",
                        defaultGroup: "{isDefaultGroup}",
                        isLastGroup: "{isLastGroup}",
                        isGroupLocked: "{isGroupLocked}",
                        isGroupSelected: "{isGroupSelected}",
                        showHeader: true,
                        showGroupHeader: "{showGroupHeader}",
                        homePageGroupDisplay: "{/homePageGroupDisplay}",
                        editMode: "{editMode}",
                        supportLinkPersonalization: this.isLinkPersonalizationSupported,
                        titleChange: function (oEvent) {
                            sap.ui.getCore().getEventBus().publish("launchpad", "changeGroupTitle", {
                                groupId: oEvent.getSource().getGroupId(),
                                newTitle: oEvent.getParameter("newTitle")
                            });
                        },
                        showEmptyLinksAreaPlaceHolder: {
                            parts: ["links/length", "/isInDrag", "/homePageGroupDisplay"],
                            formatter: function (numOfLinks, bIsInDrag, sAnchorbarMode) {
                                return bIsInDrag && sAnchorbarMode === "tabs" && !numOfLinks;
                            }
                        },
                        showPlaceholder: {
                            parts: ["/tileActionModeActive", "tiles/length"],
                            formatter: function (tileActionModeActive) {
                                return tileActionModeActive && !this.getIsGroupLocked();
                            }
                        },
                        visible: {
                            parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                            formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                                // Empty groups should not be displayed when personalization is off or
                                // if they are locked or default group not in action mode
                                if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                                    return false;
                                }
                                return isGroupVisible || tileActionModeActive;
                            }
                        },
                        hidden: {
                            parts: ["/tileActionModeActive", "isGroupVisible"],
                            formatter: function (bIsActionModeActive, bIsGroupVisible) {
                                return bIsActionModeActive && !bIsGroupVisible;
                            }
                        },
                        links: this._getLinkTemplate(),
                        tiles: {
                            path: "tiles",
                            factory: this._itemFactory.bind(this),
                            filters: [oFilter]
                        },
                        add: /*oController._addTileContainer,*/ function (oEvent) {
                            that._handleAddTileToGroup(oEvent);
                        }
                    });
                return oTilesContainer;
            },

            _createGridContainer: function (oController/*, oModel*/) {
                var GridContainer = sap.ui.require("sap/ushell/ui/launchpad/GridContainer"),
                    oFilter = new Filter("isTileIntentSupported", FilterOperator.EQ, true);
                return new GridContainer({
                    groupId: "{groupId}",
                    showHeader: true,
                    defaultGroup: "{isDefaultGroup}",
                    isLastGroup: "{isLastGroup}",
                    headerText: "{title}",
                    showGroupHeader: "{showGroupHeader}",
                    homePageGroupDisplay: "{/homePageGroupDisplay}",
                    visible: {
                        parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                        formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                            // Empty groups should not be displayed when personalization is off or
                            // if they are locked or default group not in action mode
                            if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                                return false;
                            }
                            return isGroupVisible || tileActionModeActive;
                        }
                    },
                    isGroupLocked: "{isGroupLocked}",
                    isGroupSelected: "{isGroupSelected}",
                    editMode: "{editMode}",
                    showBackground: "{/tileActionModeActive}",
                    showIcon: {
                        parts: ["/isInDrag", "/tileActionModeActive"],
                        formatter: function (bIsInDrag, bIsActionModeActive) {
                            return (this.getIsGroupLocked() && (bIsInDrag || bIsActionModeActive));
                        }
                    },
                    tileActionModeActive: "{/tileActionModeActive}",
                    supportLinkPersonalization: this.isLinkPersonalizationSupported,
                    ieHtml5DnD: oController.getView().ieHtml5DnD,
                    enableHelp: "{/enableHelp}",
                    showEmptyLinksAreaPlaceHolder: {
                        parts: ["links/length", "/isInDrag", "/homePageGroupDisplay"],
                        formatter: function (numOfLinks, bIsInDrag, sAnchorbarMode) {
                            return bIsInDrag && sAnchorbarMode === "tabs" && !numOfLinks;
                        }
                    },
                    showEmptyLinksArea: {
                        parts: ["/tileActionModeActive", "links/length", "isGroupLocked", "/isInDrag", "/homePageGroupDisplay"],
                        formatter: function (tileActionModeActive, numOfLinks, isGroupLocked, bIsInDrag, sAnchorbarMode) {
                            if (numOfLinks) {
                                return true;
                            } else if (isGroupLocked) {
                                return false;
                            }
                            return tileActionModeActive || bIsInDrag && sAnchorbarMode === "tabs";
                        }
                    },
                    titleChange: function (oEvent) {
                        sap.ui.getCore().getEventBus().publish("launchpad", "changeGroupTitle", {
                            groupId: oEvent.getSource().getGroupId(),
                            newTitle: oEvent.getParameter("newTitle")
                        });
                    },
                    tooltip: "{title}",
                    links: this._getLinkTemplate(),
                    tiles: {
                        path: "tiles",
                        factory: this._itemFactory.bind(this),
                        filters: [oFilter]
                    }
                });
            },

            _getLinkTemplate: function () {
                var oFilter = new Filter("isTileIntentSupported", FilterOperator.EQ, true);

                if (!this.isLinkPersonalizationSupported) {
                    return {
                        path: "links",
                        templateShareable: true,
                        template: new LinkTileWrapper({
                            uuid: "{uuid}",
                            tileCatalogId: "{tileCatalogId}",
                            target: "{target}",
                            isLocked: "{isLocked}",
                            tileActionModeActive: "{/tileActionModeActive}",
                            animationRendered: false,
                            debugInfo: "{debugInfo}",
                            ieHtml5DnD: this.oController.getView().ieHtml5DnD,
                            tileViews: {
                                path: "content",
                                factory: function (sId, oContext) {
                                    return oContext.getObject();
                                }
                            },
                            afterRendering: function (oEvent) {
                                var jqHrefElement = jQuery(this.getDomRef().getElementsByTagName("a"));
                                // Remove tabindex from links
                                //  so that the focus will not be automatically set on the focusable link when returning to the launchpad
                                jqHrefElement.attr("tabindex", -1);
                            }
                        }),
                        filters: [oFilter]
                    };
                }
                return {
                    path: "links",
                    factory: function (sId, oContext) {
                        var oControl = oContext.getObject().content[0];
                        if (oControl && oControl.bIsDestroyed) {
                            oControl = oControl.clone();
                            oContext.getModel().setProperty(oContext.getPath() + "/content/0", oControl);
                        }
                        return oControl;
                    },
                    filters: [oFilter]
                };
            },

            _itemFactory: function (sId, oContext) {
                var oTileOrCard = oContext.getProperty(oContext.sPath),
                    aContent,
                    oContent,
                    oControl,
                    oManifest;

                if (oTileOrCard) {
                    if (oTileOrCard.isCard) {
                        aContent = oTileOrCard && oTileOrCard.content;
                        oContent = aContent && aContent.length && aContent[0];
                        if (oContent && oContent["sap.card"]) {
                            oManifest = oContent;
                        } else if (oTileOrCard.manifest) {
                            // Placeholder manifest for blind loading
                            oManifest = {
                                "sap.flp": oTileOrCard.manifest && oTileOrCard.manifest["sap.flp"],
                                "sap.card": { "type": "List" }
                            };
                        } else {
                            return this._createErrorTile();
                        }

                        // Temporary solution for incident 1980261315. The library "sap.ui.intergration" should only be
                        // loaded only when cards are used and should be loaded synchronously. Refactoring is needed to
                        // enable the asynchronous loading of the library.
                        sap.ui.getCore().loadLibrary("sap.ui.integration");
                        var Card = sap.ui.requireSync("sap/ui/integration/widgets/Card");
                        oControl = new Card({
                            manifest: oManifest
                        });
                    } else {
                        oControl = this._createTile();
                    }
                    oTileOrCard.controlId = oControl && oControl.getId && oControl.getId();
                }
                return oControl;
            },

            /**
             * Creates a generic error tile. It will be displayed with a generic "Cannot load tile" subheader.
             *
             * @returns {sap.ushell.ui.launchpad.Tile} The Launchpad Tile containing a GenericTile in error mode
             *
             * @private
             */
            _createErrorTile: function () {
                return new LaunchpadTile({
                    tileViews: {
                        path: "content",
                        factory: function () {
                            return new GenericTile({
                                state: "Failed"
                            });
                        }
                    }
                });
            },

            _createTile: function () {
                var oTile = new LaunchpadTile({
                    "long": "{long}",
                    // The model flag draggedInTabBarToSourceGroup was set for the tile in when it was dragged on TabBar between groups
                    isDraggedInTabBarToSourceGroup: "{draggedInTabBarToSourceGroup}",
                    uuid: "{uuid}",
                    tileCatalogId: "{tileCatalogId}",
                    isCustomTile: "{isCustomTile}",
                    target: "{target}",
                    isLocked: "{isLocked}",
                    navigationMode: "{navigationMode}",
                    tileActionModeActive: "{/tileActionModeActive}",
                    showActionsIcon: "{showActionsIcon}",
                    rgba: "{rgba}",
                    animationRendered: false,
                    debugInfo: "{debugInfo}",
                    ieHtml5DnD: this.oController.getView().ieHtml5DnD,
                    tileViews: {
                        path: "content",
                        factory: function (sId, oContext) {
                            return oContext.getObject();
                        }
                    },
                    coverDivPress: function (oEvent) {
                        // if this tile had just been moved and the move itself did not finish refreshing the tile's view
                        // we do not open the actions menu to avoid inconsistencies
                        if (!oEvent.oSource.getBindingContext().getObject().tileIsBeingMoved && sap.ushell.components.homepage.ActionMode) {
                            sap.ushell.components.homepage.ActionMode._openActionsMenu(oEvent);
                        }
                    },
                    showActions: function (oEvent) {
                        if (sap.ushell.components.homepage.ActionMode) {
                            sap.ushell.components.homepage.ActionMode._openActionsMenu(oEvent);
                        }
                    },
                    deletePress: [this.oController._dashboardDeleteTileHandler, this.oController],
                    press: [this.oController.dashboardTilePress, this.oController]
                });
                var oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
                oTile.addEventDelegate({
                    onclick: function (/*oEvent*/) {
                        Measurement.start("FLP:DashboardGroupsBox.onclick", "Click on tile", "FLP");
                        Measurement.start("FLP:OpenApplicationonClick", "Open Application", "FLP");
                        function endTileMeasurement () {
                            Measurement.end("FLP:DashboardGroupsBox.onclick");
                            oViewPortContainer.detachAfterNavigate(endTileMeasurement);
                        }
                        oViewPortContainer.attachAfterNavigate(endTileMeasurement);
                    }
                });
                return oTile;
            },

            _updateGroupHeaderVisibility: function () {
                var aGroups = this.oGroupsContainer.getGroups(),
                    bEditMode = this.oModel.getProperty("/tileActionModeActive"),
                    bAnchorbar = this.oController.getView().oPage.getShowHeader(),
                    iFirstVisible,
                    iVisibleGroups = 0;

                for (var i = 0; i < aGroups.length; i++) {
                    if (aGroups[i].getProperty("visible")) {
                        iVisibleGroups++;

                        if (iFirstVisible === undefined) {
                            iFirstVisible = i;
                        } else {
                            aGroups[i].setShowGroupHeader(true);
                        }
                    }
                }

                if (iFirstVisible !== undefined) {
                    var bVisible = bEditMode || (iVisibleGroups === 1 && !bAnchorbar);
                    aGroups[iFirstVisible].setShowGroupHeader(bVisible);
                }
            },

            _handleActionModeChange: function () {
                var bActiveMode = this.oModel.getProperty("/tileActionModeActive");
                if (bActiveMode) {
                    this._addTileContainersContent();
                } else {
                    // in order to set groups again to their right position after closing edit mode, we will need to re-render
                    // the groups layout. We need it for the Locked Groups Compact Layout feature
                    Layout.reRenderGroupsLayout(null);
                }
            },

            _addTileContainersContent: function () {
                var aGroups = this.oGroupsContainer.getGroups();
                for (var i = 0; i < aGroups.length; i++) {
                    var oGroup = aGroups[i];

                    if (!oGroup.getBeforeContent().length) {
                        oGroup.addBeforeContent(this._getBeforeContent());
                    }

                    if (!oGroup.getAfterContent().length) {
                        oGroup.addAfterContent(this._getAfterContent());
                    }

                    if (!oGroup.getHeaderActions().length) {
                        oGroup.addHeaderAction(this._getGroupHeaderAction());
                    }
                }
            },

            _handleAddGroupButtonPress: function (oData) {
                this.oController._addGroupHandler(oData);
                this._addTileContainersContent();
            },

            _getBeforeContent: function () {
                var oAddGroupButton = new Button({
                    icon: "sap-icon://add",
                    text: resources.i18n.getText("add_group_at"),
                    visible: "{= !${isGroupLocked} && !${isDefaultGroup} && ${/tileActionModeActive}}",
                    enabled: "{= !${/editTitle}}",
                    press: [this._handleAddGroupButtonPress.bind(this)]
                });
                oAddGroupButton.addStyleClass("sapUshellAddGroupButton");
                oAddGroupButton.addCustomData(new AccessibilityCustomData({
                    key: "tabindex",
                    value: "-1",
                    writeToDom: true
                }));

                return oAddGroupButton;
            },

            _getAfterContent: function () {
                var oAddGroupButton = new Button({
                    icon: "sap-icon://add",
                    text: resources.i18n.getText("add_group_at"),
                    visible: "{= ${isLastGroup} && ${/tileActionModeActive}}",
                    enabled: "{= !${/editTitle}}",
                    press: [this._handleAddGroupButtonPress.bind(this)]
                }).addStyleClass("sapUshellAddGroupButton");
                oAddGroupButton.addStyleClass("sapUshellAddGroupButton");
                oAddGroupButton.addCustomData(new AccessibilityCustomData({
                    key: "tabindex",
                    value: "-1",
                    writeToDom: true
                }));

                return oAddGroupButton;
            },

            _getGroupHeaderAction: function () {
                return new GroupHeaderActions({
                    content: this._getHeaderActions(),
                    tileActionModeActive: "{/tileActionModeActive}",
                    isOverflow: "{/isPhoneWidth}"
                }).addStyleClass("sapUshellOverlayGroupActionPanel");
            },

            _getHeaderActions: function () {
                var aHeaderButtons = [];

                if (Config.last("/core/home/gridContainer")) {
                    var oAddTileButton = new Button({
                        text: resources.i18n.getText("AddTileBtn"),
                        visible: "{= !${isGroupLocked}}",
                        enabled: "{= !${/editTitle}}",
                        press: this._handleAddTileToGroup.bind(this)
                    }).addStyleClass("sapUshellHeaderActionButton");

                    if (Device.system.phone) {
                        oAddTileButton.setIcon("sap-icon://add");
                    }

                    aHeaderButtons.push(oAddTileButton);
                }

                aHeaderButtons.push(new Button({
                    text: {
                        path: "isGroupVisible",
                        formatter: function (bIsGroupVisible) {
                            return resources.i18n.getText(bIsGroupVisible ? "HideGroupBtn" : "ShowGroupBtn");
                        }
                    },
                    icon: {
                        path: "isGroupVisible",
                        formatter: function (bIsGroupVisible) {
                            if (Device.system.phone) {
                                return bIsGroupVisible ? "sap-icon://hide" : "sap-icon://show";
                            }
                            return "";
                        }
                    },
                    visible: "{= ${/enableHideGroups} && !${isGroupLocked} && !${isDefaultGroup}}",
                    enabled: "{= !${/editTitle}}",
                    press: function (oEvent) {
                        var oSource = oEvent.getSource(),
                            oGroupBindingCtx = oSource.getBindingContext();
                        this.oController._changeGroupVisibility(oGroupBindingCtx);
                    }.bind(this)
                }).addStyleClass("sapUshellHeaderActionButton"));

                aHeaderButtons.push(new Button({
                    text: {
                        path: "removable",
                        formatter: function (bIsRemovable) {
                            return resources.i18n.getText(bIsRemovable ? "DeleteGroupBtn" : "ResetGroupBtn");
                        }
                    },
                    icon: {
                        path: "removable",
                        formatter: function (bIsRemovable) {
                            if (Device.system.phone) {
                                return bIsRemovable ? "sap-icon://delete" : "sap-icon://refresh";
                            }
                            return "";
                        }
                    },
                    visible: "{= !${isDefaultGroup}}",
                    enabled: "{= !${/editTitle}}",
                    press: function (oEvent) {
                        var oSource = oEvent.getSource(),
                            oGroupBindingCtx = oSource.getBindingContext();
                        this.oController._handleGroupDeletion(oGroupBindingCtx);
                    }.bind(this)
                }).addStyleClass("sapUshellHeaderActionButton"));

                return aHeaderButtons;
            },

            _handleAddTileToGroup: function (oEvent) {
                //Fix internal incident #1780370222 2017
                if (document.toDetail) {
                    document.toDetail();
                }
                Component.getOwnerComponentFor(this.oController.getView().parentComponent).getRouter().navTo("appfinder", {
                    "innerHash*": "catalog/" + JSON.stringify({
                        targetGroup: encodeURIComponent(oEvent.getSource().getBindingContext().sPath)
                    })
                });
            },

            _hidePlusTile: function (plusTileDomRef) {
                if (plusTileDomRef) {
                    plusTileDomRef.classList.add("sapUshellHidePlusTile");
                }
            },

            _showPlusTile: function (plusTileDomRef) {
                if (plusTileDomRef) {
                    plusTileDomRef.classList.remove("sapUshellHidePlusTile");
                }
            }
        });

        return DashboardGroupsBox;
    });
},
	"sap/ushell/components/homepage/DashboardUIActions.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview A module that is responsible for initializing the dashboard UIActions (i.e. drag and drop) of groups and tiles.<br>
 * Extends <code>sap.ui.base.Object</code><br>
 * Exposes the public function <code>initializeUIActions</code>
 *
 * @version 1.74.0
 * @name sap.ushell.components.homepage.DashboardUIActions
 * @since 1.35.0
 * @private
 */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ushell/Layout",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log"
], function (
    baseObject,
    Layout,
    Device,
    jQuery,
    Log
) {
    "use strict";

    var DashboardUIActions = baseObject.extend("sap.ushell.components.homepage.DashboardUIActions", {
        metadata: {
            publicMethods: ["initializeUIActions"]
        },

        constructor: function (/*sId, mSettings*/) {
            this.aTabBarItemsLocation = [];

            // Make this class only available once
            if (sap.ushell.components.homepage.getDashboardUIActions && sap.ushell.components.homepage.getDashboardUIActions()) {
                return sap.ushell.components.homepage.getDashboardUIActions();
            }
            sap.ushell.components.homepage.getDashboardUIActions = (function (value) {
                return function () {
                    return value;
                };
            }(this.getInterface()));

            this.oTileUIActions = undefined;
            this.oLinkUIActions = undefined;
            this.oGroupUIActions = undefined;
            this.oController = undefined;
            this.UIActionsInitialized = false;

            // Enabling and disabling drag and drop of groups (groupsUIAction) depends of activation and activation of ActionMode
            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeActive", this._enableGroupUIActions, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeInactive", this._disableGroupUIActions, this);
        },

        destroy: function () {
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeActive", this._enableGroupUIActions, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeInactive", this._disableGroupUIActions, this);
            sap.ushell.components.homepage.getDashboardUIActions = undefined;
            this.oGroupUIActions = null;
            this.oTileUIActions = null;
            this.oLinkUIActions = null;
        },

        /**
         * Creating UIAction objects for tiles and groups in order to allow dashboard drag and drop actions
         *
         * @param {object} The DashboardContent.controller instance
         *
         * @since 1.35
         *
         * @private
         */
        initializeUIActions: function (oController) {
            this.oController = oController;
            // If TabBar mode active - calculate TabBar items position
            if (oController.getView().getModel().getProperty("/homePageGroupDisplay") === "tabs") {
                this._fillTabBarItemsArray();
            }

            var isLinkPersonalizationSupported = sap.ushell.Container ? sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported() : null;
            var iPageWidth = jQuery("#sapUshellDashboardPage").width();

            var sDashboardGroupsWrapperId = oController.getView().sDashboardGroupsWrapperId,
                bActionModeActive,
                bRightToLeft = sap.ui.getCore().getConfiguration().getRTL(),

                // Object that contains the common attributed required of the creation of oTileUIActions and oGroupUIActions in Win8 use-case
                oCommonUIActionsDataForWin8 = {
                    containerSelector: "#dashboardGroups",
                    wrapperSelector: sDashboardGroupsWrapperId ? "#" + sDashboardGroupsWrapperId : undefined, // The id of the <section> that wraps dashboardGroups div: #__page0-cont
                    rootSelector: "#shell"
                },
                // Object that contains the common attributed required of the creation of oTileUIActions and oGroupUIActions, including Win8 attributes
                oCommonUIActionsData = jQuery.extend(true, {}, oCommonUIActionsDataForWin8, {
                    switchModeDelay: 1000,
                    isTouch: oController.getView().isTouch,
                    isCombi: oController.getView().isCombi,
                    debug: false
                }),
                oLinkUIActionsData = {
                    draggableSelector: ".sapUshellLinkTile",
                    placeHolderClass: "sapUshellLinkTile-placeholder",
                    cloneClass: "sapUshellLinkTile-clone",
                    startCallback: this._handleTileUIStart.bind(this),
                    endCallback: this._handleLinkDrop.bind(this),
                    dragCallback: this._handleStartDragTile.bind(this),
                    onBeforeCreateClone: this._onBeforeCreateLinkClone.bind(this),
                    dragAndScrollCallback: this._handleTileDragMove.bind(this),
                    endDragAndScrollCallback: this._handleTileDragAndScrollContinuation.bind(this),
                    moveTolerance: oController.getView().isTouch || oController.getView().isCombi ? 10 : 3,
                    isLayoutEngine: true,
                    disabledDraggableSelector: "sapUshellLockedTile", //check licked links
                    onDragStartUIHandler: this._markDisableGroups.bind(this),
                    onDragEndUIHandler: this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? iPageWidth : -iPageWidth,
                    defaultMouseMoveHandler: function () { }
                },
                oTileUIActionsData = {
                    draggableSelector: ".sapUshellTile",
                    draggableSelectorExclude: ".sapUshellPlusTile",
                    placeHolderClass: "sapUshellTile-placeholder",
                    cloneClass: "sapUshellTile-clone",
                    deltaTop: -44,
                    scrollContainerSelector: undefined, // @TODO remove this
                    startCallback: this._handleTileUIStart.bind(this),
                    endCallback: this._handleTileDrop.bind(this),
                    dragCallback: this._handleStartDragTile.bind(this),
                    dragAndScrollCallback: this._handleTileDragMove.bind(this),
                    endDragAndScrollCallback: this._handleTileDragAndScrollContinuation.bind(this),
                    moveTolerance: oController.getView().isTouch || oController.getView().isCombi ? 10 : 3,
                    isLayoutEngine: true,
                    disabledDraggableSelector: "sapUshellLockedTile",
                    onDragStartUIHandler: this._markDisableGroups.bind(this),
                    onDragEndUIHandler: this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? iPageWidth : -iPageWidth,
                    defaultMouseMoveHandler: function () { }
                },
                oGroupUIActionsData = {
                    draggableSelector: ".sapUshellDashboardGroupsContainerItem:not(.sapUshellDisableDragAndDrop)",
                    draggableSelectorBlocker: ".sapUshellTilesContainer-sortable, .sapUshellTileContainerBeforeContent, .sapUshellTileContainerAfterContent",
                    draggableSelectorExclude: ".sapUshellHeaderActionButton",
                    placeHolderClass: "sapUshellDashboardGroupsContainerItem-placeholder",
                    cloneClass: "sapUshellDashboardGroupsContainerItem-clone",
                    startCallback: this._handleGroupsUIStart.bind(this),
                    endCallback: this._handleGroupDrop.bind(this),
                    dragCallback: this._handleGroupStartDrag.bind(this),
                    moveTolerance: oController.getView().isTouch || oController.getView().isCombi ? 10 : 0.1,
                    isLayoutEngine: false,
                    isVerticalDragOnly: true,
                    draggableElement: ".sapUshellTileContainerHeader"
                },
                oWin8TileUIActionsData = {
                    type: "tiles",
                    draggableSelector: ".sapUshellTile",
                    placeHolderClass: "sapUshellTile-placeholder",
                    cloneClass: "sapUshellTile-clone",
                    startCallback: this._handleTileUIStart.bind(this),
                    endCallback: this._handleTileDrop.bind(this),
                    dragCallback: this._handleStartDragTile.bind(this),
                    dragAndScrollCallback: this._handleTileDragMove.bind(this),
                    onDragStartUIHandler: this._markDisableGroups.bind(this),
                    onDragEndUIHandler: this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? iPageWidth : -iPageWidth
                },
                oWin8LinkUIActionsData = {
                    type: "links",
                    draggableSelector: ".sapUshellLinkTile",
                    placeHolderClass: "sapUshellLinkTile-placeholder",
                    startCallback: this._handleTileUIStart.bind(this),
                    endCallback: this._handleLinkDrop.bind(this),
                    dragCallback: this._handleStartDragTile.bind(this),
                    dragAndScrollCallback: this._handleTileDragMove.bind(this),
                    onBeforeCreateClone: this._onBeforeCreateLinkClone.bind(this),
                    onDragStartUIHandler: this._markDisableGroups.bind(this),
                    onDragEndUIHandler: this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? iPageWidth : -iPageWidth
                },
                oWin8GroupUIActionsData = {
                    type: "groups",
                    draggableSelector: ".sapUshellTileContainerHeader",
                    placeHolderClass: "sapUshellDashboardGroupsContainerItem-placeholder",
                    _publishAsync: oController._publishAsync
                };

            // Creating the sap.ushell.UIActions objects for tiles and groups
            if (oController.getView().oDashboardGroupsBox.getGroups().length) {
                if (oController.getView().getModel().getProperty("/personalization")) {
                    if (!oController.getView().ieHtml5DnD) {
                        sap.ui.require(["sap/ushell/UIActions"], function (UIActions) {
                            // Disable the previous instances of UIActions
                            this._disableTileUIActions();
                            this._disableGroupUIActions();
                            this._disableLinkUIActions();

                            // Create and enable tiles UIActions
                            this.oTileUIActions = new UIActions(jQuery.extend(true, {}, oCommonUIActionsData, oTileUIActionsData)).enable();
                            // Create groups UIActions, enabling happens according to ActionMode
                            this.oGroupUIActions = new UIActions(jQuery.extend(true, {}, oCommonUIActionsData, oGroupUIActionsData));

                            if (isLinkPersonalizationSupported) {
                                this.oLinkUIActions = new UIActions(jQuery.extend(true, {}, oCommonUIActionsData, oLinkUIActionsData)).enable();
                            }

                            bActionModeActive = oController.getView().getModel().getProperty("/tileActionModeActive");
                            if (bActionModeActive) {
                                this.oGroupUIActions.enable();
                            }
                        }.bind(this));
                    } else {
                        sap.ui.require(["sap/ushell/UIActionsWin8"], function (UIActionsWin8) {
                            this._disableTileUIActions();
                            this._disableGroupUIActions();
                            this._disableLinkUIActions();
                            // Create and enable tiles and groups UIActions
                            this.oTileUIActions = UIActionsWin8.getInstance(jQuery.extend(true, {}, oCommonUIActionsDataForWin8, oWin8TileUIActionsData)).enable();
                            this.oLinkUIActions = UIActionsWin8.getInstance(jQuery.extend(true, {}, oCommonUIActionsDataForWin8, oWin8LinkUIActionsData)).enable();
                            this.oGroupUIActions = UIActionsWin8.getInstance(jQuery.extend(true, {}, oCommonUIActionsDataForWin8, oWin8GroupUIActionsData)).enable();
                        }.bind(this));
                    }
                }
            }
        },

        _enableGroupUIActions: function () {
            if (this.oGroupUIActions) {
                this.oGroupUIActions.enable();
            }
        },

        disableAllDashboardUiAction: function () {
            this._disableTileUIActions();
            this._disableLinkUIActions();
            this._disableGroupUIActions();

        },

        _disableTileUIActions: function () {
            if (this.oTileUIActions) {
                this.oTileUIActions.disable();
            }
        },

        _disableLinkUIActions: function () {
            if (this.oLinkUIActions) {
                this.oLinkUIActions.disable();
            }
        },

        _disableGroupUIActions: function () {
            if (this.oGroupUIActions) {
                this.oGroupUIActions.disable();
            }
        },

        // ****************************************************************************************
        // *************************** Tile UIActions functions - Begin ***************************

        _handleTileDragMove: function (cfg) {
            if (!cfg.isScrolling) {
                Layout.getLayoutEngine().moveDraggable(cfg.moveX, cfg.moveY, this.aTabBarItemsLocation);
            }
        },

        _handleTileDragAndScrollContinuation: function (moveY) {
            var oAnchorBarOffset = jQuery("#anchorNavigationBar").offset(),
                iAnchorBarOffsetTop = oAnchorBarOffset.top;

            if (moveY < iAnchorBarOffsetTop) {
                Layout.getLayoutEngine()._cancelLongDropTimmer();
            }
            return Layout.getLayoutEngine()._isTabBarCollision(moveY);
        },

        _fillTabBarItemsArray: function () {
            var aItems = jQuery(".sapUshellAnchorItem"),
                iLength = aItems.length,
                index,
                iBasicWidthUnit = 10,
                iTempIndex = 0,
                iTempIndex_,
                aTabBarItemsBasic = [],
                oItem,
                oItemMeasures,
                oItemWidth,
                iNumOfBasicUnits;

            for (index = 0; index < iLength; index++) {
                oItem = aItems[index];
                oItemMeasures = oItem.getBoundingClientRect();

                aTabBarItemsBasic[index] = oItemMeasures.width;
            }
            for (index = 0; index < iLength; index++) {
                oItemWidth = aTabBarItemsBasic[index];
                if (oItemWidth === 0) {
                    continue;
                }
                iNumOfBasicUnits = Math.round(oItemWidth / iBasicWidthUnit);
                for (iTempIndex_ = iTempIndex; iTempIndex_ < iTempIndex + iNumOfBasicUnits; iTempIndex_++) {
                    this.aTabBarItemsLocation[iTempIndex_] = index;
                }
                iTempIndex = iTempIndex_;
            }
        },

        _handleTileUIStart: function (evt, ui) {
            if ((Device.browser.msie) &&
                ((navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0))) {
                //Remove title so tooltip will not be displayed while dragging tile (IE10 and above)
                this.titleElement = ui.querySelector("[title]");
                if (this.titleElement) {
                    //it solves issue with IE and android, when browsers automatically show tooltip
                    this.titleElement.setAttribute("data-title", this.titleElement.getAttribute("title"));
                    this.titleElement.removeAttribute("title");
                }
            }
        },

        _changeTileDragAndDropAnimate: function (evt, ui) {
            var dashboardPageScrollTop = this.dragNDropData.jqDashboard.scrollTop(),
                jqTile,
                tile,
                currentTilePosition,
                currentTileOffset,
                tileLeftOffset,
                iTileTopOffset,
                i,
                oClonedTile;

            for (i = 0; i < this.dragNDropData.jqDraggableElements.length; i++) {
                jqTile = this.dragNDropData.jqDraggableElements.eq(i);
                tile = jqTile[0];
                //Get the original tile and its clone
                currentTilePosition = jqTile.position();
                currentTileOffset = jqTile.offset();
                if ((currentTileOffset.left === tile.offset.left) && (currentTileOffset.top === tile.offset.top)) {
                    continue;
                }
                tile.position = currentTilePosition;
                tile.offset = currentTileOffset;
                oClonedTile = jqTile.data("clone");
                if (!oClonedTile) {
                    continue;
                }

                //Get the invisible tile that has snapped to the new
                //location, get its position, and animate the visible
                //clone to it
                tileLeftOffset = tile.position.left + this.dragNDropData.containerLeftMargin;
                iTileTopOffset = this._getTileTopOffset(jqTile, tile.position, dashboardPageScrollTop);

                //Stop currently running animations
                //Without this, animations would queue up
                oClonedTile.stop(true, false).animate({ left: tileLeftOffset, top: iTileTopOffset }, { duration: 250 }, { easing: "swing" });
            }
        },

        _preventTextSelection: function () {
            //Prevent selection of text on tiles and groups
            if (window.getSelection) {
                var selection = window.getSelection();
                // fix IE9 issue (CSS 1580181391)
                try {
                    selection.removeAllRanges();
                } catch (e) {
                    // continue regardless of error
                }
            }
        },

        /**
         *
         * @param ui : tile DOM reference
         * @private
         */
        _handleStartDragTile: function (evt, tileElement) {
            this._preventTextSelection();

            Layout.getLayoutEngine().layoutStartCallback(tileElement);
            //Prevent the tile to be launched after drop
            jQuery(tileElement).find("a").removeAttr("href");
            this.oController._handleDrag.call(this.oController, evt, tileElement);
            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStart");
        },

        _onBeforeCreateLinkClone: function (evt, LinkElement) {
            //we need to save the link bounding rects before uiactions.js create a clone because after it oLink.getBoundingRects will return zero offsets
            Layout.getLayoutEngine().saveLinkBoundingRects(LinkElement);
        },

        _handleLinkDrop: function (evt, tileElement, oAdditionalParams) {
            var deferred = jQuery.Deferred(),
                oPromise;

            if (Layout.isTabBarActive()) {
                Layout.tabBarTileDropped();
            }
            if ((Device.browser.msie) &&
                ((navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0)) && this.titleElement) {
                //it solves issue with IE and android, when browsers automatically show tooltip
                this.titleElement.setAttribute("title", this.titleElement.getAttribute("data-title"));//check if we need this
            }
            if (Device.desktop) {
                jQuery("body").removeClass("sapUshellDisableUserSelect");//check if we need this
            }
            if (Layout.getLayoutEngine().isLinkIntersected() || Layout.getLayoutEngine().isOriginalAreaChanged()) {
                oPromise = this.oController._handleDrop.call(this.oController, evt, tileElement);
            }

            if (oPromise) {
                oPromise.then(function () {
                    jQuery("#dashboardGroups .sapUshellHidePlusTile").removeClass("sapUshellHidePlusTile");
                    setTimeout(function () {
                        deferred.resolve();
                    }, 300);
                });
            } else {
                setTimeout(function () {
                    deferred.resolve();
                }, 0);
            }

            return deferred.promise();
        },

        /**
         *
         * @param ui : tile DOM reference
         * @private
         */
        _handleTileDrop: function (evt, tileElement, oAdditionalParams) {
            if (Layout.getLayoutEngine().isOriginalAreaChanged()) {
                return this._handleTileToLinkDrop(evt, tileElement, oAdditionalParams);
            }
            return this._handleTileToTileDrop(evt, tileElement, oAdditionalParams);
        },

        _handleTileToLinkDrop: function (evt, tileElement, oAdditionalParams) {
            return this._handleLinkDrop(evt, tileElement, oAdditionalParams);
        },

        _handleTileToTileDrop: function (evt, tileElement, oAdditionalParams) {
            var jqClone,
                oHoveredTabBarItem,
                oTabBarDraggedTile,
                handleTileDropInternal = function (evt, tileElement) {
                    jQuery("#dashboardGroups .sapUshellHidePlusTile").removeClass("sapUshellHidePlusTile");
                    if ((Device.browser.msie) &&
                        ((navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0)) && this.titleElement) {
                        //it solves issue with IE and android, when browsers automatically show tooltip
                        this.titleElement.setAttribute("title", this.titleElement.getAttribute("data-title"));
                    }
                    this.oController._handleDrop.call(this.oController, evt, tileElement);
                    if (Device.desktop) {
                        jQuery("body").removeClass("sapUshellDisableUserSelect");
                    }
                };

            oHoveredTabBarItem = jQuery(".sapUshellTabBarHoverOn");
            oHoveredTabBarItem.removeClass("sapUshellTabBarHoverOn");

            oTabBarDraggedTile = jQuery(".sapUshellTileDragOpacity");
            oTabBarDraggedTile.removeClass("sapUshellTileDragOpacity");

            if (Layout.isTabBarActive()) {
                Layout.tabBarTileDropped();
            }

            // In tab bar mode, when the tile is dropped on an anchor tab bar item.
            // In this case the tile should not flow back to the source group
            if (Layout.isTabBarActive() && Layout.isOnTabBarElement()) {
                if (oAdditionalParams && oAdditionalParams.clone) {
                    var oDeferred = jQuery.Deferred();
                    jqClone = jQuery(oAdditionalParams.clone);
                    jqClone.css("display", "none");
                    setTimeout(function () {
                        oDeferred.resolve();
                        handleTileDropInternal.call(this, evt, tileElement);
                    }.bind(this), 300);
                    return oDeferred.promise();
                }
                handleTileDropInternal.apply(this, arguments);
            }

            handleTileDropInternal.apply(this, arguments);
        },

        _getTileTopOffset: function (oTile, position, dashboardScrollTop) {
            var i = 0,
                iTileTopOffset = i + dashboardScrollTop;

            iTileTopOffset += oTile.closest(".sapUshellDashboardGroupsContainerItem").position().top;
            iTileTopOffset += position.top;
            return iTileTopOffset;
        },

        //During drag action, locked groups should be mark with a locked icon and group opacity should be changed to grayish
        _markDisableGroups: function () {
            if (this.oController.getView().getModel()) {
                this.oController.getView().getModel().setProperty("/isInDrag", true);
            }
        },

        //once d&d ends, restore locked groups appearance and remove locked icons and grayscale
        _endUIHandler: function () {
            if (this.oController.getView().getModel()) {
                this.oController.getView().getModel().setProperty("/isInDrag", false);
            }
        },

        // **************************** Tile UIActions functions - End ****************************
        // ****************************************************************************************
        // *************************** Group UIActions functions - Begin **************************

        _handleGroupStartDrag: function (evt, ui) {
            this.oTileUIActions.disable();
            if (this.oLinkUIActions) {
                this.oLinkUIActions.disable();
            }
            var groupContainerClone = jQuery(".sapUshellDashboardGroupsContainerItem-clone"),
                groupContainerCloneTitle = groupContainerClone.find(".sapUshellContainerTitle"),
                titleHeight = groupContainerCloneTitle.height(),
                titleWidth = groupContainerCloneTitle.width(),
                groupsTop,
                groupPlaceholder,
                groupClone,
                scrollY,
                bRightToLeft = sap.ui.getCore().getConfiguration().getRTL();

            if (!Device.system.phone) {
                groupContainerClone.find(".sapUshellTileContainerEditMode").offset({
                    top: this.oGroupUIActions.getMove().y - titleHeight,
                    left: bRightToLeft ? jQuery("#sapUshellDashboardPage").width() + this.oGroupUIActions.getMove().x + titleWidth :
                        this.oGroupUIActions.getMove().x - (titleWidth / 2)
                });
                jQuery(".sapUshellTileContainerBeforeContent").addClass("sapUshellTileContainerHidden");
            } else {
                jQuery(".sapUshellTilesContainer-sortable").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellLineModeContainer, .sapUshellLinksContainer").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTileContainerBeforeContent").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellContainerHeaderActions").addClass("sapUshellTileContainerHidden");
            }
            jQuery(".sapUshellTileContainerAfterContent").addClass("sapUshellTileContainerRemoveContent");
            jQuery(ui).find(".sapUshellContainerHeaderActions").addClass("sapUshellTileContainerHidden");

            this.oController.getView().getModel().setProperty("/isInDrag", true);
            jQuery(ui).attr("startPos", jQuery(ui).index());

            Log.info("startPos - " + jQuery(ui).index());
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "sortableStart");
            }, 0);

            //scroll to group
            groupsTop = jQuery("#dashboardGroups").offset().top;
            groupPlaceholder = jQuery(".sapUshellDashboardGroupsContainerItem-placeholder").offset().top;
            groupClone = jQuery(".sapUshellDashboardGroupsContainerItem-clone").offset().top;
            scrollY = groupPlaceholder - groupsTop - groupClone;
            jQuery(".sapUshellDashboardView section").animate({ scrollTop: scrollY }, 0);
        },

        _handleGroupsUIStart: function (evt, ui) {
            jQuery(ui).find(".sapUshellTileContainerContent").css("outline-color", "transparent");
        },

        _handleGroupDrop: function (evt, ui) {
            var oBus = sap.ui.getCore().getEventBus(),
                jQueryObj = jQuery(ui),
                firstChildId = jQuery(jQueryObj.children()[0]).attr("id"),
                oGroup = sap.ui.getCore().byId(firstChildId),
                oDashboardGroups = sap.ui.getCore().byId("dashboardGroups"),
                oData = { group: oGroup, groupChanged: false, focus: false },
                nNewIndex = jQueryObj.index();

            jQueryObj.startPos = window.parseInt(jQueryObj.attr("startPos"), 10);
            oDashboardGroups.removeAggregation("groups", oGroup, true);
            oDashboardGroups.insertAggregation("groups", oGroup, nNewIndex, true);

            this._handleGroupMoved(evt, { item: jQueryObj });
            jQueryObj.removeAttr("startPos");
            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStop");

            // avoid tile to be clicked after group was dropped
            setTimeout(function () {
                jQuery(".sapUshellContainerHeaderActions").removeClass("sapUshellTileContainerHidden");
                jQuery(".sapUshellTileContainerBeforeContent").removeClass("sapUshellTileContainerHidden");
                jQuery(".sapUshellTileContainerBeforeContent").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTileContainerAfterContent").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTilesContainer-sortable").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellLineModeContainer, .sapUshellLinksContainer").removeClass("sapUshellTileContainerRemoveContent");
            }, 0);

            window.setTimeout(jQuery.proxy(oBus.publish, oBus, "launchpad", "scrollToGroup", oData), 1);
            this.oTileUIActions.enable();
            if (this.oLinkUIActions) {
                this.oLinkUIActions.enable();
            }
        },

        _handleGroupMoved: function (evt, ui) {
            var fromIndex = ui.item.startPos,
                toIndex = ui.item.index(),
                oModel = this.oController.getView().getModel();

            if (toIndex !== -1) {
                this.oController._publishAsync("launchpad", "moveGroup", {
                    fromIndex: fromIndex,
                    toIndex: toIndex
                });
                setTimeout(function () {
                    oModel.setProperty("/isInDrag", false);
                }, 100);
            }
        },

        // **************************** Group UIActions functions - End ****************************
        // *****************************************************************************************

        _setController: function (oController) {
            this.oController = oController;
        }
    });

    return DashboardUIActions;
});
},
	"sap/ushell/components/homepage/FLPAnalytics.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/services/AppConfiguration", // TODO: pending dependency migration
    "sap/base/Log",
    "sap/ui/thirdparty/jquery"
], function (AppConfiguration, Log, jQuery) {
    "use strict";

    /* global hasher */

    /**
     * Manage UsageAnalytics event logging as a result of FLP user flows
     */

    // Launchpad action events that trigger logging
    var aObservedLaunchpadActions = ["deleteTile", "actionModeActive", "catalogTileClick", "dashboardTileClick", "dashboardTileLinkClick"],
        oEventBus = sap.ui.getCore().getEventBus(),
        that = this,
        oLaunchedApplications = {};

    /**
     * Updates oLaunchedApplications with the title and opening time of the given application
     */
    function saveOpenAppicationData (applicationId) {
        var oMetadataOfTarget = sap.ushell.services.AppConfiguration.getMetadata(); // TODO: pending dependency migration
        oLaunchedApplications[applicationId] = {};
        oLaunchedApplications[applicationId].startTime = new Date();
        oLaunchedApplications[applicationId].title = oMetadataOfTarget.title;
    }

    /**
     * Logs a "Time in App" event according to the given application ID
     *
     * Calculates the time according to the current (closing) time
     *  and the opening time that is kept on oLaunchedApplications[applicationId]
     */
    function logTimeInAppEvent (applicationId) {
        var appDuration = 0;

        try {
            appDuration = (new Date() - oLaunchedApplications[applicationId].startTime) / 1000;
            sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Time in Application (sec)", appDuration, [oLaunchedApplications[applicationId].title]);
        } catch (e) {
            Log.warning("Duration in application " + applicationId + " could not be calculated", null, "sap.ushell.components.homepage.FLPAnalytics");
        }
    }

    /**
     * Handler for published usageAnalytics events.
     */
    function handleAction (sChannelId, sEventId, oData) {
        var sApplicationId = hasher.getHash(),
            sApplicationTitle;

        window.swa.custom1 = { ref: sApplicationId };
        switch (sEventId) {
            case "appOpened":
                // In order to be notified when applications are launched - we rely on navContainer's attachAfterNavigate event.
                // but for the first navigation (e.g. login or direct URL in a new tab) we still need the "appOpened" event.
                saveOpenAppicationData(sApplicationId);
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Opened", "Direct Launch", [oLaunchedApplications[sApplicationId].title]);
                oEventBus.unsubscribe("sap.ushell", "appOpened", handleAction);
                break;
            case "bookmarkTileAdded":
                sApplicationTitle = window.document.title;
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Personalization", "Save as Tile", [
                    sApplicationTitle,
                    oData && oData.group && oData.group.title ? oData.group.title : "",
                    oData && oData.group && oData.group.id ? oData.group.id : "",
                    oData && oData.tile && oData.tile.title ? oData.tile.title : sApplicationTitle
                ]);
                break;
            case "actionModeActive":
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Personalization", "Enter Action Mode", [oData.source]);
                break;
            case "catalogTileClick":
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point", "Catalog", []);
                break;
            case "dashboardTileClick":
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point", "Homepage", []);
                break;
            case "dashboardTileLinkClick":
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point", "Tile Group Link", []);
                break;
            default:
                break;
        }
    }

    /**
     * Handler of navContainer's AfterNavigate event (i.e. navigation between the container's pages)
     *
     * - Logs "TimeInAppEvent" for the source application (i.e. from which the navigation occurred)
     * - Updated data about the opened application
     * - Logs "Application Opened" event
     */
    function handleAfterNavigate (oEvent) {
        var sFromApplicationId,
            sToApplicationId,
            oTargetApplication;

        // For the source application (the one from which the user navigates) -
        // Calculate the time duration and log a "Time in Application" event
        if (oEvent.getParameter("from") && oEvent.getParameter("to")) {
            sFromApplicationId = oEvent.getParameter("from").getId().replace("application-", "").replace("applicationShellPage-", "");
            window.swa.custom1 = { ref: sFromApplicationId };
            logTimeInAppEvent(sFromApplicationId);
            // For the target application (the one to which the user navigates) -
            // Keep the opening time and title, and log an "Application Opened" event
            oTargetApplication = oEvent.getParameter("to");
            sToApplicationId = oTargetApplication.getId().replace("application-", "").replace("applicationShellPage-", "");
            saveOpenAppicationData(sToApplicationId);
            window.swa.custom1 = { ref: sToApplicationId };
            sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Opened", "Fiori Navigation", [oLaunchedApplications[sToApplicationId].title]);
        }
    }

    /**
     * Handler of browser tab close event
     *
     * Logs a "Time in App" event
     */
    jQuery(window).on("unload", function (event) {
        var currentApp = window.location.hash.substr(1);
        logTimeInAppEvent(currentApp);
    });

    try {
        sap.ui.getCore().byId("viewPortContainer").attachAfterNavigate(handleAfterNavigate, that);
    } catch (e) {
        Log.warning("Failure when subscribing to viewPortContainer 'AfterNavigate' event", null, "sap.ushell.components.homepage.FLPAnalytics");
    }
    oEventBus.subscribe("sap.ushell.services.Bookmark", "bookmarkTileAdded", handleAction, that);
    aObservedLaunchpadActions.forEach(function (item) {
        oEventBus.subscribe("launchpad", item, handleAction, that);
    });
    oEventBus.subscribe("sap.ushell", "appOpened", handleAction, that);
}, /* bExport= */ false);
},
	"sap/ushell/components/homepage/manifest.json":'{\n    "_version": "1.12.0",\n    "sap.app": {\n        "id": "sap.ushell.components.homepage",\n        "applicationVersion": {\n            "version": "1.74.0"\n        },\n        "i18n": "../../renderers/fiori2/resources/resources.properties",\n        "ach": "CA-FLP-FE-COR",\n        "type": "component",\n        "title": "{{Component.Homepage.Title}}"\n    },\n    "sap.ui": {\n        "fullWidth": true,\n        "hideLightBackground": true,\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "dependencies": {\n            "minUI5Version": "1.30",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    }\n}\n'
},"Component-preload"
);
