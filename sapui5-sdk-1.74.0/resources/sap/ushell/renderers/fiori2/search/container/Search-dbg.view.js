// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
// Oliver+Jian //TODO
// iteration 0 //TODO
/* global $ */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/controls/SearchLayout',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultListContainer',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultList',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultTable',
    'sap/ushell/renderers/fiori2/search/controls/SearchSpreadsheet',
    'sap/ushell/renderers/fiori2/search/controls/SearchNoResultScreen',
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/controls/SearchLabel',
    'sap/ushell/renderers/fiori2/search/controls/SearchLink',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultMap',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultListItem',
    'sap/ushell/renderers/fiori2/search/controls/CustomSearchResultListItem',
    'sap/ushell/renderers/fiori2/search/controls/SearchFacetFilter',
    'sap/ushell/renderers/fiori2/search/controls/DivContainer',
    'sap/ushell/renderers/fiori2/search/controls/SearchTilesContainer',
    'sap/ushell/renderers/fiori2/search/controls/SearchFilterBar',
    'sap/ushell/services/Personalization',
    'sap/m/TablePersoController',
    'sap/ui/vbm/AnalyticMap',
    'sap/ui/vbm/Spot',
    'sap/m/BusyDialog'
], function (
    SearchLayout, SearchResultListContainer, SearchResultList, SearchResultTable, SearchSpreadsheet, SearchNoResultScreen,
    SearchHelper, SearchLabel, SearchLink, SearchMap, SearchResultListItem, CustomSearchResultListItem
) {
    "use strict";

    return sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search", {

        // create content
        // ===================================================================
        createContent: function (oController) {
            var that = this;

            // total count hidden element for ARIA purposes
            that.totalCountHiddenElement = that.assembleCountHiddenElement();

            // center area
            that.centerArea = that.assembleCenterArea();

            // main result list
            var resultListContainer = new SearchResultListContainer({
                centerArea: that.centerArea,
                totalCountBar: that.assembleCountLabel(),
                noResultScreen: new SearchNoResultScreen({
                    searchBoxTerm: {
                        parts: [{
                            path: '/queryFilter/searchTerm'
                        }],
                        formatter: function (searchTerms) {
                            return searchTerms;
                        }
                    },
                    visible: {
                        parts: [{
                            path: '/count'
                        }, {
                            path: '/isBusy'
                        }, {
                            path: '/firstSearchWasExecuted'
                        }],
                        formatter: function (count, isBusy, firstSearchWasExecuted) {
                            return count === 0 && !isBusy && firstSearchWasExecuted;
                        }
                    }
                }),
                totalCountHiddenElement: that.totalCountHiddenElement
            });

            // container for normal search result list + facets
            that.searchLayout = new SearchLayout({
                resultListContainer: resultListContainer,
                busyIndicator: new sap.m.BusyDialog(),
                isBusy: '{/isBusy}',
                busyDelay: '{/busyDelay}',
                showFacets: {
                    parts: [{
                        path: '/count'
                    }, {
                        path: '/facetVisibility'
                    }, {
                        path: '/uiFilter/rootCondition'
                    }, {
                        path: '/isBusy'
                    }],
                    formatter: function (count, facetVisibility, filterConditions, isBusy) {
                        if (!facetVisibility) {
                            return false;
                        }
                        var filterExists = filterConditions && filterConditions.conditions &&
                            filterConditions.conditions.length > 0;
                        if (count === 0 && !filterExists && !isBusy) {
                            return false;
                        }
                        return true;
                    }
                },
                vertical: false,
                facets: new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter()
            });
            that.searchLayout.addStyleClass('sapUshellSearchLayout');

            // top container
            that.searchContainer = new sap.ushell.renderers.fiori2.search.controls.DivContainer({
                content: [that.searchLayout],
                cssClass: 'sapUshellSearchContainer'
            });

            // init search focus handler
            that.oFocusHandler = new SearchHelper.SearchFocusHandler(that);

            return that.searchContainer;

        },

        // assemble filter button
        // ===================================================================
        assembleFilterButton: function () {
            var that = this;
            var filterBtn = new sap.m.ToggleButton({
                icon: sap.ui.core.IconPool.getIconURI("filter"),
                tooltip: {
                    parts: [{
                        path: '/facetVisibility'
                    }],
                    formatter: function (facetVisibility) {
                        return facetVisibility ? sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip") :
                            sap.ushell.resources.i18n.getText("showFacetBtn_tooltip");
                    }
                },
                pressed: '{/facetVisibility}',
                press: function () {
                    if (this.getPressed()) {
                        // show facet
                        that.searchLayout.setAnimateFacetTransition(true);
                        that.getModel().setFacetVisibility(true);
                        that.searchLayout.setAnimateFacetTransition(false);
                        //filterBtn.setTooltip(sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip"));
                    } else {
                        //hide facet
                        that.searchLayout.setAnimateFacetTransition(true);
                        that.getModel().setFacetVisibility(false);
                        that.searchLayout.setAnimateFacetTransition(false);
                        //filterBtn.setTooltip(sap.ushell.resources.i18n.getText("showFacetBtn_tooltip"));
                    }
                },
                visible: {
                    parts: [{
                        path: '/businessObjSearchEnabled'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (businessObjSearchEnabled, count) {
                        if (count === 0) {
                            return false;
                        }
                        return !sap.ui.Device.system.phone && businessObjSearchEnabled;
                    }
                }
            });
            filterBtn.addStyleClass('searchBarFilterButton');
            return filterBtn;
        },

        // visibility of search toolbar entry
        // ===================================================================
        searchToolbarEntryVisibility: {
            parts: [{
                path: '/count'
            }],
            formatter: function (count) {
                return count !== 0 && !sap.ui.Device.system.phone;
            }
        },

        // assemble count label
        // ===================================================================
        assembleCountLabel: function () {

            var label = new sap.m.Label({
                visible: {
                    parts: [{
                        path: '/count'
                    }],
                    formatter: function (count) {
                        return count !== 0;
                    }
                },
                text: {
                    parts: [{
                        path: '/count'
                    }, {
                        path: '/nlqSuccess'
                    }, {
                        path: '/nlqDescription'
                    }],
                    formatter: function (count, nlqSuccess, nlqDescription) {
                        if (nlqSuccess) {
                            return nlqDescription;
                        }
                        if (typeof count !== 'number') {
                            return "";
                        }
                        var countAsStr = SearchHelper.formatInteger(count);
                        return sap.ushell.resources.i18n.getText("results") + ' (' + countAsStr + ')';
                    }
                }
            });
            label.addStyleClass('sapUshellSearchTotalCountSelenium');
            return label;
        },

        // assemble hidden count text for screenreader support
        // ===================================================================
        assembleCountHiddenElement: function () {

            var totalCountHiddenElement = new sap.ui.core.InvisibleText({
                text: {
                    parts: [{
                        path: '/count'
                    }, {
                        path: '/nlqSuccess'
                    }, {
                        path: '/nlqDescription'
                    }],
                    formatter: function (count, nlqSuccess, nlqDescription) {
                        if (nlqSuccess) {
                            return nlqDescription;
                        }
                        if (typeof count !== 'number') {
                            return "";
                        }
                        return sap.ushell.resources.i18n.getText("results_count_for_screenreaders", [count]);
                    }
                }
            });
            return totalCountHiddenElement;
        },

        // search toolbar
        // ===================================================================
        assembleSearchToolbar: function (bWithoutShareButton) {
            var that = this;

            // display switch tap strips
            var displaySwitchTapStrips = that.assembleDisplaySwitchTapStrips();

            // table sort button
            var tableSortButton = new sap.m.Button({
                icon: "sap-icon://sort",
                tooltip: "{i18n>sortTable}",
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }, {
                        path: '/tableSortableColumns'
                    }],
                    formatter: function (displaySwitchVisibility, count, columns) {
                        return displaySwitchVisibility && count !== 0 && columns.length > 1;
                    }
                },
                press: function (evt) {
                    that.tableSortDialog.open();
                }
            });
            displaySwitchTapStrips.addEventDelegate({
                //needed as by refreshing page the view is not reassembled and hence "that.determineIfMaps(that)" is not run
                onAfterRendering: function (oEvent) {
                    var oDisplaySwitchButtons = oEvent.srcControl;
                    if (oDisplaySwitchButtons.getItems().length === 2 && that.determineIfMaps(that)) {
                        oDisplaySwitchButtons.addItem(new sap.m.SegmentedButtonItem({
                            icon: "sap-icon://map",
                            tooltip: sap.ushell.resources.i18n.getText("displayMap"),
                            key: "map"
                        }));
                    } else if (oDisplaySwitchButtons.getItems().length === 3 && !that.determineIfMaps(that)) {
                        oDisplaySwitchButtons.removeItem(oDisplaySwitchButtons.getItems()[2]);
                        if (that.getModel().getProperty('/resultToDisplay') === "searchResultMap") {
                            that.getModel().setProperty('/resultToDisplay', "searchResultList");
                        }
                    }

                    // $(".sapMText.sapMTextBreakWord.sapMTextMaxWidth.sapUiSelectable.sapUshellSearchResultListItem-AttributeValue.sapUshellSearchResultListItem-MightOverflow").css("overflow", "visible");

                }
            });
            displaySwitchTapStrips.addStyleClass("sapUshellSearchResultDisplaySwitch");
            tableSortButton.addStyleClass("sapUshellSearchTableSortButton");

            // table personalize button
            var tablePersonalizeButton = new sap.m.Button("tablePersonalizeButton", {
                icon: "sap-icon://action-settings",
                tooltip: "{i18n>personalizeTable}",
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function (resultToDisplay) {
                        return resultToDisplay === "searchResultTable";
                    }
                },
                press: function (evt) {
                    that.oTablePersoController.openDialog();
                }
            });
            tablePersonalizeButton.addStyleClass("sapUshellSearchTablePersonalizeButton");

            //            //Fix bug: oTablePersoController is undefined when UI shows search result table back from fact sheet
            //            tablePersonalizeButton.addEventDelegate({
            //                onAfterRendering: function() {
            //                    that.updatePersoServiceAndController();
            //                }
            //            });

            // table personalize button
            var dataExportButton = new sap.m.Button("dataExportButton", {
                icon: "sap-icon://download",
                tooltip: "{i18n>exportData}",
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    }
                },
                press: function () {
                    if (that.searchSpreadsheet === undefined) {
                        that.searchSpreadsheet = new SearchSpreadsheet("ushell-search-spreadsheet");
                    }
                    that.searchSpreadsheet.onExport();
                }
            });

            if (!bWithoutShareButton) {
                var shareButton = this.assembleShareButton();
                return [dataExportButton, tablePersonalizeButton, tableSortButton, shareButton, displaySwitchTapStrips];
            }
            return [dataExportButton, tablePersonalizeButton, tableSortButton, displaySwitchTapStrips];

        },

        // share button
        // ===================================================================
        assembleShareButton: function () {

            var that = this;

            // create bookmark button (entry in action sheet)
            var oBookmarkButton = new sap.ushell.ui.footerbar.AddBookmarkButton({
                beforePressHandler: function () {
                    var oAppData = {
                        url: document.URL,
                        title: that.getModel().getDocumentTitle(),
                        icon: sap.ui.core.IconPool.getIconURI("search")
                    };
                    oBookmarkButton.setAppData(oAppData);
                }
            });
            oBookmarkButton.setWidth('auto');

            var oEmailButton = new sap.m.Button();
            oEmailButton.setIcon("sap-icon://email");
            oEmailButton.setText(sap.ushell.resources.i18n.getText("eMailFld"));
            oEmailButton.attachPress(function () {
                sap.m.URLHelper.triggerEmail(null, that.getModel().getDocumentTitle(), document.URL);
            });
            oEmailButton.setWidth('auto');

            // add these two jam buttons when we know how to configure jam in fiori  //TODO
            //var oJamShareButton = new sap.ushell.ui.footerbar.JamShareButton();
            //var oJamDiscussButton = new sap.ushell.ui.footerbar.JamDiscussButton();

            // create action sheet
            var oActionSheet = new sap.m.ActionSheet({
                placement: 'Bottom',
                buttons: [oBookmarkButton, oEmailButton]
            });

            // button which opens action sheet
            var oShareButton = new sap.m.Button({
                icon: 'sap-icon://action',
                tooltip: sap.ushell.resources.i18n.getText('shareBtn'),
                press: function () {
                    oActionSheet.openBy(oShareButton);
                }
            });
            return oShareButton;
        },


        // datasource tap strips
        // ===================================================================
        assembleDataSourceTapStrips: function () {

            var that = this;

            var tabBar = new sap.m.OverflowToolbar({
                design: sap.m.ToolbarDesign.Transparent,
                visible: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/count'
                    }, {
                        path: '/businessObjSearchEnabled'
                    }],
                    formatter: function (facetVisibility, count, bussinesObjSearchEnabled) {
                        return !facetVisibility && count > 0 && bussinesObjSearchEnabled;
                    }
                }
            });
            // define group for F6 handling
            tabBar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );
            tabBar.addStyleClass('searchTabStrips');
            that.tabBar = tabBar;

            var tabBarAriaLabel = new sap.ui.core.InvisibleText({
                text: "Data Sources"
            }).toStatic();
            tabBar.addDependent(tabBarAriaLabel);
            tabBar.addAriaLabelledBy(tabBarAriaLabel);

            tabBar.bindAggregation('content', '/tabStrips/strips', function (sId, oContext) {
                var button = new sap.m.ToggleButton({
                    text: '{labelPlural}',
                    type: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function (selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            if (myDatasource === selectedDS) {
                                return sap.m.ButtonType.Transparent; // changed
                            }
                            return sap.m.ButtonType.Transparent;

                        }
                    },
                    pressed: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function (selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            return myDatasource === selectedDS;
                        }
                    },
                    press: function (event) {
                        if (that.getModel().config.searchScopeWithoutAll) {
                            return;
                        }

                        this.setType(sap.m.ButtonType.Transparent); // changed

                        // clicking on the already selected button has neither UI effect(button stays pressed status) nor reloading of search
                        if (this.getBindingContext().getObject() === that.getModel().getProperty('/tabStrips/selected')) {
                            this.setPressed(true);
                            return;
                        }
                        var aButtons = that.tabBar.getContent();

                        for (var i = 0; i < aButtons.length; i++) {
                            if (aButtons[i].getId() !== this.getId()) {
                                aButtons[i].setType(sap.m.ButtonType.Transparent);
                                if (aButtons[i].getPressed() === true) {
                                    aButtons[i].setPressed(false);
                                }
                            }
                        }

                        // set Datasource to current datasource;
                        that.getModel().setDataSource(this.getBindingContext().getObject());
                    }
                });
                var buttonAriaLabel = new sap.ui.core.InvisibleText({
                    text: oContext.getProperty("labelPlural") + ", " + sap.ushell.resources.i18n.getText("dataSource")
                }).toStatic();
                button.addAriaLabelledBy(buttonAriaLabel);
                button.addDependent(buttonAriaLabel);

                return button;
            });

            tabBar._setupItemNavigation = function () {
                if (!this.theItemNavigation) {
                    this.theItemNavigation = new sap.ui.core.delegate.ItemNavigation();
                    this.addDelegate(this.theItemNavigation);
                }
                this.theItemNavigation.setCycling(false);
                this.theItemNavigation.setRootDomRef(this.getDomRef());
                var itemDomRefs = [];
                var content = this.getContent();
                for (var i = 0; i < content.length; i++) {
                    if (!$(content[i].getDomRef()).attr("tabindex")) {
                        var tabindex = "-1";
                        if (content[i].getPressed && content[i].getPressed()) {
                            tabindex = "0";
                        }
                        $(content[i].getDomRef()).attr("tabindex", tabindex);
                    }
                    itemDomRefs.push(content[i].getDomRef());
                }

                var overflowButton = this.getAggregation("_overflowButton");
                if (overflowButton && overflowButton.getDomRef) {
                    var _overflowButton = overflowButton.getDomRef();
                    itemDomRefs.push(_overflowButton);
                    $(_overflowButton).attr("tabindex", "-1");
                }

                this.theItemNavigation.setItemDomRefs(itemDomRefs);
            };

            tabBar.addEventDelegate({
                onAfterRendering: function (oEvent) {
                    var that = this;

                    that.getAggregation("_overflowButton").addEventDelegate({
                        onAfterRendering: function (oEvent) {
                            that._setupItemNavigation();
                        }
                    }, that.getAggregation("_overflowButton"));

                    var $that = $(that.getDomRef());
                    $that.attr("role", "tablist");
                    $that.children("button").attr("role", "tab");

                    that._setupItemNavigation();
                }
            }, tabBar);

            return tabBar;
        },

        reorgTabBarSequence: function () {
            if (!this.tabBar) {
                return;
            }
            var highLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            });
            var neverOverflowLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            });

            var aButtons = this.tabBar.getContent();
            for (var i = 0; i < aButtons.length; i++) {
                if (this.getModel().getProperty('/tabStrips/selected') === aButtons[i].getBindingContext().getObject()) {
                    aButtons[i].setLayoutData(neverOverflowLayout);
                } else {
                    aButtons[i].setLayoutData(highLayout);
                }

            }

        },
        determineIfMaps: function (oContext) {
            var bIfMaps = false;
            if (oContext.getModel()) {

                var dataSource = oContext.getModel().getDataSource();
                if (typeof dataSource !== 'undefined' && dataSource.attributesMetadata) {
                    var attributesMetadata = dataSource.attributesMetadata;
                    for (var i = 0; i < attributesMetadata.length; i++) {
                        var type = attributesMetadata[i].type;
                        if (type === "GeoJson") {
                            bIfMaps = true;
                            break;
                        }
                    }
                }

                if (oContext.getModel().config.maps === true) {
                    bIfMaps = true;
                } else if (oContext.getModel().config.maps === false) {
                    bIfMaps = false;
                }

            }
            return bIfMaps;
        },
        // display switch tap strips
        // ===================================================================
        assembleDisplaySwitchTapStrips: function () {
            var that = this;
            var items = [
                new sap.m.SegmentedButtonItem({
                    icon: "sap-icon://list",
                    tooltip: sap.ushell.resources.i18n.getText("displayList"),
                    key: "list"
                }),
                new sap.m.SegmentedButtonItem({
                    icon: "sap-icon://table-view",
                    tooltip: sap.ushell.resources.i18n.getText("displayTable"),
                    key: "table"
                })
            ];
            if (that.determineIfMaps(that)) {
                items.push(new sap.m.SegmentedButtonItem({
                    icon: "sap-icon://map",
                    tooltip: sap.ushell.resources.i18n.getText("displayMap"),
                    key: "map"
                }));
            }
            var oSegmentedButton = new sap.m.SegmentedButton('ResultViewType', {
                selectedKey: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function (resultToDisplay) {
                        var res = "list";
                        if (resultToDisplay === "searchResultTable") {
                            res = "table";
                        } else if (resultToDisplay === "searchResultList") {
                            res = "list";
                        } else if (resultToDisplay === "searchResultMap") {
                            res = "map";
                        }
                        return res;
                    }
                },
                items: items,
                visible: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    }
                },
                /*eslint-disable no-extra-bind*/
                select: function (eObj) {
                    var key = eObj.mParameters.key;
                    var model = that.getModel();
                    switch (key) {
                    case "list":
                        model.setProperty('/resultToDisplay', "searchResultList");
                        that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                        that.searchResultMap.setVisible(false);
                        break;
                    case "table":
                        model.setProperty('/resultToDisplay', "searchResultTable");
                        that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                        that.searchResultMap.setVisible(false);
                        break;
                    case "map":
                        model.setProperty('/resultToDisplay', "searchResultMap");
                        that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                        break;
                    default:
                        model.setProperty('/resultToDisplay', "searchResultList");
                        that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                    }
                    model.enableOrDisableMultiSelection();
                }.bind(this)
            });

            oSegmentedButton.addStyleClass("sapUshellSearchDisplaySwitchTapStrips");

            return oSegmentedButton;
        },

        isShowMoreFooterVisible: function () {
            var model = this.getModel();
            return model.getProperty("/boCount") > model.getProperty("/boResults").length;
        },

        // center area
        // ===================================================================
        assembleCenterArea: function () {
            var that = this;

            // sort dialog
            that.tableSortDialog = that.assembleSearchResultSortDialog();

            // search result list
            var searchResultList = that.assembleSearchResultList();
            // search result table
            that.searchResultTable = that.assembleSearchResultTable();
            that.searchResultTable.addDelegate({
                onBeforeRendering: function () {
                    that.updateTableLayout();
                },
                onAfterRendering: function () {
                    var $tableTitleRow = $(that.searchResultTable.getDomRef()).find("table > thead > tr:first");
                    if ($tableTitleRow) {
                        $tableTitleRow.attr("aria-labelledby", that.totalCountHiddenElement.getId());
                    }
                }
            });

            that.searchResultMap = that.assembleSearchResultMap();
            that.searchResultMap.setVisible(false);
            // app search result
            that.appSearchResult = that.assembleAppSearch();
            // show more footer
            that.showMoreFooter = that.assembleShowMoreFooter();

            return [that.tableSortDialog, searchResultList, that.searchResultTable, that.searchResultMap, that.appSearchResult, that.showMoreFooter, that.totalCountHiddenElement];
        },

        // sort dialog
        // ===================================================================
        assembleSearchResultSortDialog: function () {
            var that = this;
            var tableSortDialog = new sap.m.ViewSettingsDialog({
                sortDescending: {
                    parts: [{
                        path: "/orderBy"
                    }],
                    formatter: function (orderBy) {
                        return jQuery.isEmptyObject(orderBy) || orderBy.sortOrder === "DESC";
                    }
                },
                confirm: function (evt) {
                    var mParams = [];
                    mParams = evt.getParameters();
                    if (mParams.sortItem) {
                        var oCurrentModel = that.getModel();
                        if (mParams.sortItem.getKey() === "searchSortableColumnKeyDefault") {
                            oCurrentModel.resetOrderBy();
                            tableSortDialog.setSortDescending(true);
                        } else {
                            oCurrentModel.setOrderBy({
                                orderBy: mParams.sortItem.getBindingContext().getObject().attributeId,
                                sortOrder: mParams.sortDescending === true ? "DESC" : "ASC"
                            });
                        }
                    }
                },
                cancel: function (evt) {
                    // reset slected value to the last sort column item
                    var lastSortColumnKey = that.getModel().getOrderBy().orderBy === undefined ? "searchSortableColumnKeyDefault" : that.getModel().getOrderBy().orderBy;
                    this.setSelectedSortItem(lastSortColumnKey);
                }
            });

            tableSortDialog.bindAggregation("sortItems", "/tableSortableColumns", function (path, bData) {
                return new sap.m.ViewSettingsItem({
                    key: "{key}",
                    text: "{name}",
                    selected: "{selected}" // Not binding because of setSlected in ItemPropertyChanged event
                });
            });

            return tableSortDialog;
        },

        // main result table
        // ===================================================================
        assembleSearchResultTable: function () {
            var that = this;
            var resultTable = new SearchResultTable("ushell-search-result-table", {
                mode: {
                    parts: [{
                        path: '/multiSelectionEnabled'
                    }],
                    formatter: function (multiSelectionEnabled) {
                        return multiSelectionEnabled === true ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
                    }
                },
                //                fixedLayout: false,
                noDataText: '{i18n>noCloumnsSelected}',
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "searchResultTable" && count !== 0;
                    }
                },
                //contextualWidth: "Auto", // bug: last column disappears in small screen -> need to reconcider
                popinLayout: sap.m.PopinLayout.GridLarge,
                rememberSelections: false
            });

            resultTable.bindAggregation("columns", "/tableColumns", function (path, bData) {
                var tableColumn = bData.getObject();
                var column = new sap.m.Column(tableColumn.key, {
                    header: new sap.m.Label({
                        text: "{name}",
                        tooltip: "{name}"
                    }),
                    visible: {
                        parts: [{
                            path: 'index'
                        }],
                        formatter: function (index) {
                            return index < 6; // first 6 attributes are visible, including title and title description
                        }
                    }
                });
                return column;
            });

            resultTable.bindAggregation("items", "/tableResults", function (path, bData) {
                return that.assembleTableItems(bData);
            });

            resultTable.addEventDelegate({
                onAfterRendering: function () {
                    that.updatePersoServiceAndController();
                    var $table = $(this.getDomRef());
                    $table.find("table tbody tr").each(function () {
                        var $this = $(this);
                        var tableRow = sap.ui.getCore().byId($this.attr("id"));
                        if (tableRow) {
                            var currentAriaLabelledBy = tableRow.getAriaLabelledBy();
                            if ($.inArray(that.totalCountHiddenElement.getId(), currentAriaLabelledBy) === -1) {
                                tableRow.addAriaLabelledBy(that.totalCountHiddenElement);
                            }
                        }
                        return false; // stop after first line for now
                    });
                }.bind(resultTable)
            });

            return resultTable;
        },

        // assemble search result table item
        // ===================================================================
        assembleTableItems: function (bData) {
            var that = this;
            var oData = bData.getObject();
            if (oData.type === 'footer') {
                //                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem({
                    visible: false
                }); // return empty list item
            }
            return that.assembleTableMainItems(oData, bData.getPath());

        },

        assembleTableMainItems: function (oData, path) {
            var subPath = path + "/cells";
            var columnListItem = new sap.m.ColumnListItem({
                // one way binding of "selected"
                // UI5 has issue of two way binding
                selected: "{selected}"
                //                selected: {
                //                    parts: [{
                //                        path: 'selected'
                //                    }],
                //                    formatter: function(selected) {
                //                        return selected;
                //                    },
                //                    mode: sap.ui.model.BindingMode.OneWay
                //                }
            });
            columnListItem.bindAggregation("cells", subPath, function (subPath, bData) {
                if (bData.getObject().isTitle) {
                    // build title cell
                    var titleUrl = "";
                    var target;
                    var titleNavigation = bData.getObject().titleNavigation;
                    if (titleNavigation) {
                        titleUrl = titleNavigation.getHref();
                        target = titleNavigation.getTarget();
                    }
                    var enabled = !!((titleUrl && titleUrl.length > 0));
                    var titleLink = new SearchLink({
                        text: "{value}",
                        enabled: enabled,
                        href: titleUrl,
                        press: function () {
                            var titleNavigation = bData.getObject().titleNavigation;
                            if (titleNavigation) {
                                titleNavigation.performNavigation({
                                    trackingOnly: true
                                });
                            }
                        }
                    });

                    // for tooltip handling
                    // see in SearchResultTable.onAfterRendering for event handlers
                    titleLink.addStyleClass("sapUshellSearchResultListItem-MightOverflow");

                    if (target) {
                        titleLink.setTarget(target);
                    }
                    return titleLink;
                } else if ((bData.getObject().isRelatedApps)) {
                    // build related objects aka navigation objects cell
                    var navigationObjects = bData.getObject().navigationObjects;
                    var navigationButtons = [];
                    var navigationButton = {};
                    var pressButton = function (event, navigationObject) {
                        navigationObject.performNavigation();
                    };
                    /*eslint-disable no-loop-func*/
                    for (var i = 0; i < navigationObjects.length; i++) {
                        var navigationObject = navigationObjects[i];
                        navigationButton = new sap.m.Button({
                            text: navigationObject.getText(),
                            tooltip: navigationObject.getText()
                        });
                        navigationButton.attachPress(navigationObject, pressButton);
                        navigationButtons.push(navigationButton);
                    }
                    /*eslint-enable no-loop-func*/

                    return new sap.m.Button({
                        icon: "sap-icon://action",
                        press: function () {
                            var actionSheet = new sap.m.ActionSheet({
                                buttons: navigationButtons,
                                placement: sap.m.PlacementType.Auto
                            });
                            actionSheet.openBy(this);
                        }
                    });
                }
                // build other cells
                return new SearchLabel({
                        text: "{value}"
                    })
                    // for tooltip handling
                    // see in SearchResultTable.onAfterRendering for event handlers
                    .addStyleClass("sapUshellSearchResultListItem-MightOverflow");

            });

            return columnListItem;
        },
        // assemble show more table
        // ===================================================================

        onRegionClick: function (e) {
            //alert("onRegionClick " + e.getParameter("code"));
        },

        onRegionContextMenu: function (e) {
            //alert("onRegionContextMenu: " + e.getParameter("code"));
        },
        assembleSearchResultMap: function () {
            var oSearchResultMap = new SearchMap({
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "searchResultMap" && count !== 0;
                    }
                }
            });
            return oSearchResultMap;
        },
        // assemble show more footer
        // ===================================================================
        assembleShowMoreFooter: function () {
            var that = this;
            var button = new sap.m.Button({
                text: "{i18n>showMore}",
                type: sap.m.ButtonType.Transparent,
                press: function () {
                    var oCurrentModel = that.getModel();
                    oCurrentModel.setProperty('/focusIndex', oCurrentModel.getTop());
                    var newTop = oCurrentModel.getTop() + oCurrentModel.pageSize;
                    oCurrentModel.setTop(newTop);
                    oCurrentModel.eventLogger.logEvent({
                        type: oCurrentModel.eventLogger.SHOW_MORE
                    });
                }
            });
            button.addStyleClass('sapUshellResultListMoreFooter');
            var container = new sap.m.FlexBox({
                /* footer item in model no longer needed -> remove*/
                visible: {
                    parts: [{
                        path: '/boCount'
                    }, {
                        path: '/boResults'
                    }],
                    formatter: function (boCount, boResults) {
                        //                        switch (resultToDisplay) {
                        //                            case 'searchResultTable':
                        //                                return tableResults.length < boCount;
                        //                            case 'searchResultList':
                        //                                return boResults.length < boCount;
                        //                        }
                        return boResults.length < boCount;
                    }
                },
                justifyContent: sap.m.FlexJustifyContent.Center
            });
            container.addStyleClass('sapUshellResultListMoreFooterContainer');
            container.addItem(button);
            return container;
        },

        // main result list
        // ===================================================================
        assembleSearchResultList: function () {

            var that = this;

            that.resultList = new SearchResultList({
                mode: sap.m.ListMode.None,
                width: "auto",
                showNoData: false,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "searchResultList" && count !== 0;
                    }
                }
            });

            that.resultList.bindAggregation("items", "/results", function (path, oContext) {
                return that.assembleListItem(oContext);
            });

            return that.resultList;
        },

        // app search area
        // ===================================================================
        assembleAppSearch: function () {

            var that = this;

            // tiles container
            var tileContainer = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer("AppSearchContainer", {
                addAccInformation: true,
                maxRows: 99999,
                totalLength: '{/appCount}',
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "appSearchResult" && count !== 0;
                    }
                },
                highlightTerms: '{/uiFilter/searchTerm}',
                showMore: function () {
                    var model = that.getModel();
                    model.setProperty('/focusIndex', tileContainer.getNumberDisplayedTiles() - 1);
                    var newTop = model.getTop() + model.pageSize * tileContainer.getTilesPerRow();
                    model.setTop(newTop);
                }
            });

            tileContainer.bindAggregation('tiles', '/appResults', function (sId, oContext) {
                if (that.getModel().getResultToDisplay() === "appSearchResult") {
                    // bind tile view
                    return oContext.getObject().getView();
                }
                // bind dummy view, prevent douplicated binding
                // tile can handel only one view
                return new sap.m.Text({
                    text: ""
                });

            });

            tileContainer.addStyleClass('sapUshellSearchTileResultList');

            return tileContainer;
        },

        // assemble title item
        // ===================================================================
        assembleTitleItem: function (oData) {
            var item = new sap.m.CustomListItem();
            var title = new sap.m.Label({
                text: "{title}"
            });
            title.addStyleClass('bucketTitle');
            item.addStyleClass('bucketTitleContainer');
            item.addContent(new sap.m.HBox({
                items: [title]
            }));
            return item;
        },

        // assemble app container result list item
        // ===================================================================
        assembleAppContainerResultListItem: function (oData, path) {
            var that = this;
            var container = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer("AppSearchContainerResultListItem", {
                maxRows: sap.ui.Device.system.phone ? 2 : 1,
                totalLength: '{/appCount}',
                highlightTerms: '{/uiFilter/searchTerm}',
                enableKeyHandler: false,
                resultList: that.resultList,
                showMore: function () {
                    var model = that.getModel();
                    model.setDataSource(model.appDataSource);
                }
            });

            container.bindAggregation('tiles', 'tiles', function (sId, oContext) {
                if (that.getModel().getResultToDisplay() !== "appSearchResult") {
                    // bind tile view
                    return oContext.getObject().getView();
                }
                // bind dummy view, prevent douplicated binding
                // tile can handel only one view
                return new sap.m.Text({
                    text: ""
                });

            });

            var listItem = new sap.m.CustomListItem({
                content: container
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');
            listItem.addStyleClass('sapUshellSearchResultListItemApps');

            listItem.addEventDelegate({
                onAfterRendering: function (oEvent) {
                    var $listItem = $(listItem.getDomRef());
                    $listItem.removeAttr("tabindex");
                    $listItem.removeAttr("role");
                    $listItem.attr("aria-hidden", "true");
                }
            }, listItem);

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleResultListItem: function (oData, path) {
            var that = this;

            /* eslint new-cap:0 */
            var dataSourceConfig = this.getModel().config.getDataSourceConfig(oData.dataSource);

            var searchResultListItemSettings = {
                dataSource: oData.dataSource,
                title: "{title}",
                titleDescription: "{titleDescription}",
                titleNavigation: "{titleNavigation}",
                type: "{dataSourceName}",
                imageUrl: "{imageUrl}",
                imageFormat: "{imageFormat}",
                imageNavigation: "{imageNavigation}",
                geoJson: "{geoJson}",
                attributes: "{itemattributes}",
                navigationObjects: "{navigationObjects}",
                selected: "{selected}",
                expanded: "{expanded}",
                positionInList: "{positionInList}",
                resultSetId: "{resultSetId}",
                layoutCache: "{layoutCache}"
            };

            var item;
            if (dataSourceConfig.searchResultListItemControl) {
                item = new dataSourceConfig.searchResultListItemControl(searchResultListItemSettings);
            } else if (dataSourceConfig.searchResultListItemContentControl) {
                searchResultListItemSettings.content = new dataSourceConfig.searchResultListItemContentControl();
                item = new CustomSearchResultListItem(searchResultListItemSettings);
            } else {
                item = new SearchResultListItem(searchResultListItemSettings);
            }

            if (item.setTotalCountHiddenElement) {
                item.setTotalCountHiddenElement(that.totalCountHiddenElement);
            }

            var listItem = new sap.m.CustomListItem({
                content: item,
                type: sap.m.ListType.Inactive
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');

            if (item.setParentListItem) {
                item.setParentListItem(listItem);
            }

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleListItem: function (oContext) {
            var that = this;
            var oData = oContext.getObject();
            if (oData.type === 'title') {
                return that.assembleTitleItem(oData);
            } else if (oData.type === 'footer') {
                //                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem(); // return empty list item
            } else if (oData.type === 'appcontainer') {
                return that.assembleAppContainerResultListItem(oData, oContext.getPath());
            }
            return that.assembleResultListItem(oData, oContext.getPath());

        },

        // event handler search started
        // ===================================================================
        onAllSearchStarted: function () {
            //            var that = this;
            //            that.showMoreFooter.setVisible(false);
        },

        // event handler search finished
        // ===================================================================
        onAllSearchFinished: function () {
            var that = this;
            that.reorgTabBarSequence();
            that.oFocusHandler.setFocus();
            //that.updatePersoServiceAndController();
            var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');
            if (viewPortContainer && viewPortContainer.switchState) {
                viewPortContainer.switchState('Center');
            }
        },

        updatePersoServiceAndController: function () {
            var that = this;
            var model = that.getModel();
            var dsKey = model.getDataSource().id;
            var serviceId = 'search-result-table-state-' + dsKey;
            // var dsKey = model.getDataSource().id.replace(/[^a-zA-Z0-9-]/g, "");

            if (!that.oTablePersoController) {
                var personalizationStorageInstance = model.getPersonalizationStorageInstance();
                that.oTablePersoController = new sap.m.TablePersoController({
                    table: sap.ui.getCore().byId("ushell-search-result-table"),
                    persoService: personalizationStorageInstance.getPersonalizer(serviceId)
                }).activate();
                that.oTablePersoController.refresh();
            }
            if (that.oTablePersoController &&
                that.oTablePersoController.getPersoService().getKey() !== serviceId) {
                that.oTablePersoController.setPersoService(model.getPersonalizationStorageInstance().getPersonalizer(serviceId));
                that.oTablePersoController.refresh();
            }
        },

        // set table layout
        // fixed or NOT fixed
        // ===================================================================
        updateTableLayout: function () {
            var that = this;
            // set layout after persoConroller and persData initialized
            // then get columns which is personaized as visible
            if (that.searchResultTable && that.oTablePersoController) {
                var dsKey = that.getModel().getDataSource().id;
                var serviceId = 'search-result-table-state-' + dsKey;
                that.oTablePersoController.getPersoService(serviceId).getPersData().then(function (persData) {
                    if (persData && persData.aColumns) {
                        var psersColumns = persData.aColumns;
                        var tableColumns = this.searchResultTable.getColumns();
                        var visibleCloumns = 0;

                        for (var i = 0; i < psersColumns.length; i++) {
                            var index = psersColumns[i].id.split('table-searchColumnKey').pop();
                            var mappedColumn = tableColumns[parseInt(index, 10)];
                            if (mappedColumn) {
                                mappedColumn.setDemandPopin(false);
                                if (psersColumns[i].visible) {
                                    visibleCloumns++;
                                    mappedColumn.setDemandPopin(true);
                                    mappedColumn.setPopinDisplay(sap.m.PopinDisplay.Inline);
                                    var minScreenWidth = 12 * visibleCloumns;
                                    mappedColumn.setMinScreenWidth(minScreenWidth + "rem");
                                }
                            }
                        }
                        if (visibleCloumns <= 3) {
                            this.searchResultTable.setFixedLayout(false);
                        } else {
                            this.searchResultTable.setFixedLayout(true);
                        }
                    }
                }.bind(this));
            }
        },


        // set appview container
        // ===================================================================
        setAppView: function (oAppView) {
            var that = this;
            that.oAppView = oAppView;
            if (that.oTilesContainer) {
                that.oTilesContainer.setAppView(oAppView);
            }
        },


        // get controller name
        // ===================================================================
        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.search.container.Search";
        }
    });
});
