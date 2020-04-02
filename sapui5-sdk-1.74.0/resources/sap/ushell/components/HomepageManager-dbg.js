// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/base/Object",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ushell/ui/launchpad/TileState",
    "sap/ushell/components/_HomepageManager/PagingManager",
    "sap/ushell/components/_HomepageManager/DashboardLoadingManager",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ushell/utils",
    "sap/ushell/resources",
    "sap/ushell/components/DestroyHelper",
    "sap/ushell/components/GroupsHelper",
    "sap/ushell/components/MessagingHelper",
    "sap/m/GenericTile",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter",
    "sap/ushell/components/_HomepageManager/TransientPageOperationAdapter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/ui/model/Context",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/ui/performance/Measurement"
], function (
    jQuery,
    BaseObject,
    Device,
    Filter,
    TileState,
    PagingManager,
    DashboardLoadingManager,
    oEventHub,
    oShellConfig,
    oUtils,
    oResources,
    oDestroyHelper,
    oGroupsHelper,
    oMessagingHelper,
    GenericTile,
    SelectDialog,
    StandardListItem,
    PersistentPageOperationAdapter,
    TransientPageOperationAdapter,
    FilterOperator,
    mobileLibrary,
    Context,
    MessageToast,
    Log,
    Measurement
) {
    "use strict";

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;

    var analyticsConstants = {
        PERSONALIZATION: "FLP: Personalization",
        RENAME_GROUP: "FLP: Rename Group",
        MOVE_GROUP: "FLP: Move Group",
        DELETE_GROUP: "FLP: Delete Group",
        RESET_GROUP: "FLP: Reset Group",
        DELETE_TILE: "FLP: Delete Tile",
        ADD_TILE: "FLP: Add Tile",
        MOVE_TILE: "FLP: Move Tile"
    };

    var _aRequestQueue = [];
    var _bRequestRunning = false;

    function _addRequest (fRequest) {
        _aRequestQueue.push(fRequest);
        if (!_bRequestRunning) {
            _bRequestRunning = true;
            _aRequestQueue.shift()();
        }
    }

    function _checkRequestQueue () {
        if (_aRequestQueue.length === 0) {
            _bRequestRunning = false;
        } else {
            _aRequestQueue.shift()();
        }
    }

    function _requestFailed () {
        _aRequestQueue = [];
        _bRequestRunning = false;
    }

    var aDoables = [];

    return BaseObject.extend("sap.ushell.components.HomepageManager", {
        metadata: {
            publicMethods: [
                "getModel",
                "getDashboardView",
                "loadPersonalizedGroups",
                "resetGroupsOnFailure",
                "addGroupToModel",
                "addTileToGroup",
                "deleteTilesFromGroup"
            ]
        },
        analyticsConstants: analyticsConstants, // for usage in qUnits

        constructor: function (sId, mSettings) {
            //make this class only available once
            if (sap.ushell.components.getHomepageManager) {
                var oHomepageManager = sap.ushell.components.getHomepageManager();
                if (!oHomepageManager.view) {
                    oHomepageManager.setDashboardView(mSettings.view);
                }
                return oHomepageManager;
            }

            // when the core theme changes, it's required to calculate again, which tiles are visible. In case of
            // dynamic tiles, a request should be triggered. In some cases it can happen, that the tile visibility
            // is calculated before the initial theme is applied. Also these cases are covered, when we react to
            // the theme changed event.
            sap.ui.getCore().attachThemeChanged(oUtils.handleTilesVisibility);

            sap.ushell.components.getHomepageManager = (function (value) {
                return function () {
                    return value;
                };
            }(this));
            this.oPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
            this.oPageBuilderService = sap.ushell.Container.getService("LaunchPage");
            this.oModel = mSettings.model;
            this.oRouter = mSettings.router;
            this.oDashboardView = mSettings.view;
            this.oSortableDeferred = new jQuery.Deferred();
            this.oSortableDeferred.resolve();
            this.registerEvents();
            this.tileViewUpdateQueue = [];
            this.tileViewUpdateTimeoutID = 0;
            this.tileUuid = null;
            this.bIsGroupsModelLoading = false;
            this.segmentsStore = [];
            this.bIsFirstSegment = true;
            this.bIsFirstSegmentViewLoaded = false;
            this.aGroupsFrame = null;
            this.iMinNumOfTilesForBlindLoading = this.oModel.getProperty("/optimizeTileLoadingThreshold") || 100;
            this.bIsScrollModeAccordingKPI = false;
            this.oGroupNotLockedFilter = new Filter("isGroupLocked", FilterOperator.EQ, false);
            this.bLinkPersonalizationSupported = this.oPageOperationAdapter.isLinkPersonalizationSupported();
            this.oDashboardLoadingManager = new DashboardLoadingManager("loadingManager", {
                oDashboardManager: this
            });
            //get 'home' view from the router
            if (this.oRouter) {
                var oTarget = this.oRouter.getTarget("home");
                oTarget.attachDisplay(function (oEvent) {
                    this.oDashboardView = oEvent.getParameter("view");
                }.bind(this));
            }
            // Workaround:
            // Event hub emits event when we register. It emits value 'false' and without the workaround it would trigger
            // loading of the content again. So we keep the value when we register.

            var bEnableTransientMode = oShellConfig.last("/core/home/enableTransientMode");
            aDoables.push(oShellConfig.on("/core/home/enableTransientMode").do(
                function (bNewEnableTransientMode) {
                    if (bEnableTransientMode === bNewEnableTransientMode) {
                        return;
                    }
                    bEnableTransientMode = bNewEnableTransientMode;
                    this._changeMode(bNewEnableTransientMode);
                }.bind(this)
            ));

            this.oModel.bindProperty("/tileActionModeActive").attachChange(this._changeLinksScope.bind(this));
            return undefined;
        },

        isBlindLoading: function () {
            var homePageGroupDisplay = oShellConfig.last("/core/home/homePageGroupDisplay");
            if ((homePageGroupDisplay === undefined || homePageGroupDisplay === "scroll") && this.bIsScrollModeAccordingKPI) {
                Log.info("isBlindLoading reason IsScrollModeAccordingKPI and IsScrollMode: true");
                return true;
            }
            if (this.oModel.getProperty("/tileActionModeActive")) {
                Log.info("isBlindLoading reason TileActionModeActive : true");
                return true;
            }
            return false;
        },

        createMoveActionDialog: function (sId) {
            var oGroupFilter = this.oGroupNotLockedFilter,
                oMoveDialog = new SelectDialog(sId, {
                    title: oResources.i18n.getText("moveTileDialog_title"),
                    rememberSelections: false,
                    search: function (oEvent) {
                        var sValue = oEvent.getParameter("value"),
                            oFilter = new Filter("title", FilterOperator.Contains, sValue),
                            oBinding = oEvent.getSource().getBinding("items");
                        oBinding.filter([oFilter, oGroupFilter]);
                    },
                    contentWidth: "400px",
                    contentHeight: "auto",
                    confirm: function (oEvent) {
                        var aContexts = oEvent.getParameter("selectedContexts");
                        this.publishMoveActionEvents(aContexts, sId);
                    }.bind(this),
                    cancel: function () {
                        var oCurrentlyFocusedTile = jQuery(".sapUshellTile[tabindex=\"0\"]")[0];
                        if (oCurrentlyFocusedTile) {
                            oCurrentlyFocusedTile.focus();
                        }
                    },
                    items: {
                        path: "/groups",
                        filters: [oGroupFilter],
                        template: new StandardListItem({
                            title: "{title}"
                        })
                    }
                });
            return oMoveDialog;
        },

        publishMoveActionEvents: function (aContexts, sSource) {
            var oEventBus = sap.ui.getCore().getEventBus();
            if (aContexts.length) {
                var stileType = this.tileType === "link" ? "links" : "tiles",
                    sGroupId = aContexts[0].getObject().groupId,
                    oEventData = {
                        sTileId: this.tileUuid,
                        sToItems: stileType,
                        sFromItems: stileType,
                        sTileType: stileType,
                        toGroupId: aContexts[0].getObject().groupId,
                        toIndex: aContexts[0].getObject()[this.tileType === "link" ? "links" : "tiles"].length,
                        source: sSource
                    };

                if (Device.system.desktop) {
                    oEventData.callBack = sap.ushell.components.ComponentKeysHandler.callbackSetFocus.bind(sap.ushell.components.ComponentKeysHandler);
                }

                oEventBus.publish("launchpad", "scrollToGroup", { groupId: sGroupId });
                oEventBus.publish("launchpad", "movetile", oEventData);
            }
        },

        _changeLinksScope: function (oEvent) {
            var that = this;
            if (this.bLinkPersonalizationSupported) {
                var bIsTileActionModeActive = oEvent.getSource().getValue();
                this.oModel.getProperty("/groups").forEach(function (oGroup, index) {
                    if (!oGroup.isGroupLocked) {
                        that._changeGroupLinksScope(oGroup, bIsTileActionModeActive ? "Actions" : "Display");
                    }
                });
            }
        },

        _changeGroupLinksScope: function (oGroup, scope) {
            var that = this;

            oGroup.links.forEach(function (oLink, index) {
                that._changeLinkScope(oLink.content[0], scope);
            });
        },

        _changeLinkScope: function (oLink, scope) {
            var oLinkView = oLink.getScope ? oLink : oLink.getContent()[0];//hack for demo content

            //if LinkPersonalization is supported by platform, then the link must support personalization
            if (this.bLinkPersonalizationSupported && oLinkView.setScope) {
                oLinkView.setScope(scope);
            }
        },

        registerEvents: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("launchpad", "addBookmarkTile", this._createBookmark, this);
            oEventBus.subscribe("launchpad", "tabSelected", this.getSegmentTabContentViews, this);
            oEventBus.subscribe("sap.ushell.services.Bookmark", "bookmarkTileAdded", this._addBookmarkToModel, this);
            oEventBus.subscribe("sap.ushell.services.Bookmark", "catalogTileAdded", this._refreshGroupInModel, this);
            oEventBus.subscribe("sap.ushell.services.Bookmark", "bookmarkTileDeleted", this.loadPersonalizedGroups, this);
            oEventBus.subscribe("launchpad", "loadDashboardGroups", this.loadPersonalizedGroups, this);
            oEventBus.subscribe("launchpad", "createGroupAt", this._createGroupAt, this);
            oEventBus.subscribe("launchpad", "deleteGroup", this._deleteGroup, this);
            oEventBus.subscribe("launchpad", "resetGroup", this._resetGroup, this);
            oEventBus.subscribe("launchpad", "changeGroupTitle", this._changeGroupTitle, this);
            oEventBus.subscribe("launchpad", "moveGroup", this._moveGroup, this);
            oEventBus.subscribe("launchpad", "deleteTile", this._deleteTile, this);
            oEventBus.subscribe("launchpad", "movetile", this._moveTile, this);
            oEventBus.subscribe("launchpad", "sortableStart", this._sortableStart, this);
            oEventBus.subscribe("launchpad", "sortableStop", this._sortableStop, this);
            oEventBus.subscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            oEventBus.subscribe("launchpad", "convertTile", this._convertTile, this);

            //add Remove action for all tiles
            this.oPageBuilderService.registerTileActionsProvider(this._addFLPActionsToTile.bind(this));
        },

        _changeMode: function (bTransientMode) {
            var aGroups = this.getModel().getProperty("/groups");
            if (bTransientMode) {
                this.oPageOperationAdapter = TransientPageOperationAdapter.getInstance();
                //remove all references to server object
                var aTransformedGroupModel = this.oPageOperationAdapter.transformGroupModel(aGroups);
                this.getModel().setProperty("/groups", aTransformedGroupModel);
            } else {
                this.oPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
                oDestroyHelper.destroyFLPAggregationModels(aGroups);
                //reset group model
                this.getModel().setProperty("/groups", []);
                this.loadPersonalizedGroups();
            }
        },

        _addFLPActionsToTile: function (oTile) {
            var bLinkPersonalizationSupportedForTile = this.bLinkPersonalizationSupported
                && this.oPageOperationAdapter.isLinkPersonalizationSupported(oTile),
                aActions = [];

            aActions.push(this._getMoveTileAction(oTile));

            if (bLinkPersonalizationSupportedForTile) {
                aActions.push(this._getConvertTileAction(oTile));
            }

            return aActions;
        },

        _getConvertTileAction: function (oTile) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                that = this,
                sTileType = that.oPageOperationAdapter.getTileType(oTile);
            return {
                //Convert Tile action
                text: sTileType === "link" ? oResources.i18n.getText("ConvertToTile") : oResources.i18n.getText("ConvertToLink"),
                press: function (oSourceTile) {
                    var oConvertInfo = { tile: oSourceTile };

                    if (Device.system.desktop) {
                        oConvertInfo.callBack = sap.ushell.components.ComponentKeysHandler.callbackSetFocus.bind(sap.ushell.components.ComponentKeysHandler);
                    }

                    oEventBus.publish("launchpad", "convertTile", oConvertInfo);
                }
            };
        },

        _getMoveTileAction: function (oTile) {
            var that = this;
            return {
                //Move Tile action
                text: oResources.i18n.getText("moveTileDialog_action"),
                press: function () {
                    that.tileType = that.oPageOperationAdapter.getTileType(oTile);
                    that.tileUuid = that.getModelTileById(
                        that.oPageOperationAdapter.getTileId(oTile),
                        that.tileType === "link" ? "links" : "tiles"
                    ).uuid;
                    var oMoveDialog = that.tileType === "tile" ? that.moveTileDialog : that.moveLinkDialog;
                    if (that.tileType === "tile" || that.tileType === "link") {
                        if (!oMoveDialog) {
                            oMoveDialog = that.createMoveActionDialog("move" + that.tileType + "Dialog");
                            oMoveDialog.setModel(that.oModel);
                            if (that.tileType === "tile") {
                                that.moveTileDialog = oMoveDialog;
                            } else {
                                that.moveLinkDialog = oMoveDialog;
                            }
                        } else {
                            oMoveDialog.getBinding("items").filter([that.oGroupNotLockedFilter]);
                        }
                        oMoveDialog.open();
                    }
                }
            };
        },

        _handleTileAppearanceAnimation: function (oSourceTile) {
            if (!oSourceTile) {
                return;
            }
            var pfx = ["webkit", ""];
            function prefixedEvent (element, type) {
                for (var i = 0; i < pfx.length; i++) {
                    type = type.toLowerCase();
                    oSourceTile.attachBrowserEvent(pfx[i] + type, function (oEvent) {
                        if (oEvent.originalEvent && oEvent.originalEvent.animationName === "sapUshellTileEntranceAnimation") {
                            oSourceTile.removeStyleClass("sapUshellTileEntrance");
                        }
                    }, false);
                }
            }
            prefixedEvent(oSourceTile, "AnimationEnd");
            oSourceTile.addStyleClass("sapUshellTileEntrance");
        },

        destroy: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("launchpad", "addBookmarkTile", this._createBookmark, this);
            oEventBus.unsubscribe("launchpad", "loadDashboardGroups", this.loadPersonalizedGroups, this);
            oEventBus.unsubscribe("launchpad", "createGroupAt", this._createGroupAt, this);
            oEventBus.unsubscribe("launchpad", "deleteGroup", this._deleteGroup, this);
            oEventBus.unsubscribe("launchpad", "resetGroup", this._resetGroup, this);
            oEventBus.unsubscribe("launchpad", "changeGroupTitle", this._changeGroupTitle, this);
            oEventBus.unsubscribe("launchpad", "moveGroup", this._moveGroup, this);
            oEventBus.unsubscribe("launchpad", "deleteTile", this._deleteTile, this);
            oEventBus.unsubscribe("launchpad", "movetile", this._moveTile, this);
            oEventBus.unsubscribe("launchpad", "sortableStart", this._sortableStart, this);
            oEventBus.unsubscribe("launchpad", "sortableStop", this._sortableStop, this);
            oEventBus.unsubscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            sap.ui.getCore().detachThemeChanged(oUtils.handleTilesVisibility);

            aDoables.forEach(function (oDoable) {
                oDoable.off();
            });

            PersistentPageOperationAdapter.destroy();
            TransientPageOperationAdapter.destroy();

            sap.ushell.components.getHomepageManager = undefined;
            BaseObject.prototype.destroy.apply(this, arguments);
        },

        _sortableStart: function () {
            this.oSortableDeferred = new jQuery.Deferred();
        },

        _createBookmark: function (sChannelId, sEventId, oData) {
            var tileGroup = oData.group ? oData.group.object : "";

            delete oData.group;

            function addBookmark () {
                sap.ushell.Container.getServiceAsync("Bookmark").then(function (oBookmarkService) {
                    oBookmarkService.addBookmark(oData, tileGroup)
                        .always(_checkRequestQueue)
                        .done(function () {
                            //the tile is added to our model in "_addBookmarkToModel" here we just show the
                            //success toast.
                            oMessagingHelper.showLocalizedMessage("tile_created_msg");
                        })
                        .fail(function (sMsg) {
                            Log.error(
                                "Failed to add bookmark",
                                sMsg,
                                "sap.ushell.ui.footerbar.AddBookmarkButton"
                            );
                            oMessagingHelper.showLocalizedError("fail_to_add_tile_msg");
                        });
                });
            }

            _addRequest(addBookmark);
        },

        /*
        * Add a bookmark to a dashboard group.
        * If no group is specified then the bookmark is added to the default group.
        * This function will be called also if an application used the bookmark service directly to add a bookmark.
        * the bookmark service publishes an event so that we will be able to update the model.
        * This method doesn't display a success toast since the application should show success or failure messages
        */
        _addBookmarkToModel: function (sChannelId, sEventId, oData) {
            var oTile = oData.tile,
                aGroups,
                oGroup = oData.group,
                newTile,
                indexOfGroup,
                targetGroup,
                iNumTiles,
                iIndex;

            if (!oData || !oTile) {
                this.bIsGroupsModelDirty = true;
                if (!this.bGroupsModelLoadingInProcess) {
                    this._handleBookmarkModelUpdate();
                }
                return;
            }

            // If no group was specified then the target group is the default one.
            if (!oGroup) {
                aGroups = this.getModel().getProperty("/groups");
                for (iIndex = 0; iIndex < aGroups.length; iIndex++) {
                    if (aGroups[iIndex].isDefaultGroup === true) {
                        oGroup = aGroups[iIndex].object;
                        break;
                    }
                }
            }

            //The create bookmark popup should not contain the locked groups anyway,
            //so this call not suppose to happen for a target locked group (we may as well always send false)
            indexOfGroup = this._getIndexOfGroupByObject(oGroup);
            targetGroup = this.oModel.getProperty("/groups/" + indexOfGroup);
            newTile = this.oPageOperationAdapter.getPreparedTileModel(oTile, targetGroup.isGroupLocked);
            this.getTileView(newTile);

            // The function calcVisibilityModes requires the group from the model
            targetGroup.tiles.push(newTile);
            targetGroup.visibilityModes = oUtils.calcVisibilityModes(targetGroup, true);
            iNumTiles = targetGroup.tiles.length;
            this._updateModelWithTileView(indexOfGroup, iNumTiles);

            this.oModel.setProperty("/groups/" + indexOfGroup, targetGroup);
        },

        _refreshGroupInModel: function (sChannelId, sEventId, sGroupId) {
            var that = this;

            this.oPageOperationAdapter.refreshGroup(sGroupId).then(
                function (oGroupModel) {
                    if (!oGroupModel) {
                        return;
                    }
                    var indexOfGroup = that._getIndexOfGroupByObject(oGroupModel.object);

                    oGroupModel.visibilityModes = oUtils.calcVisibilityModes(oGroupModel.object, true);
                    that.oModel.setProperty("/groups/" + indexOfGroup, oGroupModel);

                    // The old group tiles are lost, get the tile views
                    if (oGroupModel.tiles) {
                        oGroupModel.tiles.forEach(function (tile) {
                            that.getTileView(tile);
                        });
                    }
                }
            );
        },

        _sortableStop: function () {
            this.oSortableDeferred.resolve();
        },

        _handleAfterSortable: function (fFunc) {
            return function () {
                var outerArgs = Array.prototype.slice.call(arguments);
                this.oSortableDeferred.done(function () {
                    fFunc.apply(null, outerArgs);
                });
            }.bind(this);
        },

        /*
        * oData should have the following parameters:
        * title
        * location
        */
        _createGroupAt: function (sChannelId, sEventId, oData) {
            var newGroupIndex = parseInt(oData.location, 10),
                aGroups = this.oModel.getProperty("/groups"),
                oGroup = this.oPageOperationAdapter.getPreparedGroupModel(null, false, newGroupIndex === aGroups.length, oData),
                oModel = this.oModel,
                i;

            oGroup.index = newGroupIndex;

            aGroups.splice(newGroupIndex, 0, oGroup);
            for (i = 0; i < aGroups.length - 1; i++) {
                aGroups[i].isLastGroup = false;
            }

            //set new groups index
            for (i = newGroupIndex + 1; i < aGroups.length; i++) {
                aGroups[i].index++;
            }
            oModel.setProperty("/groups", aGroups);
        },

        _getIndexOfGroupByObject: function (oServerGroupObject) {
            var aGroups = this.oModel.getProperty("/groups");
            return this.oPageOperationAdapter.getIndexOfGroup(aGroups, oServerGroupObject);
        },

        getTileActions: function (oTile) {
            return this.oPageOperationAdapter.getTileActions(oTile);
        },

        addTileToGroup: function (sGroupPath, oTile) {
            var sTilePath = sGroupPath + "/tiles",
                oGroup = this.oModel.getProperty(sGroupPath),
                iNumTiles = this.oModel.getProperty(sTilePath).length;

            //Locked groups cannot be added with tiles,
            //so the target group will not be locked, however just for safety we will check the target group locking state
            var isGroupLocked = this.oModel.getProperty(sGroupPath + "/isGroupLocked"),
                personalization = this.oModel.getProperty("/personalization");

            oGroup.tiles[iNumTiles] = this.oPageOperationAdapter.getPreparedTileModel(oTile, isGroupLocked);
            this.getTileView(oGroup.tiles[iNumTiles]);
            oGroup.visibilityModes = oUtils.calcVisibilityModes(oGroup, personalization);
            this._updateModelWithTileView(oGroup.index, iNumTiles);
            this.oModel.setProperty(sGroupPath, oGroup);
        },

        /**
         * Adds the tiles in the array of catalog tile ids to the given group
         *
         * @param {object} oGroup The group to which the tiles are added
         * @param {string[]} aCatalogTileIds Array of catalog tile ids
         */
        addTilesToGroupByCatalogTileId: function (oGroup, aCatalogTileIds) {
            var oGroupContext = oGroup.getBindingContext();

            for (var i = 0; i < aCatalogTileIds.length; i++) {
                this.addTileToGroupByCatalogTileId(oGroupContext.sPath, aCatalogTileIds[i]);
            }
        },

        addTileToGroupByCatalogTileId: function (sGroupPath, sCatalogTileId) {
            var iNumTiles,
                oGroupModel,
                oTileModel;

            if (!oShellConfig.last("/core/home/enableTransientMode")) {
                return;
            }

            oTileModel = this.oPageOperationAdapter.getTileModelByCatalogTileId(sCatalogTileId);

            if (!oTileModel) {
                return;
            }
            this.oDashboardLoadingManager.setTileResolved(oTileModel);
            iNumTiles = this.oModel.getProperty(sGroupPath + "/tiles").length;
            oGroupModel = this.oModel.getProperty(sGroupPath);
            oGroupModel.tiles[iNumTiles] = oTileModel;
            this.oModel.setProperty(sGroupPath, oGroupModel);

        },

        _getPathOfTile: function (sTileId) {
            var aGroups = this.oModel.getProperty("/groups"),
                nResGroupIndex = null,
                nResTileIndex = null,
                sType,
                fnEqual = function (nTileIndex, oTile) {
                    if (oTile.uuid === sTileId) {
                        nResTileIndex = nTileIndex;
                        return false;
                    }
                    return undefined;
                };

            jQuery.each(aGroups, function (nGroupIndex, oGroup) {
                jQuery.each(oGroup.tiles, fnEqual);
                if (nResTileIndex !== null) {
                    nResGroupIndex = nGroupIndex;
                    sType = "tiles";
                    return false;
                }
                jQuery.each(oGroup.links, fnEqual);
                if (nResTileIndex !== null) {
                    nResGroupIndex = nGroupIndex;
                    sType = "links";
                    return false;
                }
                return undefined;
            });

            return nResGroupIndex !== null ? "/groups/" + nResGroupIndex + "/" + sType + "/" + nResTileIndex : null;
        },

        // see http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
        _moveInArray: function (aArray, nFromIndex, nToIndex) {
            if (nToIndex >= aArray.length) {
                var k = nToIndex - aArray.length;
                while ((k--) + 1) {
                    aArray.push(undefined);
                }
            }
            aArray.splice(nToIndex, 0, aArray.splice(nFromIndex, 1)[0]);
        },

        _updateGroupIndices: function (aArray) {
            var k;
            for (k = 0; k < aArray.length; k++) {
                aArray[k].index = k;
            }
        },

        /*
        * oData should have the following parameters
        * groupId
        */
        _deleteGroup: function (sChannelId, sEventId, oData) {
            var that = this,
                oModel = this.oModel,
                sGroupId = oData.groupId,
                aGroups = oModel.getProperty("/groups"),
                nGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, sGroupId),
                bIsLast = aGroups.length - 1 === nGroupIndex,
                oDeletedGroupModel = null,
                nextSelectedItemIndex,
                oBus;

            nextSelectedItemIndex = bIsLast ? nGroupIndex - 1 : nGroupIndex;
            oDestroyHelper.destroyFLPAggregationModel(oModel.getProperty("/groups/" + nGroupIndex));
            //remove deleted group from the model
            oDeletedGroupModel = aGroups.splice(nGroupIndex, 1)[0];

            if (bIsLast) {
                oModel.setProperty("/groups/" + nextSelectedItemIndex + "/isLastGroup", bIsLast);
            }

            oModel.setProperty("/groups", aGroups);
            this._updateGroupIndices(aGroups);

            if (nextSelectedItemIndex >= 0) {
                oBus = sap.ui.getCore().getEventBus();
                window.setTimeout(
                    jQuery.proxy(
                        oBus.publish,
                        oBus,
                        "launchpad",
                        "scrollToGroup",
                        { groupId: oModel.getProperty("/groups")[nextSelectedItemIndex].groupId }
                    ), 200);
            }

            function deleteGroup () {
                that.oPageOperationAdapter.deleteGroup(oDeletedGroupModel).then(
                    function () {
                        oMessagingHelper.showLocalizedMessage("group_deleted_msg", [oDeletedGroupModel.title]);
                        _checkRequestQueue();
                    }, function () {
                        that._resetGroupsOnFailure("fail_to_delete_group_msg");
                    }
                );
            }

            _addRequest(deleteGroup);
        },

        /*
        * oData should have the following parameters
        * groupId
        */
        _resetGroup: function (sChannelId, sEventId, oData) {
            var that = this,
                sGroupId = oData.groupId,
                oModel = this.oModel,
                aGroups = oModel.getProperty("/groups"),
                nGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, sGroupId),
                bDefaultGroup = that.oModel.getProperty("/groups/indexOfDefaultGroup") === nGroupIndex,
                oGroupModel = oModel.getProperty("/groups/" + nGroupIndex),
                oGroupControl,
                oLinks;

            oModel.setProperty("/groups/" + nGroupIndex + "/sortable", false);

            function resetGroup () {
                that.oPageOperationAdapter.resetGroup(oGroupModel, bDefaultGroup).then(
                    function (oResetedObject) {
                        that._handleAfterSortable(function (sGroupId, oOldGroupModel, oResetedGroupModel) {
                            var aGroups = that.oModel.getProperty("/groups"),
                                nGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, sGroupId);

                            that._loadGroup(nGroupIndex, oResetedGroupModel || oOldGroupModel);
                            oMessagingHelper.showLocalizedMessage("group_reset_msg", [oOldGroupModel.title]);
                            that.oModel.setProperty("/groups/" + nGroupIndex + "/sortable", true);

                            oGroupControl = sap.ui.getCore().byId("dashboardGroups").getGroupControlByGroupId(sGroupId);
                            oLinks = oGroupControl.getBindingContext().getObject().links;

                            if (oLinks && oLinks.length && !oGroupControl.getIsGroupLocked()) {
                                that._changeGroupLinksScope(
                                    oGroupControl.getBindingContext().getObject(),
                                    that.oModel.getProperty("/tileActionModeActive")
                                        ? GenericTileScope.Actions : GenericTileScope.Display
                                );
                            }

                            if (oGroupControl) {
                                oGroupControl.rerender();
                                oEventHub.emit("updateGroups", Date.now());
                                oUtils.handleTilesVisibility();
                            }
                        })(sGroupId, oGroupModel, oResetedObject);
                        _checkRequestQueue();
                    }, function () {
                        that._resetGroupsOnFailure("fail_to_reset_group_msg");
                    }
                );
            }
            _addRequest(resetGroup);
        },

        /*
        * oData should have the following parameters
        * fromIndex
        * toIndex
        */
        _moveGroup: function (sChannelId, sEventId, oData) {
            var iFromIndex = oData.fromIndex,
                iToIndex = oData.toIndex,
                oModel = this.oModel,
                aGroups = oModel.getProperty("/groups"),
                bActionMode = oModel.getProperty("/tileActionModeActive"),
                oGroup,
                sGroupId,
                that = this,
                i,
                oDestinationGroup;

            //Fix the indices to support hidden groups
            if (!bActionMode) {
                iFromIndex = this._adjustFromGroupIndex(iFromIndex, aGroups);
            }

            //Move var definition after fixing the from index.
            oGroup = aGroups[iFromIndex];
            sGroupId = oGroup.groupId;
            //Fix the to index accordingly
            if (!bActionMode) {
                iToIndex = this._adjustToGroupIndex(iToIndex, aGroups, sGroupId);
            }

            oDestinationGroup = aGroups[iToIndex];
            this._moveInArray(aGroups, iFromIndex, iToIndex);
            this._updateGroupIndices(aGroups);
            for (i = 0; i < aGroups.length - 1; i++) {
                aGroups[i].isLastGroup = false;
            }
            aGroups[aGroups.length - 1].isLastGroup = true;
            oModel.setProperty("/groups", aGroups);

            function moveGroup () {
                aGroups = oModel.getProperty("/groups"); //Update aGroups. Can be change before callback
                var oGroup = oModel.getProperty(oGroupsHelper.getModelPathOfGroup(aGroups, sGroupId));
                if (!oGroup.object) {
                    return;
                }

                that.oPageOperationAdapter.getOriginalGroupIndex(oDestinationGroup, aGroups).then(
                    function (iIndexTo) {
                        var oIndicesInModel = {
                            iFromIndex: iFromIndex,
                            iToIndex: iToIndex
                        };
                        return that.oPageOperationAdapter.moveGroup(oGroup, iIndexTo, oIndicesInModel);
                    }
                ).then(
                    _checkRequestQueue,
                    function () {
                        that._resetGroupsOnFailure("fail_to_move_group_msg");
                    }
                );
            }

            _addRequest(moveGroup);
        },

        /*
        * toIndex - The index in the UI of the required group new index. (it is not including the group itself)
        * groups - The list of groups in the model (including hidden and visible groups)
        * The function returns the new index to be used in the model - since there might be hidden groups that should be taken in account
        */
        _adjustToGroupIndex: function (toIndex, groups, groupId) {
            var visibleCounter = 0,
                bIsGroupIncluded = false,
                i = 0;
            // In order to get the new index, count all groups (visible+hidden) up to the new index received from the UI.
            for (i = 0; i < groups.length && visibleCounter < toIndex; i++) {
                if (groups[i].isGroupVisible) {
                    if (groups[i].groupId === groupId) {
                        bIsGroupIncluded = true;
                    } else {
                        visibleCounter++;
                    }
                }
            }
            if (bIsGroupIncluded) {
                return i - 1;
            }
            return i;
        },

        _adjustFromGroupIndex: function (index, groups) {
            var visibleGroupsCounter = 0,
                i;
            for (i = 0; i < groups.length; i++) {
                if (groups[i].isGroupVisible) {
                    visibleGroupsCounter++;
                }
                if (visibleGroupsCounter === index + 1) {
                    return i;
                }
            }
            //Not suppose to happen, but if not found return the input index
            return index;
        },

        /*
        * oData should have the following parameters
        * groupId
        * newTitle
        */
        _changeGroupTitle: function (sChannelId, sEventId, oData) {
            var that = this,
                sNewTitle = oData.newTitle,
                aGroups = this.oModel.getProperty("/groups"),
                sModelGroupId = oData.groupId,
                nGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, sModelGroupId),
                bDefaultGroup = that.oModel.getProperty("/groups/indexOfDefaultGroup") === nGroupIndex,
                oGroupModel = this.oModel.getProperty("/groups/" + nGroupIndex),
                sOldTitle = oGroupModel.title;

            this.oModel.setProperty("/groups/" + nGroupIndex + "/title", sNewTitle);

            function addGroup () {
                var oAddGroupPromise;
                if (oGroupModel.isLastGroup) {
                    oAddGroupPromise = that.oPageOperationAdapter.addGroupAt(oGroupModel, undefined, bDefaultGroup);
                } else {
                    var oNextGroup = that.oModel.getProperty("/groups")[nGroupIndex + 1];
                    //groups can be sorted in PageAdapter and have different order compare to the model
                    //For this reason we need firstly get the correct index of the next group and then add new group before it.
                    oAddGroupPromise = that.oPageOperationAdapter.getOriginalGroupIndex(oNextGroup, aGroups).then(
                        function (iIndex) {
                            return that.oPageOperationAdapter.addGroupAt(oGroupModel, iIndex, bDefaultGroup);
                        }
                    );
                }

                oAddGroupPromise.then(
                    function (oNewPreparedGroupModel) {
                        //Theoretically can be case that the server is slow and user start the dnd tiles.
                        that._handleAfterSortable(function (sGroupId, oNewGroupModel) {
                            //group model can be changed
                            var aUpdatedGroups = that.oModel.getProperty("/groups"),
                                iGroupIndex = oGroupsHelper.getIndexOfGroup(aUpdatedGroups, sGroupId);
                            that._loadGroup(iGroupIndex, oNewGroupModel);
                        })(sModelGroupId, oNewPreparedGroupModel);
                        _checkRequestQueue();
                    }, function () {
                        that._resetGroupsOnFailure("fail_to_create_group_msg");
                    }
                );
            }

            function renameGroup () {
                this.oPageOperationAdapter.renameGroup(oGroupModel, sNewTitle, sOldTitle).then(
                    function () {
                        _checkRequestQueue();
                    }, function () {
                        that._resetGroupsOnFailure("fail_to_rename_group_msg");
                    }
                );
            }

            // Check, if the group has already been persisted
            if (!oGroupModel.object) {
                _checkRequestQueue.call(this);
                // Add the group in the backend.
                _addRequest(addGroup.bind(this));
            } else {
                // Rename the group in the backend.
                // model is already changed - it only has to be made persistent in the backend
                _addRequest(renameGroup.bind(this));
            }
        },

        /**
         * Add the group to the end of groups model
         * @param {Object} oGroup The group object
         * @returns {Object} The group context
         */
        addGroupToModel: function (oGroup) {
            var oGroupModel = this.oPageOperationAdapter.getPreparedGroupModel(oGroup, false, true, { isRendered: true }),
                aGroups = this.oModel.getProperty("/groups"),
                nGroupIndex = aGroups.length, //push new group at the end of list
                oContextGroup;

            if (nGroupIndex > 0) {
                aGroups[nGroupIndex - 1].isLastGroup = false;
            }
            oGroupModel.index = nGroupIndex;
            aGroups.push(oGroupModel);
            this.oModel.setProperty("/groups/", aGroups);

            oContextGroup = new Context(this.oModel, "/groups/" + nGroupIndex);
            return oContextGroup;
        },

        /*
        * Dashboard
        * oData should have the following parameters
        * tileId
        * groupId
        */
        _deleteTile: function (sChannelId, sEventId, oData) {
            var that = this,
                sTileId = oData.tileId,
                aGroups = this.oModel.getProperty("/groups"),
                sItems = oData.items || "tiles";

            jQuery.each(aGroups, function (nGroupIndex, oGroup) {
                var bFoundFlag = false;
                jQuery.each(oGroup[sItems], function (nTileIndex, oTmpTile) {
                    if (oTmpTile.uuid !== sTileId) {
                        return true; // continue
                    }
                    // Remove tile from group.
                    oDestroyHelper.destroyTileModel(that.oModel.getProperty("/groups/" + nGroupIndex + "/" + sItems + "/" + nTileIndex));
                    var oTileModel = oGroup[sItems].splice(nTileIndex, 1)[0],
                        personalization = that.oModel.getProperty("/personalization");

                    oGroup.visibilityModes = oUtils.calcVisibilityModes(oGroup, personalization);
                    that.oModel.setProperty("/groups/" + nGroupIndex, oGroup);
                    function deleteTile () {
                        that.oPageOperationAdapter.removeTile(oGroup, oTileModel).then(
                            function () {
                                _checkRequestQueue();
                            }, function () {
                                that._resetGroupsOnFailure("fail_to_remove_tile_msg");
                            }
                        );
                    }
                    _addRequest(deleteTile);
                    oUtils.handleTilesVisibility();
                    bFoundFlag = true;
                    return false;
                });
                return !bFoundFlag;
            });
        },

        /**
         * Remove tiles from the group model
         *
         * @param {String} sGroupId Id of the group, where tiles should be removed
         * @param {Array} aRemovedTilesIds Array of the tile uuids to remove
         *
         */
        deleteTilesFromGroup: function (sGroupId, aRemovedTilesIds) {
            var aGroups = this.oModel.getProperty("/groups"),
                iGroupIndex = oGroupsHelper.getIndexOfGroup(aGroups, sGroupId),
                oGroup = this.oModel.getProperty("/groups/" + iGroupIndex),
                aFilteredTiles = [];

            ["tiles", "links"].forEach(function (sAttribute) {
                aFilteredTiles = oGroup[sAttribute].filter(function (oTile) {
                    if (aRemovedTilesIds.indexOf(oTile.uuid) < 0) {
                        return true;
                    }
                    return false;
                });
                oGroup[sAttribute] = aFilteredTiles;
            });

            oGroup.visibilityModes = oUtils.calcVisibilityModes(oGroup, true);
            this.oModel.setProperty("/groups/" + iGroupIndex, oGroup);
        },

        _getGroupIndex: function (sId) {
            var aGroups = this.oModel.getProperty("/groups"),
                oGroupInfo = this._getNewGroupInfo(aGroups, sId);
            if (oGroupInfo) {
                return oGroupInfo.newGroupIndex;
            }
            return undefined;
        },

        _convertTile: function (sChannelId, sEventId, oData) {
            var oSourceTile = oData.tile ? oData.tile : oData, //temp solution - i should change all calls for convert to support oData obj
                nGroupIndex = oData.srcGroupId ? this._getGroupIndex(oData.srcGroupId) : undefined,
                oSourceGroup = oData.srcGroupId
                    ? this.oModel.getProperty("/groups/" + nGroupIndex)
                    : oSourceTile.getParent().getBindingContext().getObject(), //please humafy this
                aTileBindingContext = oSourceTile.getBindingContext().sPath.split("/"),
                oTileModel = oSourceTile.getBindingContext().getObject(),
                sOldType = aTileBindingContext[aTileBindingContext.length - 2],
                sTileId = oTileModel.uuid,
                curTileIndex = parseInt(aTileBindingContext[aTileBindingContext.length - 1], 10),
                newTileIndex = oData.toIndex !== undefined ? oData.toIndex : undefined,
                bActionMode = this.oModel.getProperty("/tileActionModeActive"),
                newGroupIndex = oData.toGroupId ? this._getGroupIndex(oData.toGroupId) : oSourceGroup.index,
                oTargetGroup = oData.toGroupId ? this.oModel.getProperty("/groups/" + newGroupIndex) : oSourceGroup,
                that = this;

            var oIndexInfo = this._getIndexForConvert(sOldType, curTileIndex, newTileIndex, oSourceGroup, oTargetGroup),
                sourceInfo = {
                    "tileIndex": curTileIndex,
                    "groupIndex": nGroupIndex,
                    "group": oSourceGroup
                };


            function convertTile () {
                // Putting a special flag on the Tile's object
                // this enables us to disable opening the tile's action until it has been updated from the backend
                // (see in DashboardContent.view
                oTileModel.tileIsBeingMoved = true;
                var oResultPromise = this.oPageOperationAdapter.moveTile(
                    oTileModel,
                    oIndexInfo,
                    oSourceGroup,
                    oTargetGroup,
                    sOldType === "links" ? "tile" : "link"
                );

                oResultPromise.then(function (oNewTileInfo) {
                    that._showMoveTileMessage(oTileModel, oSourceGroup, oTargetGroup);
                    //we call to _handleAfterSortable to handle the case in which convertTile is called by dragAndDrop flow
                    that._handleAfterSortable(function (sTileId, oNewTileInfo) {
                        var sTilePath = that._getPathOfTile(sTileId),
                            oView = oNewTileInfo.content;

                        // If we cannot find the tile, it might have been deleted -> Check!
                        if (sTilePath) {
                            if (sOldType === "tiles") { //it means we convert to link
                                that._attachLinkPressHandlers(oView);
                                that._addDraggableAttribute(oView);
                                that._changeLinkScope(oView, bActionMode ? "Actions" : "Display");
                            }
                            var oTargetGroupInfo = {
                                "tileIndex": newTileIndex,
                                "groupIndex": newGroupIndex,
                                "group": oTargetGroup
                            },
                                tileInfo = {
                                    "tile": oTileModel,
                                    "view": oView,
                                    "type": sOldType,
                                    "tileObj": oNewTileInfo.object
                                };

                            oTileModel.tileIsBeingMoved = true;
                            that.replaceTileViewAfterConvert(sourceInfo, oTargetGroupInfo, tileInfo);
                            oEventHub.emit("updateGroups", Date.now());
                            oUtils.handleTilesVisibility();
                            if (oData.callBack) {
                                oData.callBack(oView);
                            }
                        }
                    })(sTileId, oNewTileInfo);
                    _checkRequestQueue();
                }, function () {
                    that._handleAfterSortable(that._resetGroupsOnFailure.bind(that))("fail_to_move_tile_msg");
                });
            }
            _addRequest(convertTile.bind(this));
        },

        replaceTileViewAfterConvert: function (oSourceInfo, oDstInfo, oTileInfo) {
            // get the old view from tile's model
            var oTile = oTileInfo.tile,
                oldViewContent = oTile.content;
            // first we set new view, new tile object and new Id. And reset the move-scenario flag
            oTile.tileIsBeingMoved = false;
            oTile.content = [oTileInfo.view];
            oTile.object = oTileInfo.tileObj;
            oTile.originalTileId = this.oPageOperationAdapter.getTileId(oTileInfo.tileObj);

            //fix the tile position in the model and insert the converted tile\link to the group
            oSourceInfo.group[oTileInfo.type].splice(oSourceInfo.tileIndex, 1);
            if (oDstInfo.tileIndex !== undefined) {
                oDstInfo.group[oTileInfo.type === "tiles" ? "links" : "tiles"].splice(oDstInfo.tileIndex, 0, oTile);
            } else {
                oDstInfo.group[oTileInfo.type === "tiles" ? "links" : "tiles"].push(oTile);
            }

            this.oModel.setProperty("/groups/" + oDstInfo.groupIndex, oDstInfo.group);
            this.oModel.setProperty("/groups/" + oSourceInfo.groupIndex, oSourceInfo.group);

            //handle animation
            if (oTileInfo.type === "links") {
                this._handleTileAppearanceAnimation(oTile.content[0].getParent());
            } else {
                this._handleTileAppearanceAnimation(oTile.content[0]);
            }

            if (oldViewContent && oldViewContent[0]) {
                oldViewContent[0].destroy();
            }
        },

        /*
        * sType: the type of the tile(lineMode/ContentMode) befor the convert action
        */
        _getIndexForConvert: function (sType, curTileIndex, newTileIndexInShellModel, oGroup, oDstGroup) {
            var nNewTileIndex;
            if (sType === "tiles") {
                //If we convert ContentMode-tile to link
                //then we want to enter the new link to the end of the array or to provided newTileIndex
                if (newTileIndexInShellModel !== undefined) {
                    nNewTileIndex = oDstGroup[sType].length + newTileIndexInShellModel;
                } else {
                    nNewTileIndex = oDstGroup[sType].length + oDstGroup.links.length;
                }
                if (oGroup.groupId === oDstGroup.groupId) {
                    nNewTileIndex--;
                }
            } else {
                //If we convert link to ContentMode-tile then we want to enter the new tile after the the last ContentMode-tile
                nNewTileIndex = newTileIndexInShellModel || oGroup.tiles.length;
                curTileIndex += oGroup.tiles.length;
            }
            return { "tileIndex": curTileIndex, "newTileIndex": nNewTileIndex };
        },

        _getIndexForMove: function (sType, curTileIndex, newTileIndexInShellModel, oDstGroup, oSourceGroup) {
            var nNewTileIndex;
            if (sType === "tiles") {
                //case move tile
                nNewTileIndex = newTileIndexInShellModel !== undefined ? newTileIndexInShellModel : oDstGroup[sType].length;
            } else {
                //case move link
                if (newTileIndexInShellModel !== undefined) {
                    nNewTileIndex = oDstGroup.tiles.length + newTileIndexInShellModel;
                } else {
                    nNewTileIndex = oDstGroup.tiles.length + oDstGroup.links.length;
                }
                curTileIndex += oSourceGroup.tiles.length;
            }
            return { "tileIndex": curTileIndex, "newTileIndex": nNewTileIndex };
        },

        _getTileInfo: function (aGroups, sTileId, sItems) {
            var oTileInfo;
            jQuery.each(aGroups, function (nTmpGroupIndex, oTmpGroup) {
                var bFoundFlag = false;
                jQuery.each(oTmpGroup[sItems], function (nTmpTileIndex, oTmpTile) {
                    if (oTmpTile.uuid === sTileId) {
                        //the order is oTile, nTileIndex, oOldGroup, nOldGroupIndex
                        oTileInfo = { "oTile": oTmpTile, "tileIndex": nTmpTileIndex, "oGroup": oTmpGroup, "groupIndex": nTmpGroupIndex };
                        bFoundFlag = true;
                        return false;
                    }
                    return undefined;
                });
                return !bFoundFlag;
            });
            return oTileInfo;
        },

        //should be concidered to improve by inserting the logic into _getTileInfo function
        _getNewGroupInfo: function (aGroups, sNewGroupId) {
            var oNewGroupInfo;
            jQuery.each(aGroups, function (nTmpGroupIndex, oTmpGroup) {
                if (oTmpGroup.groupId === sNewGroupId) {
                    //order is oNewGroup, nNewGroupIndex
                    oNewGroupInfo = { "oNewGroup": oTmpGroup, "newGroupIndex": nTmpGroupIndex };
                }
            });
            return oNewGroupInfo;
        },

        /*
        * oData should have the following parameters:
        * fromGroupId
        * toGroupId
        * fromIndex
        * toIndex can be null => append as last tile in group
        */
        _moveTile: function (sChannelId, sEventId, oData) {
            var nNewIndex = oData.toIndex,
                sNewGroupId = oData.toGroupId,
                sTileId = oData.sTileId,
                sSource = oData.source,
                sType = oData.sTileType === "tiles" || oData.sTileType === "tile" ? "tile" : "link",
                sToItems = oData.sToItems,
                sFromItems = oData.sFromItems,
                bActionMode = this.oModel.getProperty("/tileActionModeActive"),
                aGroups = this.oModel.getProperty("/groups"),
                oSourceGroup,
                oTargetGroup,
                personalization,
                oTileInfo,
                oGroupInfo,
                oIndexInfo = {},
                that = this;

            oTileInfo = this._getTileInfo(aGroups, sTileId, sFromItems);
            oGroupInfo = this._getNewGroupInfo(aGroups, sNewGroupId);

            //When moving a tile to the group it is already in using the move dialog,
            //there is no change
            if (oTileInfo.oGroup.groupId === oGroupInfo.oNewGroup.groupId
                && (sSource === "movetileDialog" || nNewIndex === null || sSource === "movelinkDialog")
            ) {
                if (oData.callBack && oTileInfo.oTile && oTileInfo.oTile.content && oTileInfo.oTile.content.length) {
                    oData.callBack(oTileInfo.oTile.content[0]);
                }
                return;
            }
            if (sType === "link") {
                oTileInfo.oTile.content[0].addStyleClass("sapUshellZeroOpacity");
            }

            // When a tile is dragged into an empty group, the Plus-Tiles in the empty list cause
            // the new index to be off by one, i.e. 1 instead of 0, which causes an error.
            // This is a generic check which sanitizes the values if necessary.
            if (sType === "tile" && sToItems === "tiles") {
                if (nNewIndex && nNewIndex > oGroupInfo.oNewGroup[sToItems].length) {
                    nNewIndex = oGroupInfo.oNewGroup[sToItems].length;
                }
            }
            if (oTileInfo.oGroup.groupId === sNewGroupId && sToItems === sFromItems) {
                if (nNewIndex === null || nNewIndex === undefined) {
                    // moved over group list to same group
                    oTileInfo.oGroup[sToItems].splice(oTileInfo.tileIndex, 1);
                    // Tile is appended. Set index accordingly.
                    nNewIndex = oTileInfo.oGroup[sToItems].length;
                    // append as last item
                    oTileInfo.oGroup[sToItems].push(oTileInfo.oTile);
                } else {
                    nNewIndex = this._adjustTileIndex(nNewIndex, oTileInfo.oTile, oTileInfo.oGroup, sToItems);
                    this._moveInArray(oTileInfo.oGroup[sToItems], oTileInfo.tileIndex, nNewIndex);
                }

                this.oModel.setProperty("/groups/" + oTileInfo.groupIndex + "/" + sToItems, oTileInfo.oGroup[sToItems]);
            } else {
                // remove from old group
                personalization = this.oModel.getProperty("/personalization");
                oTileInfo.oGroup[sFromItems].splice(oTileInfo.tileIndex, 1);
                oTileInfo.oGroup.visibilityModes = oUtils.calcVisibilityModes(oTileInfo.oGroup, personalization);
                this.oModel.setProperty("/groups/" + oTileInfo.groupIndex + "/" + sFromItems, oTileInfo.oGroup[sFromItems]);

                // add to new group
                if (nNewIndex === null || nNewIndex === undefined) {
                    // Tile is appended. Set index accordingly.
                    nNewIndex = oGroupInfo.oNewGroup[sToItems].length;
                    // append as last item
                    oGroupInfo.oNewGroup[sToItems].push(oTileInfo.oTile);
                } else {
                    nNewIndex = this._adjustTileIndex(nNewIndex, oTileInfo.oTile, oGroupInfo.oNewGroup, sToItems);
                    oGroupInfo.oNewGroup[sToItems].splice(nNewIndex, 0, oTileInfo.oTile);
                }
                oGroupInfo.oNewGroup.visibilityModes = oUtils.calcVisibilityModes(oGroupInfo.oNewGroup, personalization);
                this.oModel.setProperty("/groups/" + oGroupInfo.newGroupIndex + "/" + sToItems, oGroupInfo.oNewGroup[sToItems]);
            }

            //recalculate the associated groups for catalog tiles
            oEventHub.emit("updateGroups", Date.now());
            // Re-calculate the visibility of the Tiles
            oUtils.handleTilesVisibility();


            // change in backend
            oSourceGroup = this.oModel.getProperty("/groups/" + oTileInfo.groupIndex);
            oTargetGroup = this.oModel.getProperty("/groups/" + oGroupInfo.newGroupIndex);
            oIndexInfo = this._getIndexForMove(sFromItems, oTileInfo.tileIndex, nNewIndex, oGroupInfo.oNewGroup, oSourceGroup);

            function moveTile () {
                // Putting a special flag on the Tile's object
                // this enables us to disable opening the tile's action until it has been updated from the backend
                // (see in DashboardContent.view
                oTileInfo.oTile.tileIsBeingMoved = true;
                this.oPageOperationAdapter.moveTile(
                    oTileInfo.oTile,
                    oIndexInfo,
                    oSourceGroup,
                    oTargetGroup,
                    sType
                ).then(function (oNewTileInfo) {
                    var sTilePath = that._getPathOfTile(sTileId);
                    that._showMoveTileMessage(oTileInfo.oTile, oSourceGroup, oTargetGroup);
                    if (sTilePath) {
                        // Update the model with the new tile object and new Id.
                        that.oModel.setProperty(sTilePath + "/object", oNewTileInfo.object);
                        that.oModel.setProperty(sTilePath + "/originalTileId", oNewTileInfo.originalTileId);

                        // get the old view from tile's model
                        var oldViewContent = that.oModel.getProperty(sTilePath + "/content"),
                            oView = oNewTileInfo.content;

                        // first we set new view
                        if (sToItems === "links") {
                            that._changeLinkScope(oView, bActionMode ? "Actions" : "Display");
                            that._attachLinkPressHandlers(oView);
                            that._addDraggableAttribute(oView);
                            that._handleTileAppearanceAnimation(oView);
                            oTileInfo.oTile.content = [oView];
                            that.oModel.setProperty(sTilePath, jQuery.extend({}, oTileInfo.oTile));
                            that.oModel.setProperty(
                                "/groups/" + oGroupInfo.newGroupIndex + "/" + sToItems,
                                that.oModel.getProperty("/groups/" + oGroupInfo.newGroupIndex + "/" + sToItems)
                            );
                        } else {
                            that.oModel.setProperty(sTilePath + "/content", [oView]);
                        }

                        //now we destroy the old view
                        if (oldViewContent && oldViewContent[0]) {
                            var origOnAfterRendering = oView.onAfterRendering;
                            oView.onAfterRendering = function () {
                                origOnAfterRendering.apply(this);
                                oldViewContent[0].destroy();
                                oView.onAfterRendering = origOnAfterRendering;
                            };
                        }
                        // reset the move-scenario flag
                        that.oModel.setProperty(sTilePath + "/tileIsBeingMoved", false);
                        if (oData.callBack) {
                            oData.callBack(oView);
                        }
                    }
                    _checkRequestQueue();
                }, function () {
                    that._resetGroupsOnFailure("fail_to_move_tile_msg");
                });
            }
            _addRequest(moveTile.bind(this));
        },

        _showMoveTileMessage: function (oTileModel, oSourceGroupModel, oTargetGroupModel) {
            var sTileTitle = this.oPageOperationAdapter.getTileTitle(oTileModel),
                sDestGroupName = oTargetGroupModel.title,
                sToastStaticText = oResources.i18n.getText("added_tile_to_group"),
                sToastMessageText = sTileTitle + " " + sToastStaticText + " " + sDestGroupName;

            if (oSourceGroupModel.groupId !== oTargetGroupModel.groupId) {
                MessageToast.show(sToastMessageText);
            }
        },

        // Adjust the moved-tile new index according to the visible+hidden tiles
        _adjustTileIndex: function (newLocationIndex, oTile, newGroup, sItems) {
            var visibleCounter = 0,
                bIsTileIncluded = false,
                i = 0;
            // In order to get the new index, count all tiles (visible+hidden) up to the new index received from the UI.
            for (i = 0; i < newGroup[sItems].length && visibleCounter < newLocationIndex; i++) {
                if (newGroup[sItems][i].isTileIntentSupported) {
                    if (newGroup[sItems][i] === oTile) {
                        bIsTileIncluded = true;
                    } else {
                        visibleCounter++;
                    }
                }
            }
            if (bIsTileIncluded) {
                return i - 1;
            }
            return i;
        },

        // should not be exposed
        getModel: function () {
            return this.oModel;
        },

        getDashboardView: function () {
            return this.oDashboardView;
        },

        setDashboardView: function (oDashboardView) {
            this.oDashboardView = oDashboardView;
            return this;
        },

        setTileVisible: function (oTileModel, bVisible) {
            this.oPageOperationAdapter.setTileVisible(oTileModel.object, bVisible);
        },

        refreshTile: function (oTileModel) {
            this.oPageOperationAdapter.refreshTile(oTileModel.object);
        },

        /**
         * Function to update the settings of the HomepageManager.
         * This allows us to adjust settings we might not know yet after the constructor was called.
         *
         * @param {Object} oSettings
         *      The new settings
         * @private
         */
        updateSettings: function (oSettings) {
            this.oModel = oSettings.model || this.oModel;
            this.oConfig = oSettings.config || this.oConfig;
            this.oRouter = oSettings.router || this.oRouter;
            this.oDashboardView = oSettings.view || this.oDashboardView;
        },

        /**
         * Helper function to reset groups after a backend failure
         * @param {string} sMsgId id of the localized string
         * @param {Array} aParameters parameters array
         */
        _resetGroupsOnFailure: function (sMsgId, aParameters) {
            _requestFailed();
            oMessagingHelper.showLocalizedError(sMsgId, aParameters);
            //need to reset flag, because loading group will retrigger
            this.bStartLoadRemainSegment = false;
            this.loadPersonalizedGroups();
            this.oModel.updateBindings(true);
        },

        resetGroupsOnFailure: function () {
            this._resetGroupsOnFailure.apply(this, arguments);
        },

        _bindSegment: function (aGroups, segment) {
            var segIndex, oGrp, oSegGroup, groupIndex;

            for (segIndex = 0; segIndex < segment.length; segIndex++) {
                oSegGroup = segment[segIndex];
                groupIndex = oSegGroup.index;
                oGrp = aGroups[groupIndex];
                if (oGrp) {
                    oGrp.isRendered = true;
                    oGrp.tiles = oGrp.tiles.concat(oSegGroup.tiles);
                    oGrp.links = oGrp.links.concat(oSegGroup.links);
                }
            }

            return aGroups;
        },

        createGroupsModelFrame: function (aGroups, personalization) {
            var grpsIndex,
                aCloneGroups = [],
                oOrgGroup,
                fnCreateFlatGroupClone;

            fnCreateFlatGroupClone = function (oGroup) {
                var clnGroup = jQuery.extend({}, oGroup);
                clnGroup.tiles = [];
                clnGroup.pendingLinks = [];
                clnGroup.links = [];
                return clnGroup;
            };

            for (grpsIndex = 0; grpsIndex < aGroups.length; grpsIndex++) {
                oOrgGroup = aGroups[grpsIndex];
                aCloneGroups[grpsIndex] = fnCreateFlatGroupClone(oOrgGroup);
                //group variable setup.
                aCloneGroups[grpsIndex].isRendered = false;
                aCloneGroups[grpsIndex].visibilityModes = oUtils.calcVisibilityModes(oOrgGroup, personalization);
            }

            return aCloneGroups;
        },

        _splitGroups: function (aGroups, iFirstVisibleGroupIndex) {
            var grpsIndex,
                tempSegment = [],
                segmentHeight = 0,
                bIsTabsMode = this.oModel.getProperty("/homePageGroupDisplay") === "tabs",
                iCurrentSegmentSize = 0,
                oGroup;

            var maxSegmentSize = 500;

            for (grpsIndex = 0; grpsIndex < aGroups.length; grpsIndex++) {
                oGroup = aGroups[grpsIndex];
                tempSegment.push(oGroup);

                if (!this.segmentsStore.length) {
                    // Calculate the group height (value in percentage) for the first visible segment only
                    segmentHeight += this.PagingManager.getGroupHeight(oGroup, iFirstVisibleGroupIndex === grpsIndex);
                } else {
                    // Calculate segment size based on the maximal number of tiles
                    iCurrentSegmentSize += oGroup.tiles.length + oGroup.links.length;
                }

                //There is smaller segment for the first visible group in tab mode.
                //Also set flag for loading the views if there is no blind loading
                if (bIsTabsMode && !this.segmentsStore.length && segmentHeight > 0) {
                    tempSegment.loadTilesView = true;
                    this.segmentsStore.push(tempSegment);
                    tempSegment = [];
                    segmentHeight = 0;
                }
                // First segment - check visible height (value in percentage), other segments - check size (number of tiles)
                if (segmentHeight >= 1 || iCurrentSegmentSize >= maxSegmentSize) {
                    this.segmentsStore.push(tempSegment);
                    tempSegment = [];
                    segmentHeight = 0;
                    iCurrentSegmentSize = 0;
                }
            }

            if (tempSegment.length) {
                this.segmentsStore.push(tempSegment);
            }
        },

        /**
         * Bind tiles and links from the first segment of segmentStore into group model.
         *
         * @param {Object} [modelGroups]
         * The group model to process
         *
         * @returns {Object}
         * The group model with binded tiles and links from the first segment.
         * If segmentStore is empty, return the input model without changes.
         */
        _processSegment: function (modelGroups) {
            var groupSegment = this.segmentsStore.shift();

            if (!groupSegment) {
                return modelGroups;
            }

            if (this.isBlindLoading() === false) {
                //set loadTilesView for the first segment for tabs mode
                if (this.oModel.getProperty("/homePageGroupDisplay") !== "tabs" || groupSegment.loadTilesView) {
                    this.getSegmentContentViews(groupSegment);
                }
            }
            modelGroups = this._bindSegment(modelGroups, groupSegment);
            return modelGroups;
        },

        getSegmentContentViews: function (groupSegment) {
            var nGroupSegmentIndex, nTilesIndex, oSegnmentGrp, oSegmentTile;

            for (nGroupSegmentIndex = 0; nGroupSegmentIndex < groupSegment.length; nGroupSegmentIndex++) {
                oSegnmentGrp = groupSegment[nGroupSegmentIndex];
                for (nTilesIndex = 0; nTilesIndex < oSegnmentGrp.tiles.length; nTilesIndex++) {
                    oSegmentTile = oSegnmentGrp.tiles[nTilesIndex];
                    if (oSegmentTile.isTileIntentSupported) {
                        this.getTileView(oSegmentTile);
                    }
                }

                for (nTilesIndex = 0; nTilesIndex < oSegnmentGrp.links.length; nTilesIndex++) {
                    oSegmentTile = oSegnmentGrp.links[nTilesIndex];
                    if (oSegmentTile.isTileIntentSupported) {
                        this.getTileView(oSegmentTile, oSegnmentGrp.index);
                    }
                }
            }
            this.bIsFirstSegmentViewLoaded = true;
        },

        getSegmentTabContentViews: function (sChannelId, sEventId, iProcessTileViewSegmentsForGroup) {
            var nTilesIndex, oSegmentTile,
                iSegmentsGroup = iProcessTileViewSegmentsForGroup.iSelectedGroup,
                oGroup;

            oGroup = this.oModel.getProperty("/groups/" + iSegmentsGroup);

            for (nTilesIndex = 0; nTilesIndex < oGroup.tiles.length; nTilesIndex++) {
                oSegmentTile = oGroup.tiles[nTilesIndex];

                if (oSegmentTile.isTileIntentSupported) {
                    this.getTileView(oSegmentTile);
                }
            }

            for (nTilesIndex = 0; nTilesIndex < oGroup.links.length; nTilesIndex++) {
                oSegmentTile = oGroup.links[nTilesIndex];
                if (oSegmentTile.isTileIntentSupported) {
                    this.getTileView(oSegmentTile, iSegmentsGroup);
                }
            }
        },

        /**
         * Prevent calling loadPersonalizedGroups while model is still loading.
         */
        _handleBookmarkModelUpdate: function () {
            this.bIsGroupsModelDirty = false;
            this.bGroupsModelLoadingInProcess = true;
            this.loadPersonalizedGroups();
        },

        _modelLoaded: function () {
            this.bGroupsModelLoadingInProcess = false;
            if (this.bIsGroupsModelDirty) {
                this._handleBookmarkModelUpdate();
            }
        },

        /**
         * Event handler for first segment is loaded.
         *
         * @private
         */
        handleFirstSegmentLoaded: function () {
            //Only groups from the first segment are completely loaded
            //Frames of the remain groups are copied to the model because:
            //1) To show the AnchorNavigationBar with all groups
            //2) Avoid rerendering of the DashboardContainer if there are > 2 segments (avoid "jumping" of the page)
            var aGroupModel = this.oModel.getProperty("/groups");

            if (this.aGroupsFrame) {
                Array.prototype.push.apply(aGroupModel, this.aGroupsFrame);
                this.aGroupsFrame = null;
            }
            this._initializeAnchorNavigationBar();
            //don't need to execute _processRemainingSegments, because segments was loaded when appfinder started
            if (!this.bStartLoadRemainSegment) {
                this._processRemainingSegments();
            }
        },

        /**
         * Initialize the AnchorNavigationBar so it can be rendered.
         *
         * @private
         */
        _initializeAnchorNavigationBar: function () {
            var oAnchorItemTemplate,
                oDashboardView = sap.ushell.components.getHomepageManager().getDashboardView();

            oAnchorItemTemplate = oDashboardView.getAnchorItemTemplate();
            this.oDashboardView.oAnchorNavigationBar.bindAggregation("groups", {
                path: "/groups",
                template: oAnchorItemTemplate
            });
        },

        /**
         * Manage that all tiles and links from segments will be bound to the group model.
         * The processing for each segment is executed by timeout.
         * The timeout can be configured in sap-ushell-config. The default timeout - 100ms.
         * When all segments are handled, dashboard model finished loading event is published.
         *
         * @private
         */
        _processRemainingSegments: function () {
            var aUpdatedGroupModel;

            if (this.segmentsStore.length > 0) {
                window.setTimeout(function () {
                    aUpdatedGroupModel = this._processSegment(this.oModel.getProperty("/groups"));
                    this.oModel.setProperty("/groups", aUpdatedGroupModel);
                    this.bIsFirstSegment = false;
                    this._processRemainingSegments();
                }.bind(this), 0);
            } else {
                //publish event dashboard model finished loading.
                this.bIsGroupsModelLoading = false;
                this._updateModelWithTileView(0, 0);
                oUtils.handleTilesVisibility();
                sap.ui.getCore().getEventBus().publish("launchpad", "dashboardModelContentLoaded");
                //update pin in the AppFinder
                oEventHub.emit("updateGroups", Date.now());
            }
        },

        /**
         * Set all groups to the model
         * segmentation is used to apply all groups to the model:
         * first set only set visible groups to the model
         * @param {Array} aGroups
         *      The array containing all groups (including the default group).
         */
        _setGroupModel: function (aGroups) {

            if (this.bIsGroupsModelLoading) {
                Log.info("Skip set the group model, because the group model is still loading");
                return;
            }

            var i = 0,
                indexOfDefaultGroup,
                iGroupsInModel = 0,
                numberOfVisibleTiles = 0,
                numberOfVisibleGroup = 0,
                aFirstSegmentFrame,
                iFirstSegmentSize,
                iFirstVisibleGroup = null,
                oDashboardView,
                oDashboardGroupsBox,
                aPreparedGroupModel = [];

            this.bIsGroupsModelLoading = true;
            try {
                iGroupsInModel = this.oModel.getProperty("/groups").length;
            } catch (err) {
                //can be that groups is not defined in model
            }

            for (i = aGroups.length; i < iGroupsInModel; ++i) {
                oDestroyHelper.destroyFLPAggregationModel(this.oModel.getProperty("/groups/" + i));
            }

            if (!this.PagingManager) {
                var iAvailableWidth = jQuery("#dashboardGroups").width();
                if (!iAvailableWidth) {
                    iAvailableWidth = window.innerWidth;
                }

                var iAvailableHeight = jQuery("#sapUshellDashboardPage-cont").height();
                if (iAvailableHeight < 100) {
                    iAvailableHeight = window.innerHeight;
                }
                this.PagingManager = new PagingManager("dashboardPaging", {
                    supportedElements: {
                        tile: { className: "sapUshellTile" },
                        link: { className: "sapUshellLinkTile" }
                    },
                    containerHeight: iAvailableHeight,
                    containerWidth: iAvailableWidth
                });
            }

            aGroups.forEach(function (oGroup) {
                if (oGroup.isGroupVisible) {
                    //Hidden tilesAndLinks not calculate for the bIsScrollModeAccordingKPI
                    numberOfVisibleTiles += oGroup.tiles.length;
                }
            });

            // Check if blind loading should be activated
            this.bIsScrollModeAccordingKPI = numberOfVisibleTiles > this.iMinNumOfTilesForBlindLoading;

            this.aGroupsFrame = this.createGroupsModelFrame(aGroups, this.oModel.getProperty("/personalization"));
            for (i = 0; i < this.aGroupsFrame.length; i++) {
                if (this.aGroupsFrame[i].isGroupVisible && this.aGroupsFrame[i].visibilityModes[0]) {
                    if (iFirstVisibleGroup === null) {
                        iFirstVisibleGroup = i;
                        this.aGroupsFrame[i].isGroupSelected = true;
                        this.oModel.setProperty("/iSelectedGroup", i);
                    }
                    numberOfVisibleGroup++;
                    if (numberOfVisibleGroup > 1) {
                        this.aGroupsFrame[iFirstVisibleGroup].showGroupHeader = false;
                        break;
                    }
                }
            }

            this._splitGroups(aGroups, iFirstVisibleGroup);
            iFirstSegmentSize = this.segmentsStore[0]
                ? this.segmentsStore[0].length
                : 0;
            aFirstSegmentFrame = this.aGroupsFrame.splice(0, iFirstSegmentSize);

            Measurement.start("FLP:DashboardManager._processSegment", "_processSegment", "FLP");
            //remain frames will be added to the model in handleFirstSegmentLoaded,
            //because we want to reduce the time of the loading of the first visible groups
            aPreparedGroupModel = this._processSegment(aFirstSegmentFrame);

            // save default group index

            aGroups.every(function (oGroup, iGroupIndex) {
                if (oGroup.isDefaultGroup) {
                    indexOfDefaultGroup = iGroupIndex;
                    return false;
                }
                return true;
            });
            aPreparedGroupModel.indexOfDefaultGroup = indexOfDefaultGroup;

            if (this.oModel.getProperty("/homePageGroupDisplay") === "tabs") {
                oDashboardView = this.getDashboardView();
                if (oDashboardView) { // oDashboardView may be not yet available if the AppFinder opens at start
                    oDashboardGroupsBox = oDashboardView.oDashboardGroupsBox;
                    oDashboardGroupsBox.getBinding("groups").filter([oDashboardView.oFilterSelectedGroup]);
                }
            }

            Measurement.end("FLP:DashboardManager._processSegment");

            this.oModel.setProperty("/groups", aPreparedGroupModel);
            this.aGroupModel = aPreparedGroupModel;
            //start to load other segments when first segment was completly loaded (placeholders and static views)
            if (this.oDashboardView) { //Homepage start
                oEventHub.once("firstSegmentCompleteLoaded")
                    .do(function () {
                        // the first segment has been loaded and rendered
                        // this is valid w/ and w/o blind-loading
                        oUtils.setPerformanceMark("FLP-TTI-Homepage", { bUseUniqueMark: true });
                    })
                    .do(this.handleFirstSegmentLoaded.bind(this));
            } else { //AppFinder started
                /*
                By default only visible groups loaded in the first segment. It is done in order to
                improve the performance and show first groups eairlier as possible. But, AppFinder
                is still bind to the group model and required all groups to correctly show the popover and
                pin buttons are active.
                For the cases different from homepage, we don't wait "firstSegmentCompleteLoaded" event and
                start to load remain segment.
                */
                setTimeout(function () {
                    Array.prototype.push.apply(this.aGroupModel, this.aGroupsFrame);
                    this.aGroupsFrame = null;
                    this.bStartLoadRemainSegment = true;
                    this._processRemainingSegments();
                }.bind(this), 0);
            }

            //Tiles loaded with views when there is no blindloading
            //In this case the first segment is loaded after setting the model
            if (this.bIsFirstSegmentViewLoaded) {
                oEventHub.emit("firstSegmentCompleteLoaded", true);
            }

            Measurement.end("FLP:DashboardManager.loadGroupsFromArray");
            jQuery.sap.flpmeasure.end(0, "Process & render the first segment/tiles");
        },

        getPreparedGroupModel: function () {
            return this.aGroupModel;
        },

        /**
         * Update the group in the model
         * @param {Integer} nIndex
         *      The index at which the group should be added. 0 is reserved for the default group.
         * @param {Object} oNewGroupModel
         *      The prepared group model
         */
        _loadGroup: function (nIndex, oNewGroupModel) {
            var that = this,
                sGroupPath = "/groups/" + nIndex,
                oOldGroupModel = that.oModel.getProperty(sGroupPath),
                bIsLast = oOldGroupModel.isLastGroup,
                sOldGroupId = oOldGroupModel.groupId;

            oDestroyHelper.destroyFLPAggregationModel(oOldGroupModel);

            // If the group already exists, keep the id. The backend-handlers relay on the id staying the same.
            if (sOldGroupId) {
                oNewGroupModel.groupId = sOldGroupId;
            }
            //If the server is slow and group can become the last by user actions
            oNewGroupModel.isLastGroup = bIsLast;
            oNewGroupModel.index = nIndex;
            oNewGroupModel.isRendered = true;
            this.oModel.setProperty(sGroupPath, oNewGroupModel);
        },

        _hasPendingLinks: function (aModelLinks) {
            for (var i = 0; i < aModelLinks.length; i++) {
                if (aModelLinks[i].content[0] === undefined) {
                    return true;
                }
            }
            return false;
        },

        _addModelToTileViewUpdateQueue: function (sTileUUID, oTileView) {
            //add the tile view to the update queue
            this.tileViewUpdateQueue.push({ uuid: sTileUUID, view: oTileView });
        },

        _updateModelWithTileView: function (startGroup, startTile) {
            var that = this;

            /*
            in order to avoid many updates to the model we wait to allow
            other tile update to accumulate in the queue.
            therefore we clear the previous call to update the model
            and create a new one
            */
            if (this.tileViewUpdateTimeoutID) {
                clearTimeout(this.tileViewUpdateTimeoutID);
            }
            this.tileViewUpdateTimeoutID = window.setTimeout(function () {
                that.tileViewUpdateTimeoutID = undefined;
                /*
                we wait with the update till the personalization operation is done
                to avoid the rendering of the tiles during D&D operation
                */
                that.oSortableDeferred.done(function () {
                    that._updateModelWithTilesViews(startGroup, startTile);
                });
            }, 50);
        },

        _updateGroupModelWithTilesViews: function (aTiles, startTile, handledUpdatesIndex, isLink) {
            var oTileModel,
                oUpdatedTile,
                sSize,
                bLong,
                stTile = startTile || 0;

            for (var j = stTile; j < aTiles.length; j = j + 1) {
                //group tiles loop - get the tile model
                oTileModel = aTiles[j];
                for (var q = 0; q < this.tileViewUpdateQueue.length; q++) {
                    //updated tiles view queue loop - check if the current tile was updated
                    oUpdatedTile = this.tileViewUpdateQueue[q];
                    if (oTileModel.uuid === oUpdatedTile.uuid) {
                        //mark tileViewUpdate index for removal oUpdatedTile from tileViewUpdateQueue.
                        handledUpdatesIndex.push(q);
                        if (oUpdatedTile.view) {
                            /*
                                if view is provided then we destroy the current content
                                (TileState control) and set the tile view
                                In case of link we do not have a loading link therefor we don't destroy it
                                */
                            if (isLink) {

                                oTileModel.content = [oUpdatedTile.view];
                            } else {
                                oTileModel.content[0].destroy();
                                oTileModel.content = [oUpdatedTile.view];
                            }
                            this.oDashboardLoadingManager.setTileResolved(oTileModel);

                            /*
                                in some cases tile size can be different then the initial value
                                therefore we read and set the size again
                                */
                            sSize = this.oPageOperationAdapter.getTileSize(oTileModel.object);
                            bLong = ((sSize !== null) && (sSize === "1x2")) || false;
                            if (oTileModel.long !== bLong) {
                                oTileModel.long = bLong;
                            }
                        } else {
                            //some error on getTileView, therefore we set the state to 'Failed'
                            oTileModel.content[0].setState("Failed");
                        }
                        break;
                    }
                }
            }
        },

        _updateModelWithTilesViews: function (startGroup, startTile) {
            var aGroups = this.oModel.getProperty("/groups"),
                stGroup = startGroup || 0,
                handledUpdatesIndex = [];

            if (!aGroups || this.tileViewUpdateQueue.length === 0) {
                return;
            }

            /*
            go over the tiles in the model and search for tiles to update.
            tiles are identified using uuid
            */
            for (var i = stGroup; i < aGroups.length; i = i + 1) {
                //group loop - get the groups tiles
                this._updateGroupModelWithTilesViews(aGroups[i].tiles, startTile, handledUpdatesIndex);
                if (aGroups[i].links) {
                    this._updateGroupModelWithTilesViews(aGroups[i].links, startTile, handledUpdatesIndex, true);
                    if (aGroups[i].pendingLinks.length > 0) {
                        if (!aGroups[i].links) {
                            aGroups[i].links = [];
                        }
                        aGroups[i].links = aGroups[i].links.concat(aGroups[i].pendingLinks);
                        aGroups[i].pendingLinks = [];
                    }
                }
            }

            //clear the handled updates from the tempTileViewUpdateQueue and set the model
            var tempTileViewUpdateQueue = [], tileViewUpdateQueueIndex;
            for (tileViewUpdateQueueIndex = 0; tileViewUpdateQueueIndex < this.tileViewUpdateQueue.length; tileViewUpdateQueueIndex++) {
                if (handledUpdatesIndex.indexOf(tileViewUpdateQueueIndex) === -1) {
                    tempTileViewUpdateQueue.push(this.tileViewUpdateQueue[tileViewUpdateQueueIndex]);
                }
            }
            this.tileViewUpdateQueue = tempTileViewUpdateQueue;

            this.oModel.setProperty("/groups", aGroups);
        },

        getModelTileById: function (sId, sItems) {
            var aGroups = this.oModel.getProperty("/groups"),
                oModelTile,
                bFound = false;
            aGroups.every(function (oGroup) {
                oGroup[sItems].every(function (oTile) {
                    if (oTile.uuid === sId || oTile.originalTileId === sId) {
                        oModelTile = oTile;
                        bFound = true;
                    }
                    return !bFound;
                });
                return !bFound;
            });
            return oModelTile;
        },

        _addDraggableAttribute: function (oView) {
            if (this.isIeHtml5DnD()) { //should be sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported(oTile)
                oView.addEventDelegate({
                    onAfterRendering: function () {
                        this.$().attr("draggable", "true");
                    }.bind(oView)
                });
            }
        },

        _attachLinkPressHandlers: function (oView) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oTileView = oView.attachPress ? oView : oView.getContent()[0]; // a hack to support demoContent
            oTileView.attachPress(function (oEvent) {
                var bTileBeingMoved = oView.getBindingContext().getObject().tileIsBeingMoved;
                if (!bTileBeingMoved && this.getScope && this.getScope() === "Actions") {
                    switch (oEvent.getParameters().action) {
                        case "Press":
                            var sState = oView.getState ? oView.getState() : "";
                            if (sState !== "Failed") {
                                sap.ushell.components.homepage.ActionMode._openActionsMenu(oEvent, oView); // TODO: pending dependency migration
                            }
                            break;
                        case "Remove":
                            var tileUuid = oView.getBindingContext().getObject().uuid;
                            oEventBus.publish("launchpad", "deleteTile", { tileId: tileUuid, items: "links" });
                            break;
                        default: break;
                    }
                } else {
                    oEventBus.publish("launchpad", "dashboardTileLinkClick");
                }
            });
        },

        handleDisplayModeChange: function (sNewDisplayModel) {
            this.oModel.setProperty("/homePageGroupDisplay", sNewDisplayModel);
            switch (sNewDisplayModel) {
                case "scroll":
                    this._handleDisplayModeChangeToScroll();
                    break;
                case "tabs":
                    this._handleDisplayModeChangeToTabs();
                    break;
                //no default
            }
        },

        _handleDisplayModeChangeToTabs: function () {
            var iSelectedGroup = this.oModel.getProperty("/iSelectedGroup"),
                aGroups = this.oModel.getProperty("/groups");
            if (aGroups.length > 0) {
                //update selected group based on selected anchor item
                for (var i = 0; i < aGroups.length; i++) {
                    this.oModel.setProperty("/groups/" + i + "/isGroupSelected", false);
                }

                this.oModel.setProperty("/groups/" + iSelectedGroup + "/isGroupSelected", true);
            }
        },

        _handleDisplayModeChangeToScroll: function () {
            if (this.isBlindLoading()) {
                return;
            }

            var aGroups = this.oModel.getProperty("/groups"),
                oGroup,
                aTiles,
                oTile,
                aLinks = [],
                i, j;

            for (i = 0; i < aGroups.length; i++) {
                oGroup = aGroups[i];
                aTiles = oGroup.tiles || [];
                for (j = 0; j < aTiles.length; j++) {
                    oTile = aTiles[j];
                    if (oTile.content.length === 0) {
                        this.getTileView(oTile, i);
                    }
                }
                aLinks = oGroup.links || [];
                //need to update all link views
                for (j = 0; j < aLinks.length; j++) {
                    this.getTileView(aLinks[j], i);
                }
            }
            this.oModel.refresh(false);

            var iSelectedGroupIndex = this.oModel.getProperty("/iSelectedGroup");

            if (iSelectedGroupIndex) {
                setTimeout(function () {
                    sap.ui.getCore().getEventBus().publish("launchpad", "scrollToGroup", {
                        groupId: aGroups[iSelectedGroupIndex].groupId
                    });
                }, 100);
            }
        },

        getTileViewsFromArray: function (aRequestTileViews) {
            var that = this;

            if (aRequestTileViews.length === 0) {
                return;
            }
            aRequestTileViews.forEach(function (oRequestTileView) {
                that.getTileView(oRequestTileView.oTile, oRequestTileView.iGroup);
            });
            //trigger to refresh binding.
            //It is skipped for standart tiles in getTileView and done once here (performance reason)
            //Refreshing for custom tiles is in getTileView after promise is resolved
            this.oModel.refresh(false);
            if (this.bIsFirstSegmentViewLoaded === false) {
                this.bIsFirstSegmentViewLoaded = true;
                oEventHub.emit("firstSegmentCompleteLoaded", true);
            }

        },

        /**
         * Triggers the loading of a tile, link or card
         *
         * @param {object} tileOrCard The tile, link or card
         * @param {int} groupPosition The group position
         *
         * @private
         */
        getTileView: function (tileOrCard, groupPosition) {
            var sType = this.oPageOperationAdapter.getTileType(tileOrCard.object);

            if (this.oDashboardLoadingManager.isTileViewRequestIssued(tileOrCard)) {
                // No need to get the tile view, the request was already issued.
                return;
            }
            this.oDashboardLoadingManager.setTileInProgress(tileOrCard);
            this.oPageOperationAdapter.setTileVisible(tileOrCard.object, false);
            if (sType === "card") {
                this._loadCardData(tileOrCard);
            } else {
                this._loadTileData(tileOrCard, groupPosition, sType);
            }
        },

        /**
         * Triggers the loading of the manifest for a card
         *
         * @param {object} card The card that needs to be loaded
         *
         * @private
         */
        _loadCardData: function (card) {
            var oCard = sap.ui.getCore().byId(card.controlId),
                sPerformanceHash = jQuery.sap.flpmeasure.startFunc(
                    0,
                    "Loading of data and rendering for all cards",
                    5,
                    "loadCardData",
                    card.object
                );

            if (oCard && oCard.setManifest && this.isBlindLoading()) {
                oCard.setManifest(card.manifest);
            }
            card.content = [card.manifest];
            this.oDashboardLoadingManager.setTileResolved(card);
            jQuery.sap.flpmeasure.endFunc(0, "Loading of data and rendering for all cards", sPerformanceHash);
        },

        getCurrentHiddenGroupIds: function (oModel) {
            return this.oPageOperationAdapter.getCurrentHiddenGroupIds(oModel);
        },

        /**
         * Loads the model data and enriches a tile, link or card on the homepage via bound properties
         *
         * @param {object} tile The tile or card
         * @param {int} groupPosition The group position
         * @param {string} tileType The actual type of the tile, link or card
         *
         * @private
         */
        _loadTileData: function (tile, groupPosition, tileType) {
            var that = this,
                oDfd = this.oPageOperationAdapter.getTileView(tile),
                sMode,
                aGroups,
                oGroupLinks,
                fUpdateModelWithView = this._addModelToTileViewUpdateQueue,
                oTileView,
                bNeedRefreshLinks = false,
                sTileUUID = tile.uuid,
                bSkipModelUpdate = false,
                sPerformanceHash = jQuery.sap.flpmeasure.startFunc(
                    0,
                    "Service + model binding and rendering for all tile-Views",
                    5,
                    "getTileView",
                    tile.object);

            // The Deferred is already resolved for standard tiles.
            // The goal is to update the model for standard tiles in one place in order to trigger invalidation once.
            // Dynamic tiles will update the model when the Deferred is resolved.
            if (oDfd.state() === "resolved") {
                bSkipModelUpdate = true;
            }

            // Register done and fail handlers for the getTileView API.
            oDfd.done(function (oView) {
                // Set the value of the target when the view is valid and make sure it is not a custom tile
                if (oView.oController && oView.oController.navigationTargetUrl && !tile.isCustomTile) {
                    tile.target = oView.oController.navigationTargetUrl;
                }

                oTileView = oView;

                // In CDM content, the tile's view should have this function
                if (oTileView.getComponentInstance) {
                    Measurement.average("FLP:getComponentInstance", "get info for navMode", "FLP1");
                    var oCompData = oTileView.getComponentInstance().getComponentData();

                    if (oCompData && oCompData.properties) {
                        tile.navigationMode = oCompData.properties.navigationMode;
                    }

                    Measurement.end("FLP:getComponentInstance");
                }

                that.oDashboardLoadingManager.setTileResolved(tile);
                sMode = oView.getMode ? oView.getMode() : "ContentMode";

                //If the tileType is link and the personalization is supported by the platform, the the link must support personalization
                if (that.bLinkPersonalizationSupported && sMode === "LineMode") {
                    that._attachLinkPressHandlers(oTileView);
                    that._addDraggableAttribute(oTileView);

                    if (groupPosition >= 0) {
                        aGroups = that.oModel.getProperty("/groups");

                        if (aGroups[groupPosition]) {
                            tile.content = [oTileView];
                            oGroupLinks = that.oModel.getProperty("/groups/" + groupPosition + "/links");
                            that.oModel.setProperty("/groups/" + groupPosition + "/links", []);
                            that.oModel.setProperty("/groups/" + groupPosition + "/links", oGroupLinks);
                        }
                    }
                } else if (that.isBlindLoading()) {
                    if (tile.content && tile.content.length > 0) {
                        tile.content[0].destroy();
                    }

                    tile.content = [oTileView];

                    if (groupPosition >= 0 && !bSkipModelUpdate) {
                        that.oModel.refresh(false);
                    }
                }

                if (that.isBlindLoading()) {
                    /*
                    in some cases tile size can be different then the initial value
                    therefore we read and set the size again
                    */
                    var sSize = that.oPageOperationAdapter.getTileSize(tile.object);
                    var bLong = sSize === "1x2";
                    if (tile.long !== bLong) {
                        tile.long = bLong;
                    }
                } else if (sMode === "LineMode") {
                    tile.content = [oTileView];

                    if (bNeedRefreshLinks) {
                        oGroupLinks = that.oModel.getProperty("/groups/" + groupPosition + "/links");
                        that.oModel.setProperty("/groups/" + groupPosition + "/links", []);
                        that.oModel.setProperty("/groups/" + groupPosition + "/links", oGroupLinks);
                    }
                } else if (tile.content.length === 0) {
                    tile.content = [oTileView];
                } else {
                    fUpdateModelWithView.apply(that, [sTileUUID, oTileView]);
                    that._updateModelWithTileView(0, 0);
                }

                jQuery.sap.flpmeasure.endFunc(0, "Service + model binding and rendering for all tile-Views", sPerformanceHash);
            });

            oDfd.fail(function () {
                if (that.oPageOperationAdapter.getTileType(tile.object) === "link" && that.bLinkPersonalizationSupported) {
                    // In case call is synchronise we set the view with 'TileState' control with 'Failed' status
                    oTileView = that.oPageOperationAdapter.getFailedLinkView(tile);
                    that._attachLinkPressHandlers(oTileView);
                } else {
                    oTileView = new TileState({ state: "Failed" });
                }
                tile.content = [oTileView];
            });

            if (!oTileView) {
                if (that.oPageOperationAdapter.getTileType(tile.object) === "link") {
                    bNeedRefreshLinks = true;
                    oTileView = new GenericTile({
                        mode: "LineMode"
                    });
                } else {
                    oTileView = new TileState();
                }
                tile.content = [oTileView];
            }
        },

        isIeHtml5DnD: function () {
            return (Device.browser.msie || Device.browser.edge) && (Device.system.combi || Device.system.tablet);
        },

        /*
        * Load all user groups from the backend. (Triggered on initial page load.)
        */
        loadPersonalizedGroups: function () {
            var that = this;
            var oDeferred = new jQuery.Deferred();

            this.oPageOperationAdapter.getPage().then(
                function (aGroups) {
                    that._setGroupModel(aGroups);
                    oDeferred.resolve();
                }, function () {
                    oMessagingHelper.showLocalizedError("fail_to_load_groups_msg");
                }
            );

            jQuery.sap.flpmeasure.start(0, "Service: Get Data for Dashboard", 4);
            Measurement.start("FLP:DashboardManager.loadPersonalizedGroups", "loadPersonalizedGroups", "FLP");

            return oDeferred.promise();
        }
    });
});
