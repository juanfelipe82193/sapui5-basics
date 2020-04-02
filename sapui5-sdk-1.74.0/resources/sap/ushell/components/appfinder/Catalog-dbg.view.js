// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/HTML",
    "sap/ushell/ui/appfinder/AppBox",
    "sap/ushell/ui/appfinder/PinButton",
    "sap/ushell/ui/launchpad/CatalogEntryContainer",
    "sap/ushell/ui/launchpad/CatalogsContainer",
    "sap/ushell/ui/launchpad/Panel",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ui/thirdparty/jquery",
    "sap/ui/performance/Measurement",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/Device",
    "sap/m/MessagePage",
    "sap/m/Page",
    "sap/m/BusyIndicator",
    "sap/m/SplitApp",
    "sap/ushell/Config"
], function (
    HTML,
    AppBox,
    PinButton,
    CatalogEntryContainer,
    CatalogsContainer,
    Panel,
    Tile,
    jQuery,
    Measurement,
    resources,
    AccessibilityCustomData,
    List,
    StandardListItem,
    Device,
    MessagePage,
    Page,
    BusyIndicator,
    SplitApp,
    Config
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.appfinder.Catalog", {
        oController: null,

        createContent: function (oController) {
            var that = this;

            this.oViewData = this.getViewData();
            this.parentComponent = this.oViewData.parentComponent;

            var oModel = this.parentComponent.getModel();
            this.setModel(oModel);
            this.setModel(this.oViewData.subHeaderModel, "subHeaderModel");
            this.oController = oController;

            function iflong (sLong) {
                return ((sLong !== null) && (sLong === "1x2" || sLong === "2x2")) || false;
            }

            function to_int (v) {
                return parseInt(v, 10) || 0;
            }

            function get_tooltip (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                var sTooltip;

                if (sGroupContextModelPath) {
                    var oResourceBundle = resources.i18n,
                        iCatalogTileInGroup = aGroupsIDs ? Array.prototype.indexOf.call(aGroupsIDs, sGroupContextId) : -1;

                    sTooltip = oResourceBundle.getText(iCatalogTileInGroup !== -1 ? "removeAssociatedTileFromContextGroup" : "addAssociatedTileToContextGroup", sGroupContextTitle);
                } else {
                    sTooltip = aGroupsIDs && aGroupsIDs.length ? sAddTileToMoreGroups : sAddTileGroups;
                }
                return sTooltip;
            }

            var oTilePinButton = new PinButton({
                icon: "sap-icon://pushpin-off",
                selected: {
                    parts: ["associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id"],
                    formatter: function (aAssociatedGroups, associatedGroupsLength, sGroupContextModelPath, sGroupContextId) {
                        if (sGroupContextModelPath) {
                            // If in group context - the icon is determined according to whether this catalog tile exists in the group or not
                            var iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupContextId) : -1;
                            return iCatalogTileInGroup !== -1;
                        }
                        return !!associatedGroupsLength;

                    }
                },
                tooltip: {
                    parts: ["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip", "i18n>EasyAccessMenu_PinButton_Toggled_Tooltip", "associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id", "/groupContext/title"],
                    formatter: function (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, associatedGroupsLength, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                        return get_tooltip(sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle);
                    }
                },
                press: [oController.onTilePinButtonClick, oController]
            });

            var oAppBoxPinButton = new PinButton({
                icon: "sap-icon://pushpin-off",
                selected: {
                    parts: ["associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id"],
                    formatter: function (aAssociatedGroups, associatedGroupsLength, sGroupContextModelPath, sGroupContextId) {
                        if (sGroupContextModelPath) {
                            // If in group context - the icon is determined according to whether this catalog tile exists in the group or not
                            var iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupContextId) : -1;
                            return iCatalogTileInGroup !== -1;
                        }
                        return !!associatedGroupsLength;
                    }
                },
                tooltip: {
                    parts: ["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip", "i18n>EasyAccessMenu_PinButton_Toggled_Tooltip", "associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id", "/groupContext/title"],
                    formatter: function (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, associatedGroupsLength, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                        return get_tooltip(sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle);
                    }
                },
                press: [oController.onTilePinButtonClick, oController]
            });

            this.oAppBoxesTemplate = new AppBox({
                title: "{title}",
                icon: "{icon}",
                subtitle: "{subtitle}",
                url: "{url}",
                navigationMode: "{navigationMode}",
                pinButton: oAppBoxPinButton,
                press: [oController.onAppBoxPressed, oController]
            });

            // When personalization is disabled, one should not see any option to click the pin button to personalize one's homepage.
            var bEnabledPersonalization = Config.last("/core/shell/enablePersonalization");
            oAppBoxPinButton.setVisible(bEnabledPersonalization);

            oAppBoxPinButton.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oAppBoxPinButton.addStyleClass("sapUshellPinButton");

            oTilePinButton.setVisible(bEnabledPersonalization);
            oTilePinButton.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oTilePinButton.addStyleClass("sapUshellPinButton");

            this.oTileTemplate = new Tile({
                tileViews: {
                    path: "content",
                    factory: function (sId, oContext) {
                        return oContext.getObject();
                    }
                },
                "long": {
                    path: "size",
                    formatter: iflong
                },
                index: {
                    path: "id",
                    formatter: to_int
                },
                tileCatalogId: "{id}",
                pinButton: oTilePinButton,
                press: [oController.catalogTilePress, oController],
                afterRendering: oController.onTileAfterRendering
            });

            this.oCatalogSelect = new List("catalogSelect", {
                visible: "{/enableCatalogSelection}",
                name: "Browse",
                rememberSelections: true,
                mode: "SingleSelectMaster",
                items: {
                    path: "/masterCatalogs",
                    template: new StandardListItem({
                        type: "Active",
                        title: "{title}",
                        tooltip: "{title}"
                    })
                },
                showNoData: false,
                itemPress: [oController._handleCatalogListItemPress, oController],
                selectionChange: [oController._handleCatalogListItemPress, oController]
            });

            this.getCatalogSelect = function () {
                return this.oCatalogSelect;
            };

            /*
             * override original onAfterRendering as currently sap.m.Select does not support afterRendering handler in the constructor
             * this is done to support tab order accessibility
             */
            var origCatalogSelectOnAfterRendering = this.oCatalogSelect.onAfterRendering;
            if (Device.system.desktop) {
                this.oCatalogSelect.addEventDelegate({
                    onsaptabnext: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        } catch (e) {
                            // continue regardless of error
                        }
                    },
                    onsapskipforward: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        } catch (e) {
                            // continue regardless of error
                        }
                    },
                    onsapskipback: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                            if (openCloseSplitAppButton.getVisible()) {
                                openCloseSplitAppButton.focus();
                            } else {
                                sap.ushell.components.ComponentKeysHandler.appFinderFocusMenuButtons(oEvent);
                            }
                        } catch (e) {
                            // continue regardless of error
                        }
                    }
                });
            }
            // if xRay is enabled
            if (oModel.getProperty("/enableHelp")) {
                this.oCatalogSelect.addStyleClass("help-id-catalogCategorySelect");// xRay help ID
            }

            this.setCategoryFilterSelection = function (sSelection, shouldFocusOnCategory) {
                var oCatalogSelection = that.getCatalogSelect(),
                    aCatalogListItems = oCatalogSelection.getItems(),
                    sSelected = sSelection,
                    selectedIndex = 0;

                if (!sSelected || sSelected === "") {
                    sSelected = resources.i18n.getText("all");
                }

                aCatalogListItems.forEach(function (oListItem, nIndex) {
                    if (oListItem.getTitle() === sSelected) {
                        selectedIndex = nIndex;
                        oCatalogSelection.setSelectedItem(oListItem);
                    }
                });

                if (aCatalogListItems.length !== 0 && shouldFocusOnCategory) {
                    aCatalogListItems[selectedIndex].focus();
                }
            };

            this.oCatalogSelect.onAfterRendering = function () {
                //set the selected item.
                var sSelected = that.oController.categoryFilter || resources.i18n.getText("all");

                that.setCategoryFilterSelection(sSelected);

                if (origCatalogSelectOnAfterRendering) {
                    origCatalogSelectOnAfterRendering.apply(this, arguments);
                }

                if (!this.getSelectedItem()) {
                    this.setSelectedItem(this.getItems()[0]);
                }

                //set focus on first segmented button
                setTimeout(function () {
                    var buttons = jQuery("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");
                    if (buttons.length) {
                        buttons.eq(0).focus();
                    } else {
                        jQuery("#catalog-button").focus();
                    }
                }, 0);
            };

            /*
             * setting followOf to false, so the popover won't close on IE.
             */
            var origOnAfterRenderingPopover = this.oCatalogSelect._onAfterRenderingPopover;
            this.oCatalogSelect._onAfterRenderingPopover = function () {
                if (this._oPopover) {
                    this._oPopover.setFollowOf(false);
                }
                if (origOnAfterRenderingPopover) {
                    origOnAfterRenderingPopover.apply(this, arguments);
                }
            };

            var oEventBus = sap.ui.getCore().getEventBus(),
                sDeatailPageId,
                fnUpdateMasterDetail = function () {
                    this.splitApp.toMaster("catalogSelect", "show");
                    if (!Device.system.phone) {
                        sDeatailPageId = this._calculateDetailPageId();
                        if (sDeatailPageId !== this.splitApp.getCurrentDetailPage().getId()) {
                            this.splitApp.toDetail(sDeatailPageId);
                        }
                    }
                };

            oEventBus.subscribe("launchpad", "catalogContentLoaded", function () {
                setTimeout(fnUpdateMasterDetail.bind(this), 500);
            }, this);
            oEventBus.subscribe("launchpad", "afterCatalogSegment", fnUpdateMasterDetail, this);

            var oAccessibilityTileText = new HTML("sapUshellCatalogAccessibilityTileText", {
                content: "<div style='height: 0px; width: 0px; overflow: hidden; float: left;'>" + resources.i18n.getText("tile") + "</div>"
            });

            // This renderes the catalogs.
            var oCatalogTemplate = new CatalogEntryContainer({
                header: "{title}",
                customTilesContainer: {
                    path: "customTiles",
                    template: this.oTileTemplate,
                    templateShareable: true
                },
                appBoxesContainer: {
                    path: "appBoxes",
                    template: this.oAppBoxesTemplate,
                    templateShareable: true
                }
            });

            // create message-page as invisible by default
            this.oMessagePage = new MessagePage({
                visible: true,
                showHeader: false,
                text: resources.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),
                description: ""
            });

            // This renderes the catalogs.
            this.oCatalogsContainer = new CatalogsContainer("catalogTiles", {
                categoryFilter: "{/categoryFilter}",
                catalogs: {
                    path: "/catalogs",
                    templateShareable: true,
                    template: oCatalogTemplate
                    // here add the filter for the catalog.
                },
                busy: true
            });

            this.oCatalogsContainer.addStyleClass("sapUshellCatalogTileContainer");

            this.oCatalogsContainer.addEventDelegate({
                onsaptabprevious: function (oEvent) {
                    var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader"),
                        jqCurrentElement = jQuery(oEvent.srcControl.getDomRef());
                    if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed() &&
                        !jqCurrentElement.hasClass("sapUshellPinButton")) {
                        oEvent.preventDefault();
                        var appFinderSearch = sap.ui.getCore().byId("appFinderSearch");
                        appFinderSearch.focus();
                    }
                },
                onsapskipback: function (oEvent) {
                    var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                    if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                        oEvent.preventDefault();
                        openCloseSplitAppButton.focus();
                    }
                }
            });

            this.oCatalogsContainer.onAfterRendering = function () {
                var oCatalogTilesDetailedPage = sap.ui.getCore().byId("catalogTilesDetailedPage");
                if (!this.getBusy()) {
                    oCatalogTilesDetailedPage.setBusy(false);
                    Measurement.end("FLP:AppFinderLoadingStartToEnd");
                } else {
                    oCatalogTilesDetailedPage.setBusy(true);
                }

                jQuery("#catalogTilesDetailedPage-cont").scroll(function () {
                    var oPage = sap.ui.getCore().byId("catalogTilesDetailedPage"),
                        scroll = oPage.getScrollDelegate(),
                        currentPos = scroll.getScrollTop(),
                        max = scroll.getMaxScrollTop();

                    if (max - currentPos <= 30 + 3 * that.oController.PagingManager.getTileHeight() && that.oController.bIsInProcess === false) {
                        that.oController.bIsInProcess = true;
                        that.oController.allocateNextPage();
                        setTimeout(
                            function () {
                                that.oController.bIsInProcess = false;
                            }, 0);
                    }
                });
            };

            this.wrapCatalogsContainerInDetailPage = function (aCatalogsContainerContnet, sId) {
                var oDetailPage1 = new Page(sId, {
                    showHeader: false,
                    showFooter: false,
                    showNavButton: false,
                    content: [new Panel({
                        translucent: true,
                        content: aCatalogsContainerContnet
                    }).addStyleClass("sapUshellCatalogPage")]
                });

                return oDetailPage1;
            };

            this.getCatalogContainer = function () {
                return this.oCatalogsContainer;
            };

            new Page({
                showHeader: false,
                showFooter: false,
                showNavButton: false,
                content: [new Panel({
                    translucent: true,
                    content: [oAccessibilityTileText, this.getCatalogContainer()]
                }).addStyleClass("sapUshellCatalogPage")]
            });
            var oCatalogDetailedPage = this.wrapCatalogsContainerInDetailPage([oAccessibilityTileText, this.getCatalogContainer()], "catalogTilesDetailedPage"),
                oCatalogMessage = new Page("catalogMessagePage", {
                    showHeader: false,
                    showFooter: false,
                    showNavButton: false,
                    content: [this.oMessagePage]
                });

            var oSelectBusyIndicator = new BusyIndicator("catalogSelectBusyIndicator", { size: "1rem" });
            this.splitApp = new SplitApp("catalogViewMasterDetail", {
                masterPages: [oSelectBusyIndicator, this.oCatalogSelect],
                detailPages: [oCatalogDetailedPage, oCatalogMessage]
            });

            // Remove this: intended for testing porpuses.
            document.toSearch = function () {
                this.splitApp.toDetail("catalogTilesSearchPage");
            }.bind(this);
            document.toDetail = function () {
                this.splitApp.toDetail("catalogTilesDetailedPage");
            }.bind(this);
            document.toMessage = function () {
                this.splitApp.toDetail("catalogMessagePage");
            }.bind(this);

            return this.splitApp;
        },

        // calculate what is the relevant current detail page according to configuration and state of the view
        _calculateDetailPageId: function () {
            var oSubHeaderModel = this.getModel("subHeaderModel");
            var bSearchMode = oSubHeaderModel.getProperty("/search/searchMode");
            var bTagMode = oSubHeaderModel.getProperty("/tag/tagMode");
            var bNoCatalogs = !!this.getModel().getProperty("/catalogsNoDataText");
            var sId;
            if (bSearchMode || bTagMode) {
                sId = this.getController().bSearchResults ? "catalogTilesDetailedPage" : "catalogMessagePage";
            } else if (bNoCatalogs) {
                sId = "catalogMessagePage";
            } else {
                sId = "catalogTilesDetailedPage";
            }
            return sId;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.Catalog";
        }
    });
});
