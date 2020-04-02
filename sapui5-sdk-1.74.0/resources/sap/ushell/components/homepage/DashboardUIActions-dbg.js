// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
