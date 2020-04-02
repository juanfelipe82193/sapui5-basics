// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/_HomepageManager/PagingManager",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/ui/Device",
    "sap/ui/core/library",
    "sap/ui/model/Context",
    "sap/m/MessageToast",
    "sap/ushell/Config",
    "sap/ushell/services/AppType"
], function (
    PagingManager,
    jQuery,
    resources,
    Filter,
    FilterOperator,
    mobileLibrary,
    Device,
    coreLibrary,
    Context,
    MessageToast,
    Config,
    AppType
) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    // shortcut for sap.m.SplitAppMode
    var SplitAppMode = mobileLibrary.SplitAppMode;

    /* global hasher */

    sap.ui.controller("sap.ushell.components.appfinder.Catalog", {
        oPopover: null,
        onInit: function () {
            // take the sub-header model
            this.categoryFilter = "";
            this.preCategoryFilter = "";
            this.oMainModel = this.oView.getModel();
            this.oSubHeaderModel = this.oView.getModel("subHeaderModel");
            this.resetPage = false;
            this.bIsInProcess = false;

            var that = this;
            sap.ui.getCore().byId("catalogSelect").addEventDelegate({
                onBeforeRendering: this.onBeforeSelectRendering
            }, this);
            var oRouter = this.getView().parentComponent.getRouter();
            oRouter.attachRouteMatched(function (oEvent) {
                that.onShow(oEvent);
            });
            this.timeoutId = 0;

            document.subHeaderModel = this.oSubHeaderModel;
            document.mainModel = this.oMainModel;

            // init listener for the toggle button bindig context
            var oToggleButtonModelBinding = this.oSubHeaderModel.bindProperty("/openCloseSplitAppButtonToggled");
            oToggleButtonModelBinding.attachChange(that.handleToggleButtonModelChanged.bind(this));

            this.oView.oCatalogsContainer.setHandleSearchCallback(that.handleSearchModelChanged.bind(this));
        },

        onBeforeRendering: function () {
            // Invoking loading of all catalogs here instead of 'onBeforeShow' as it improves the perceived performance.
            // Fix of incident#:1570469901
            sap.ui.getCore().getEventBus().publish("renderCatalog");
        },

        onAfterRendering: function () {
            this.wasRendered = true;
            // disable swipe gestures -> never show master in Portait mode
            if (!this.PagingManager) {
                this._setPagingManager();
            }

            // just the first time
            if (this.PagingManager.currentPageIndex === 0) {
                this.allocateNextPage();
            }

            jQuery(window).resize(function () {
                var windowWidth = jQuery(window).width(),
                    windowHeight = jQuery(window).height();

                this.PagingManager.setContainerSize(windowWidth, windowHeight);
            }.bind(this));
            this._handleAppFinderWithDocking();
            sap.ui.getCore().getEventBus().subscribe("launchpad", "appFinderWithDocking", this._handleAppFinderWithDocking, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appFinderAfterNavigate", this._handleAppFinderAfterNavigate, this);
        },

        _setPagingManager: function () {
            this.lastCatalogId = 0;
            this.PagingManager = new PagingManager("catalogPaging", {
                supportedElements: {
                    tile: { className: "sapUshellTile" }
                },
                containerHeight: window.innerHeight,
                containerWidth: window.innerWidth
            });

            // we need PagingManager in CatalogContainer in order to allocate page if catalog is selected.
            this.getView().getCatalogContainer().setPagingManager(this.PagingManager);
        },

        _decodeUrlFilteringParameters: function (sUrlParameters) {
            var oUrlParameters;
            try {
                oUrlParameters = JSON.parse(sUrlParameters);
            } catch (e) {
                oUrlParameters = sUrlParameters;
            }
            var hashTag = (oUrlParameters && oUrlParameters.tagFilter && oUrlParameters.tagFilter) || [];

            if (hashTag) {
                try {
                    this.tagFilter = JSON.parse(hashTag);
                } catch (e) {
                    this.tagFilter = [];
                }
            } else {
                this.tagFilter = [];
            }

            this.categoryFilter = (oUrlParameters && oUrlParameters.catalogSelector && oUrlParameters.catalogSelector) || this.categoryFilter;
            if (this.categoryFilter) {
                this.categoryFilter = window.decodeURIComponent(this.categoryFilter);
            }
            this.searchFilter = (oUrlParameters && oUrlParameters.tileFilter && oUrlParameters.tileFilter) || null;
            if (this.searchFilter) {
                this.searchFilter = window.decodeURIComponent(this.searchFilter);
            }
        },

        _applyFilters: function (wasRendered) {
            var shouldFocusOnCategory = false;

            if (this.categoryFilter) {
                // If all is selected pass an empty string.
                this.categoryFilter = resources.i18n.getText("all") === this.categoryFilter ? "" : this.categoryFilter;
                if (this.categoryFilter !== this.preCategoryFilter) {
                    shouldFocusOnCategory = true;
                }
                this.oView.setCategoryFilterSelection(this.categoryFilter, shouldFocusOnCategory);
            } else {
                shouldFocusOnCategory = true;
                this.oView.setCategoryFilterSelection("", shouldFocusOnCategory);
            }
            this.preCategoryFilter = this.categoryFilter;

            if (this.searchFilter && this.searchFilter.length) {
                // Remove all asterisks from search query before applying the filter
                this.searchFilter = this.searchFilter.replace(/\*/g, "");
                this.searchFilter = this.searchFilter.trim();
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: true,
                    searchTerm: this.searchFilter
                });
            } else if (wasRendered) {
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: false,
                    searchTerm: ""
                });
                this.resetPage = true;
            }

            if (this.tagFilter && this.tagFilter.length) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: true,
                    selectedTags: this.tagFilter
                });
            } else if (wasRendered) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: false,
                    selectedTags: []
                });
                this.resetPage = true;
            }

            this.handleSearchModelChanged();
        },

        _handleAppFinderAfterNavigate: function () {
            this.clearFilters();
        },

        clearFilters: function () {
            var shouldFocusOnCategory = false;
            if (this.categoryFilter !== this.preCategoryFilter) {
                shouldFocusOnCategory = true;
            }
            var bSearchMode = this.oSubHeaderModel.getProperty("/search/searchMode"),
                bTagMode = this.oSubHeaderModel.getProperty("/tag/tagMode");

            // if a search was made before
            if (bSearchMode) {
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: true,
                    searchTerm: ""
                });
            }

            if (bTagMode) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: true,
                    selectedTags: []
                });
            }

            if (this.categoryFilter && this.categoryFilter !== "") {
                this.selectedCategoryId = undefined;
                this.categoryFilter = undefined;
                this.getView().getModel().setProperty("/categoryFilter", "");
                this.oView.setCategoryFilterSelection("", shouldFocusOnCategory);
            }

            this.preCategoryFilter = this.categoryFilter;
            this.handleSearchModelChanged();
        },

        onShow: function (oEvent) {
            // if the user goes to the catalog directly (not via the homepage) we must close the loading dialog
            var sUrlParameters = oEvent.getParameter("arguments").filters;

            jQuery.extend(this.getView().getViewData(), oEvent);
            this._decodeUrlFilteringParameters(sUrlParameters);

            // If onAfterRendering was called before and we got here from Home (and not via appfinder inner navigation),
            // then this means we need to reset all filters and present the page as if it's opened for the first time.
            if (this.wasRendered && !sUrlParameters) {
                this.clearFilters();
            } else { // This means we are navigating within the appFinder, or this is the first time the appFinder is opened.
                this._applyFilters(this.wasRendered);
            }
        },

        allocateNextPage: function () {
            var oCatalogContainer = this.getView().getCatalogContainer();
            if (!oCatalogContainer.nAllocatedUnits || oCatalogContainer.nAllocatedUnits === 0) {
                // calculate the number of tiles in the page.
                this.PagingManager.moveToNextPage();
                this.allocateTiles = this.PagingManager._calcElementsPerPage();
                oCatalogContainer.applyPagingCategoryFilters(this.allocateTiles, this.categoryFilter);
            }
        },

        onBeforeSelectRendering: function () {
            var oSelect = sap.ui.getCore().byId("catalogSelect"),
                aItems = jQuery.grep(oSelect.getItems(), jQuery.proxy(function (oItem) {
                    return oItem.getBindingContext().getObject().title === this.categoryFilter;
                }, this));

            if (!aItems.length && oSelect.getItems()[0]) {
                aItems.push(oSelect.getItems()[0]);
            }
        },

        setTagsFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: this.categoryFilter ? this.categoryFilter : "All",
                tileFilter: (this.searchFilter && this.searchFilter.length) ? encodeURIComponent(this.searchFilter) : "",
                tagFilter: aFilter.length ? JSON.stringify(aFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        setCategoryFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: aFilter,
                tileFilter: this.searchFilter ? encodeURIComponent(this.searchFilter) : "",
                tagFilter: this.tagFilter.length ? JSON.stringify(this.tagFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        setSearchFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: this.categoryFilter ? this.categoryFilter : "All",
                tileFilter: aFilter ? encodeURIComponent(aFilter) : "",
                tagFilter: this.tagFilter.length ? JSON.stringify(this.tagFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        onSearch: function (searchExp) {
            var sActiveMenu = this.oSubHeaderModel.getProperty("/activeMenu");
            if (this.oView.getId().indexOf(sActiveMenu) !== -1) {
                var searchTerm = searchExp.searchTerm ? searchExp.searchTerm : "";
                this.setSearchFilter(searchTerm);
            } else {
                // For the edge case in which we return to the catalog after exsiting search mode in the EAM.
                this._restoreSelectedMasterItem();
            }
        },

        onTag: function (tagExp) {
            var sActiveMenu = this.oSubHeaderModel.getProperty("/activeMenu");
            if (this.oView.getId().indexOf(sActiveMenu) !== -1) {
                var tags = tagExp.selectedTags ? tagExp.selectedTags : [];
                this.setTagsFilter(tags);
            } else {
                // For the edge case in which we return to the catalog after exsiting search mode in the EAM.
                this._restoreSelectedMasterItem();
            }

        },

        /**
         * Returns the group context path string as kept in the model
         *
         * @returns {string} Group context
         */
        getGroupContext: function () {
            var oModel = this.getView().getModel(),
                sGroupContext = oModel.getProperty("/groupContext/path");

            return sGroupContext || "";
        },

        _isTagFilteringChanged: function (aSelectedTags) {
            var bSameLength = aSelectedTags.length === this.tagFilter.length,
                bIntersect = bSameLength;

            // Checks whether there's a symmetric difference between the currently selected tags and those persisted in the URL.
            if (!bIntersect) {
                return true;
            }
            aSelectedTags.some(function (sTag) {
                bIntersect = this.tagFilter && Array.prototype.indexOf.call(this.tagFilter, sTag) !== -1;

                return !bIntersect;
            }.bind(this));

            return bIntersect;
        },

        _setUrlWithTagsAndSearchTerm: function (sSearchTerm, aSelectedTags) {
            var oUrlParameterObject = {
                tileFilter: sSearchTerm && sSearchTerm.length ? encodeURIComponent(sSearchTerm) : "",
                tagFilter: aSelectedTags.length ? JSON.stringify(aSelectedTags) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };

            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oUrlParameterObject)
            });
        },

        handleSearchModelChanged: function () {
            var bSearchMode = this.oSubHeaderModel.getProperty("/search/searchMode"),
                bTagMode = this.oSubHeaderModel.getProperty("/tag/tagMode"),
                sPageName,
                sSearchTerm = this.oSubHeaderModel.getProperty("/search/searchTerm"),
                aSelectedTags = this.oSubHeaderModel.getProperty("/tag/selectedTags"),
                otagFilter,
                otagFilterWrapper,
                oSearchFilterWrapper,
                aFilters = [],
                oFilters;

            if (!this.PagingManager) {
                this._setPagingManager();
            }
            this.PagingManager.resetCurrentPageIndex();
            this.nAllocatedTiles = 0;
            this.PagingManager.moveToNextPage();
            this.allocateTiles = this.PagingManager._calcElementsPerPage();
            this.oView.oCatalogsContainer.updateAllocatedUnits(this.allocateTiles);
            this.oView.oCatalogsContainer.resetCatalogPagination();

            var oPage = sap.ui.getCore().byId("catalogTilesDetailedPage");
            if (oPage) {
                oPage.scrollTo(0, 0);
            }

            // if view ID does not contain the active menu then return

            if (bSearchMode || bTagMode || this.resetPage) {
                if (aSelectedTags && aSelectedTags.length > 0) {
                    otagFilter = new Filter("tags", "EQ", "v");
                    otagFilter.fnTest = function (oTags) {
                        var ind, filterByTag;
                        if (aSelectedTags.length === 0) {
                            return true;
                        }

                        for (ind = 0; ind < aSelectedTags.length; ind++) {
                            filterByTag = aSelectedTags[ind];
                            if (oTags.indexOf(filterByTag) === -1) {
                                return false;
                            }
                        }
                        return true;
                    };

                    otagFilterWrapper = new Filter([otagFilter], true);
                }

                // Remove all asterisks from search query before applying the filter
                sSearchTerm = sSearchTerm ? sSearchTerm.replace(/\*/g, "") : sSearchTerm;

                if (sSearchTerm) {
                    var aSearchTermParts = sSearchTerm.split(/[\s,]+/);
                    // create search filter with all the parts for keywords and apply AND operator ('true' indicates that)
                    var keywordsSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("keywords", FilterOperator.Contains, value));
                    }), true);

                    // create search filter with all the parts for title and apply AND operator ('true' indicates that)
                    var titleSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("title", FilterOperator.Contains, value));
                    }), true);

                    // create search filter with all the parts for subtitle and apply AND operator ('true' indicates that)
                    var subtitleSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("subtitle", FilterOperator.Contains, value));
                    }), true);

                    aFilters.push(keywordsSearchFilter);
                    aFilters.push(titleSearchFilter);
                    aFilters.push(subtitleSearchFilter);
                    oSearchFilterWrapper = new Filter(aFilters, false); // false mean OR between the search filters
                }

                var catalogs = this.oView.oCatalogsContainer.getCatalogs();
                this.oSearchResultsTotal = [];
                var that = this;

                // construct group filter for tag & search
                if (otagFilterWrapper && otagFilterWrapper.aFilters.length > 0 && oSearchFilterWrapper) {
                    oFilters = new Filter([oSearchFilterWrapper].concat([otagFilterWrapper]), true);
                } else if (otagFilterWrapper && otagFilterWrapper.aFilters.length > 0) {
                    oFilters = new Filter([otagFilterWrapper], true);
                } else if (oSearchFilterWrapper && oSearchFilterWrapper.aFilters.length > 0) {
                    oFilters = new Filter([oSearchFilterWrapper], true);
                }

                catalogs.forEach(function (myCatalog) {
                    myCatalog.getBinding("customTilesContainer").filter(oFilters);
                    myCatalog.getBinding("appBoxesContainer").filter(oFilters);

                });
                this.oView.oCatalogsContainer.bSearchResults = false;

                // Before the filtering - there was a paging mechanism that turned bottom catalogs to invisible
                // Now after filtering - there are new AllocatedUnits, so we send them to
                this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits, this.categoryFilter);
                this.bSearchResults = this.oView.oCatalogsContainer.bSearchResults;

                this.oView.splitApp.toDetail(that.getView()._calculateDetailPageId());

                this.resetPage = false;
            } else {
                this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits, this.categoryFilter);
            }
            sPageName = this.getView()._calculateDetailPageId();
            this.oView.splitApp.toDetail(sPageName);
        },

        _handleAppFinderWithDocking: function () {
            // check if docking
            if (jQuery(".sapUshellContainerDocked").length > 0) {
                // 710 is the size of sap.ui.Device.system.phone
                // 1024 docking supported only in L size.
                if (jQuery("#mainShell").width() < 710) {
                    if (window.innerWidth < 1024) {
                        this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", false);
                        this.oView.splitApp.setMode(SplitAppMode.ShowHideMode);
                    } else {
                        this.oView.splitApp.setMode(SplitAppMode.HideMode);
                        this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", true);
                    }
                } else {
                    this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", false);
                    this.oView.splitApp.setMode(SplitAppMode.ShowHideMode);
                }
            }
        },

        _restoreSelectedMasterItem: function () {
            var oCatalogsList = this.oView.splitApp.getMasterPage("catalogSelect"),
                oOrigSelectedListItem = sap.ui.getCore().byId(this.selectedCategoryId);

            if (oOrigSelectedListItem) {
                this.categoryFilter = oOrigSelectedListItem.getTitle();
            }
            oCatalogsList.setSelectedItem(oOrigSelectedListItem);
        },

        handleToggleButtonModelChanged: function () {
            var bButtonVisible = this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible"),
                bButtonToggled = this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonToggled");

            // if there was a change in the boolean toogled flag
            // (this can be called via upadte to subheader model from AppFinder, in such a case we do not need to switch the views)
            if ((bButtonToggled !== this.bCurrentButtonToggled) && bButtonVisible) {
                // for device which is not a Phone
                if (!Device.system.phone) {
                    if (bButtonToggled && !this.oView.splitApp.isMasterShown()) {
                        this.oView.splitApp.showMaster();
                    } else if (this.oView.splitApp.isMasterShown()) {
                        this.oView.splitApp.hideMaster();
                    }
                    // for Phone the split app is behaving differently
                } else if (this.oView.splitApp.isMasterShown()) {
                    // calculate the relevant detailed page to nav to
                    var oDetail = sap.ui.getCore().byId(this.getView()._calculateDetailPageId());
                    this.oView.splitApp.toDetail(oDetail);
                } else if (bButtonToggled) {
                    // go to master
                    var oCatalogSelectMaster = sap.ui.getCore().byId("catalogSelect");
                    this.oView.splitApp.toMaster(oCatalogSelectMaster, "show");
                }
            }

            this.bCurrentButtonToggled = bButtonToggled;
        },

        _handleCatalogListItemPress: function (oEvent) {
            this.onCategoryFilter(oEvent);
            // eliminate the Search and Tag mode.
            if (this.oSubHeaderModel.getProperty("/search/searchTerm") !== "") {
                this.oSubHeaderModel.setProperty("/search/searchMode", true);
            }

            // on phone, we must make sure the toggle button gets untoggled on every navigation in the master page
            if (Device.system.phone || Device.system.tablet) {
                this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", !this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled"));
            }
        },

        onCategoryFilter: function (oEvent) {
            var oMasterList = oEvent.getSource(),
                oSelectedCatalog = oMasterList.getSelectedItem(),
                oSelectedCatalogBindingCtx = oSelectedCatalog.getBindingContext(),
                oModel = oSelectedCatalogBindingCtx.getModel();
            if (oModel.getProperty("static", oSelectedCatalogBindingCtx)) { // show all categories
                oModel.setProperty("/showCatalogHeaders", true);
                this.setCategoryFilter();
                this.selectedCategoryId = undefined;
                this.categoryFilter = undefined;
            } else { // filter to category
                oModel.setProperty("/showCatalogHeaders", false);
                this.setCategoryFilter(window.encodeURIComponent(oSelectedCatalog.getBindingContext().getObject().title));
                this.categoryFilter = oSelectedCatalog.getTitle();
                this.selectedCategoryId = oSelectedCatalog.getId();
            }
        },

        onTileAfterRendering: function (oEvent) {
            var jqTile = jQuery(oEvent.oSource.getDomRef()),
                jqTileInnerTile = jqTile.find(".sapMGT");

            jqTileInnerTile.attr("tabindex", "-1");
        },

        catalogTilePress: function (/*oController*/) {
            sap.ui.getCore().getEventBus().publish("launchpad", "catalogTileClick");
        },

        onAppBoxPressed: function (oEvent) {
            var oAppBox = oEvent.getSource(),
                oTile = oAppBox.getBindingContext().getObject(),
                fnPressHandler;
            if (oEvent.mParameters.srcControl.$().closest(".sapUshellPinButton").length) {
                return;
            }

            fnPressHandler = sap.ushell.Container.getService("LaunchPage").getAppBoxPressHandler(oTile);

            if (fnPressHandler) {
                fnPressHandler(oTile);
            } else {
                var sUrl = oAppBox.getProperty("url");

                if (sUrl && sUrl.indexOf("#") === 0) {
                    hasher.setHash(sUrl);
                } else {
                    // add the URL to recent activity log
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: oAppBox.getProperty("title"),
                                appType: AppType.URL,
                                url: sUrl,
                                appId: sUrl
                            };
                            sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                        }

                    window.open(sUrl, "_blank");
                }
            }
        },

        /**
         * Event handler triggered if tile should be added to the default group.
         *
         * @param {sap.ui.base.Event} oEvent the event object.
         *   It is expected that the binding context of the event source points to the tile to add.
         */
        onTilePinButtonClick: function (oEvent) {
            var launchPageService = sap.ushell.Container.getService("LaunchPage");
            var oDefaultGroupPromise = launchPageService.getDefaultGroup();

            oDefaultGroupPromise.done(function (oDefaultGroup) {
                var clickedObject = oEvent.getSource(),
                    oSourceContext = clickedObject.getBindingContext(),
                    oModel = this.getView().getModel(),
                    sGroupModelPath = oModel.getProperty("/groupContext/path");

                // Check if the catalog was opened in the context of a group, according to the groupContext ("/groupContext/path") in the model
                if (sGroupModelPath) {
                    this._handleTileFooterClickInGroupContext(oSourceContext, sGroupModelPath);

                    // If the catalog wasn't opened in the context of a group - the action of clicking a catalog tile should open the groups popover
                } else {
                    var groupList = oModel.getProperty("/groups");
                    var launchPageService = sap.ushell.Container.getService("LaunchPage");
                    var catalogTile = this.getCatalogTileDataFromModel(oSourceContext);
                    var tileGroups = catalogTile.tileData.associatedGroups;
                    var aGroupsInitialState = [];
                    var groupsData = groupList.map(function (group) {
                        var realGroupID,
                            selected,
                            oTemp;

                        // Get the group's real ID
                        realGroupID = launchPageService.getGroupId(group.object);
                        // Check if the group (i.e. real group ID) exists in the array of groups that contain the relevant Tile
                        // if so - the check box that represents this group should be initially selected
                        selected = !((tileGroups && Array.prototype.indexOf.call(tileGroups, realGroupID) === -1));
                        oTemp = {
                            id: realGroupID,
                            title: this._getGroupTitle(oDefaultGroup, group.object),
                            selected: selected
                        };
                        // Add the group to the array that keeps the groups initial state mainly whether or not the group included the relevant tile
                        aGroupsInitialState.push(oTemp);

                        return {
                            selected: selected,
                            initiallySelected: selected,
                            oGroup: group
                        };
                    }.bind(this));

                    // @TODO: Instead of the jQuery, we should maintain the state of the popover (i.e. opened/closed)
                    // using the afterOpen and afterClose events of sap.m.ResponsivePopover
                    var oPopoverView = sap.ui.getCore().byId("sapUshellGroupsPopover");
                    var tileTitle;
                    if (!oPopoverView) {
                        tileTitle = launchPageService.getCatalogTilePreviewTitle(oModel.getProperty(oSourceContext.sPath).src);
                        if (!tileTitle) {
                            tileTitle = launchPageService.getCatalogTileTitle(oModel.getProperty(oSourceContext.sPath).src);
                        }
                        var popoverView = new sap.ui.view("sapUshellGroupsPopover", {
                            type: ViewType.JS,
                            viewName: "sap.ushell.components.appfinder.GroupListPopover",
                            viewData: {
                                groupData: groupsData,
                                title: tileTitle,
                                enableHideGroups: oModel.getProperty("/enableHideGroups"),
                                enableHelp: oModel.getProperty("/enableHelp"),
                                sourceContext: oSourceContext,
                                catalogModel: this.getView().getModel(),
                                catalogController: this
                            }
                        });
                        popoverView.getController().setSelectedStart(aGroupsInitialState);
                        popoverView.open(clickedObject).then(this._handlePopoverResponse.bind(this, oSourceContext, catalogTile));
                    }
                }
            }.bind(this));
        },

        _getGroupTitle: function (oDefaultGroup, oGroupObject) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                title;
            // check if is it a default group- change title to "my home".
            if (oDefaultGroup && (oLaunchPageService.getGroupId(oDefaultGroup) === oLaunchPageService.getGroupId(oGroupObject))) {
                title = resources.i18n.getText("my_group");
            } else {
                title = oLaunchPageService.getGroupTitle(oGroupObject);
            }
            return title;
        },

        _handlePopoverResponse: function (oSourceContext, catalogTile, responseData) {
            if (!responseData.addToGroups.length && !responseData.newGroups.length && !responseData.removeFromGroups.length) {
                return;
            }

            var oModel = this.getView().getModel();
            var groupList = oModel.getProperty("/groups");
            var promiseList = [];

            responseData.addToGroups.forEach(function (group) {
                var index = groupList.indexOf(group);
                var oGroupContext = new Context(oModel, "/groups/" + index);
                var promise = this._addTile(oSourceContext, oGroupContext);
                promiseList.push(promise);
            }.bind(this));
            responseData.removeFromGroups.forEach(function (group) {
                var tileCatalogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                var index = groupList.indexOf(group);
                var promise = this._removeTile(tileCatalogId, index);
                promiseList.push(promise);
            }.bind(this));
            responseData.newGroups.forEach(function (group) {
                var sNewGroupName = (group.length > 0) ? group : resources.i18n.getText("new_group_name");
                var promise = this._createGroupAndSaveTile(oSourceContext, sNewGroupName);
                promiseList.push(promise);
            }.bind(this));

            jQuery.when.apply(jQuery, promiseList).then(function () {
                var resultList = Array.prototype.slice.call(arguments);
                this._handlePopoverGroupsActionPromises(catalogTile, responseData, resultList);
            }.bind(this));
        },

        _handlePopoverGroupsActionPromises: function (catalogTile, popoverResponse, resultList) {
            var errorList = resultList.filter(function (result) {
                return !result.status;
            });
            if (errorList.length) {
                var oErrorMessageObj = this.prepareErrorMessage(errorList, catalogTile.tileData.title);
                var catalogsMgr = sap.ushell.components.getCatalogsManager();
                catalogsMgr.resetAssociationOnFailure(oErrorMessageObj.messageId, oErrorMessageObj.parameters);
                return;
            }

            var tileGroupsIdList = [];
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
            popoverResponse.allGroups.forEach(function (group) {
                if (group.selected) {
                    var realGroupID = oLaunchPageService.getGroupId(group.oGroup.object);
                    tileGroupsIdList.push(realGroupID);
                }
            });
            var oModel = this.getView().getModel();
            if (popoverResponse.newGroups.length) {
                var dashboardGroups = oModel.getProperty("/groups");
                var newDashboardGroups = dashboardGroups.slice(dashboardGroups.length - popoverResponse.newGroups.length);
                newDashboardGroups.forEach(function (newGroup) {
                    var realGroupID = oLaunchPageService.getGroupId(newGroup.object);
                    tileGroupsIdList.push(realGroupID);
                });
            }

            oModel.setProperty(catalogTile.bindingContextPath + "/associatedGroups", tileGroupsIdList);
            var firstAddedGroupTitle = (popoverResponse.addToGroups[0]) ? popoverResponse.addToGroups[0].title : "";
            if (!firstAddedGroupTitle.length && popoverResponse.newGroups.length) {
                firstAddedGroupTitle = popoverResponse.newGroups[0];
            }
            var firstRemovedGroupTitle = (popoverResponse.removeFromGroups[0]) ? popoverResponse.removeFromGroups[0].title : "";
            var sDetailedMessage = this.prepareDetailedMessage(catalogTile.tileData.title, popoverResponse.addToGroups.length + popoverResponse.newGroups.length,
                popoverResponse.removeFromGroups.length, firstAddedGroupTitle, firstRemovedGroupTitle);
            MessageToast.show(sDetailedMessage, {
                duration: 3000, // default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        _getCatalogTileIndexInModel: function (oSourceContext) {
            var tilePath = oSourceContext.sPath,
                tilePathPartsArray = tilePath.split("/"),
                tileIndex = tilePathPartsArray[tilePathPartsArray.length - 1];

            return tileIndex;
        },

        _handleTileFooterClickInGroupContext: function (oSourceContext, sGroupModelPath) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oModel = this.getView().getModel(),
                catalogTile = this.getCatalogTileDataFromModel(oSourceContext),
                aAssociatedGroups = catalogTile.tileData.associatedGroups,
                oGroupModel = oModel.getProperty(sGroupModelPath), // Get the model of the group according to the group's model path (e.g. "groups/4")
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupId) : -1,
                tilePath = catalogTile.bindingContextPath,
                oGroupContext,
                oAddTilePromise,
                oRemoveTilePromise,
                sTileCataogId,
                groupIndex,
                that = this;

            if (catalogTile.isBeingProcessed) {
                return;
            }
            oModel.setProperty(tilePath + "/isBeingProcessed", true);
            // Check if this catalog tile already exist in the relevant group
            if (iCatalogTileInGroup === -1) {
                oGroupContext = new Context(oSourceContext.getModel(), sGroupModelPath);
                oAddTilePromise = this._addTile(oSourceContext, oGroupContext);

                // Function createTile of Dashboard manager always calls defferred.resolve,
                // and the success/failure indicator is the returned data.status
                oAddTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, true);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, true);
                    }
                });
                oAddTilePromise.always(function () {
                    oModel.setProperty(tilePath + "/isBeingProcessed", false);
                });
            } else {
                sTileCataogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                groupIndex = sGroupModelPath.split("/")[2];
                oRemoveTilePromise = this._removeTile(sTileCataogId, groupIndex);

                // Function deleteCatalogTileFromGroup of Catalogs manager always calls defferred.resolve,
                // and the success/failure indicator is the returned data.status
                oRemoveTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, false);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, false);
                    }
                });
                oRemoveTilePromise.always(function () {
                    oModel.setProperty(tilePath + "/isBeingProcessed", false);
                });
            }
        },

        /**
         * Handles success of add/remove tile action in group context.
         * Updates the model and shows an appropriate message to the user.
         *
         * @param {object} oSourceContext oSourceContext
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationSucceeded: function (oSourceContext, oCatalogTileModel, oGroupModel, bTileAdded) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                aAssociatedGroups = oCatalogTileModel.tileData.associatedGroups,
                detailedMessage,
                i;

            // Check if this is an "add tile to group" action
            if (bTileAdded) {
                // Update the associatedGroups array of the catalog tile
                aAssociatedGroups.push(sGroupId);

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty(oCatalogTileModel.bindingContextPath + "/associatedGroups", aAssociatedGroups);

                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 1, 0, oGroupModel.title, "");
            } else {
                // If this is a "remove tile from group" action

                // Update the associatedGroups array of the catalog tile
                for (i in aAssociatedGroups) {
                    if (aAssociatedGroups[i] === sGroupId) {
                        aAssociatedGroups.splice(i, 1);
                        break;
                    }
                }

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty(oCatalogTileModel.bindingContextPath + "/associatedGroups", aAssociatedGroups);
                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 0, 1, "", oGroupModel.title);
            }

            MessageToast.show(detailedMessage, {
                duration: 3000, // default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        /**
         * Handles failure of add/remove tile action in group context.
         * Shows an appropriate message to the user.
         * Don't need to reload the groups model, because groups update only after success API call.
         *
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationFailed: function (oCatalogTileModel, oGroupModel, bTileAdded) {
            var catalogsMgr = sap.ushell.components.getCatalogsManager(),
                oErrorMessage;

            if (bTileAdded) {
                oErrorMessage = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title] });
            } else {
                oErrorMessage = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title] });
            }

            catalogsMgr.notifyOnActionFailure(oErrorMessage.messageId, oErrorMessage.parameters);
        },

        prepareErrorMessage: function (aErroneousActions, sTileTitle) {
            var oGroup,
                sAction,
                sFirstErroneousAddGroup,
                sFirstErroneousRemoveGroup,
                iNumberOfFailAddActions = 0,
                iNumberOfFailDeleteActions = 0,
                bCreateNewGroupFailed = false,
                message;

            for (var index in aErroneousActions) {
                // Get the data of the error (i.e. action name and group object)

                oGroup = aErroneousActions[index].group;
                sAction = aErroneousActions[index].action;

                if (sAction === "add") {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else if (sAction === "remove") {
                    iNumberOfFailDeleteActions++;
                    if (iNumberOfFailDeleteActions === 1) {
                        sFirstErroneousRemoveGroup = oGroup.title;
                    }
                } else if (sAction === "addTileToNewGroup") {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else {
                    bCreateNewGroupFailed = true;
                }
            }
            // First - Handle bCreateNewGroupFailed
            if (bCreateNewGroupFailed) {
                if (aErroneousActions.length === 1) {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_create_new_group" });
                } else {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_some_actions" });
                }
                // Single error - it can be either one add action or one remove action
            } else if (aErroneousActions.length === 1) {
                if (iNumberOfFailAddActions) {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_group", parameters: [sTileTitle, sFirstErroneousAddGroup] });
                } else {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_group", parameters: [sTileTitle, sFirstErroneousRemoveGroup] });
                }
                // Many errors (iErrorCount > 1) - it can be several remove actions, or several add actions, or a mix of both
            } else if (iNumberOfFailDeleteActions === 0) {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_several_groups", parameters: [sTileTitle] });
            } else if (iNumberOfFailAddActions === 0) {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_several_groups", parameters: [sTileTitle] });
            } else {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_some_actions" });
            }
            return message;
        },

        prepareDetailedMessage: function (tileTitle, numberOfAddedGroups, numberOfRemovedGroups, firstAddedGroupTitle, firstRemovedGroupTitle) {
            var message;

            if (numberOfAddedGroups === 0) {
                if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups === 1) {
                if (numberOfRemovedGroups === 0) {
                    message = resources.i18n.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]);
                } else if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups > 1) {
                if (numberOfRemovedGroups === 0) {
                    message = resources.i18n.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups]);
                } else if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups, numberOfRemovedGroups]);
                }
            }
            return message;
        },

        /**
         * @param {Object} oSourceContext model context
         * @returns {Object} Returns the part of the model that contains the IDs of the groups that contain the relevant Tile
         */
        getCatalogTileDataFromModel: function (oSourceContext) {
            var sBindingCtxPath = oSourceContext.getPath(),
                oModel = oSourceContext.getModel(),
                oTileData = oModel.getProperty(sBindingCtxPath);

            // Return an object containing the Tile in the CatalogTiles Array (in the model) ,its index and whether it's in the middle of add/removal proccess.
            return {
                tileData: oTileData,
                bindingContextPath: sBindingCtxPath,
                isBeingProcessed: oTileData.isBeingProcessed
            };
        },

        /**
         * Send request to add a tile to a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext the catalog tile to add
         * @param {sap.ui.model.Context} oGroupContext the group where the tile should be added
         * @returns {Object} deferred
         * @private
         */
        _addTile: function (oTileContext, oGroupContext) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.createTile({
                    catalogTileContext: oTileContext,
                    groupContext: oGroupContext
                });

            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to delete a tile from a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {Number} tileCatalogId the id of the tile
         * @param {Number} index the index of the group in the model
         * @returns {Object} deferred
         * @private
         */
        _removeTile: function (tileCatalogId, index) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.deleteCatalogTileFromGroup({
                    tileId: tileCatalogId,
                    groupIndex: index
                });

            // The function deleteCatalogTileFromGroup always results in deferred.resolve
            // and the actual result of the action (success/failure) is contained in the data object
            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to create a new group and add a tile to this group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext the catalog tile to add
         * @param {String} newGroupName the name of the new group where the tile should be added
         * @returns {Object} deferred
         * @private
         */
        _createGroupAndSaveTile: function (oTileContext, newGroupName) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.createGroupAndSaveTile({
                    catalogTileContext: oTileContext,
                    newGroupName: newGroupName
                });

            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "appFinderWithDocking", this._handleAppFinderWithDocking, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "appFinderAfterNavigate", this._handleAppFinderAfterNavigate, this);
        }
    });
});
