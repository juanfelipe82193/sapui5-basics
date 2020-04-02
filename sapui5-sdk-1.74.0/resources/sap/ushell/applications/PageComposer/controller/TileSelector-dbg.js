// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides functionality for "sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"
 */
sap.ui.define([
    "sap/m/library",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/ResponsivePopover",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ushell/services/Container" // required for "sap.ushell.Container.getServiceAsync()"
], function (
    mobileLibrary,
    Button,
    List,
    StandardListItem,
    ResponsivePopover,
    JSONModel,
    Filter,
    FilterOperator,
    Sorter
    // Container
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    /**
     * TileSelector constructor
     *
     * @constructor
     *
     * @protected
     */
    return function () {
        var oParentView,
            oTree,
            oToolbar,
            oAddSelectedTilesButton,
            oAddSingleTileItem,
            oSectionList,
            oSectionSelectionPopover,
            fnAddTileHandler,
            bSortAscending,
            resources = {};

        /**
         * Initializes the TileSelector, must be called before usage.
         *
         * @param {sap.ui.core.mvc.Controller} oController A reference to the controller it is going to be used on.
         *
         * @private
         */
        this.init = function (oController) {
            oParentView = oController.getView();
            oTree = oParentView.byId("tileSelectorList");
            oToolbar = oParentView.byId("tileSelectorToolbar");
            oAddSelectedTilesButton = oParentView.byId("tileSelectorAddButton");

            resources.i18n = oController.getResourceBundle();

            oTree.setBusy(true);

            oSectionList = new List({
                mode: ListMode.MultiSelect,
                showSeparators: ListSeparators.None,
                includeItemInSelection: true,
                selectionChange: function () { oSectionSelectionPopover.getBeginButton().setEnabled(!!oSectionList.getSelectedItem()); },
                items: {
                    path: "/page/content/sections",
                    template: new StandardListItem({ title: "{title}" })
                },
                noDataText: resources.i18n.getText("Message.NoSections")
            }).setModel(oParentView.getModel());

            oAddSelectedTilesButton.setEnabled(false);
            oTree.attachSelectionChange(this._onSelectionChange);
        };


        /**
         * @typedef {object} oCatalogData The catalog object
         * @property {array} [aTreeOverride] If present, other properties should be ignored and this property should be
         * used as the catalog tree instead of building one using the other properties.
         * @property {array} catalogTitles An array of catalog titles
         * @property {array} catalogTiles An array of arrays of tiles (one array of tiles for each catalog)
         * @property {object} catalogTilesData A map from vizId to tile data
         */

        /**
         * Consumes catalog data and builds the catalog tree, replacing the model with it.
         *
         * @param {oCatalogData} oCatalogData The catalog object
         *
         * @private
         */
        this.initTiles = function (oCatalogData) {
            if (oCatalogData.aTreeOverride) {
                _setCatalogTree(oCatalogData.aTreeOverride);
                return;
            }

            var aCatalogTree = oCatalogData.catalogTiles.reduce(function (tree, tiles, i) {
                if (tiles.length) {
                    tree.push({
                        catalogTitle: oCatalogData.catalogTitles[i],
                        tiles: tiles.map(function (tile) {
                            return oCatalogData.catalogTilesData[tile.vizId];
                        }).sort(function (a, b) { // sorts tiles by title in ascending lexicographical order
                            if (a.title > b.title) { return 1; }
                            if (a.title < b.title) { return -1; }
                            return 0;
                        })
                    });
                }
                return tree;
            }, []);
            _setCatalogTree(aCatalogTree);
        };

        /**
         * Sets the role context in the roles model to provide information for the InfoToolbar
         *
         * @param {string[]} aSelectedRoles The IDs of the roles that were selected by the ContextSelector
         * @param {boolean} bAllSelected Whether all available roles are selected
         */
        this.setRoleContext = function (aSelectedRoles, bAllSelected) {
            var oModel = oParentView.getModel("roles");
            var sActiveRoleContextInfo = bAllSelected
                ? "(" + resources.i18n.getText("Message.AllRolesSelected") + ")"
                : "(" + aSelectedRoles.length.toString() + ")";

            oModel.setProperty("/activeRoleContext", aSelectedRoles);
            oModel.setProperty("/activeRoleContextInfo", sActiveRoleContextInfo); // to be displayed in an InfoToolbar
            oModel.setProperty("/showRoleContextInfo", !bAllSelected);
        };

        /**
         * Intended to be called by the view (e.g. a SearchField) for handling tile search events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSearchTiles = function (/*oEvent*/) {
            searchForTiles();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling add tile events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onAddTiles = function (oEvent) {
            var aSectionListItems = oSectionList.getItems(),
                oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
                var sBindingContextPath = oBindingContext.getPath();
                oAddSingleTileItem = oTree.getItems().filter(function (item) {
                    return (item.getBindingContextPath() === sBindingContextPath);
                })[0];
            } else {
                oAddSingleTileItem = undefined;
            }
            if (aSectionListItems.length === 1) { // skip asking to which section(s) if there is only one section
                aSectionListItems[0].setSelected(true);
                _addTiles();
            } else {
                _openSectionSelectionPopover(oEvent);
            }
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling sort catalogs toggle events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSortCatalogsToggle = function (/*oEvent*/) {
            sortCatalogsToggle();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling collapse all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCollapseAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(true);
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling expand all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onExpandAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(false);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling catalog item press events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCatalogItemPress = function (oEvent) {
            _toggleCollapseTreeItem(oEvent.getParameters().listItem);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling selection change events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         *
         * @private
         */
        this._onSelectionChange = function (oEvent) {
            if (oSectionSelectionPopover && oSectionSelectionPopover.isOpen()) {
                oSectionSelectionPopover.getBeginButton().setEnabled(false);
                oSectionSelectionPopover.close();
            }
            if (oEvent) {
                oEvent.getParameters().listItems.forEach(function (item) {
                    if (item.getBindingContext().getProperty().tiles) { // catalog (root item)
                        item.setSelected(false); // currently, catalogs should not be selectable
                        _toggleCollapseTreeItem(item); // instead, allow toggling collapse with space bar
                    }
                });
            }
            oAddSelectedTilesButton.setEnabled(!!_getSelectedTreeItemsData().length);
        };

        /**
         * Sets a callback function for the add tiles event.
         *
         * @param {function} newAddTileHandler The callback function to be called when adding tiles.
         *   This function receives two arguments in the following order:
         *     1. A tile object.
         *     2. An array of section indices.
         *
         * @private
         */
        this.setAddTileHandler = function (newAddTileHandler) {
            fnAddTileHandler = newAddTileHandler;
        };

        /**
         * Called when starting to drag a tile.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onDragStart = function (oEvent) {
            var oItemData = oEvent.getParameter("target").getBindingContext().getProperty();
            if (!oItemData.vizId) { // prevent dragging of items without vizId
                oEvent.preventDefault();
                return;
            }
            oEvent.getParameter("dragSession").setComplexData("callback", function callback (tileIndex, sectionIndex) {
                fnAddTileHandler(oItemData, [sectionIndex], tileIndex);
            });
        };

        /**
         * Sets the Tree model with the provided catalog tree.
         *
         * @param {object[]} aCatalogTree The catalog tree to be set on the Tree model.
         *
         * @private
         */
        function _setCatalogTree (aCatalogTree) {
            oAddSelectedTilesButton.setEnabled(false);
            var oModel = new JSONModel({ catalogs: aCatalogTree });
            oModel.setSizeLimit(Infinity); // allow more list bindings than the model default limit of 100 entries
            oTree.setModel(oModel);
            bSortAscending = true;
            sortCatalogsToggle();
            oTree.expandToLevel(1);
            oTree.setBusy(false);
        }

        /**
         * Handler for searching tiles using the SearchField input.
         *
         * @private
         */
        function searchForTiles () {
            var sSearchText = oParentView.getModel().getProperty("/searchText") || "";
            oTree.getBinding("items").filter([
                new Filter([
                    new Filter("title", FilterOperator.Contains, sSearchText),
                    new Filter("subTitle", FilterOperator.Contains, sSearchText)
                ], false)
            ]);
        }

        /**
         * Toggles the sort order (ascending/descending) of the catalog tree, restricted to the first tree level (i.e. the catalog level).
         *
         * @private
         */
        function sortCatalogsToggle () {
            bSortAscending = !bSortAscending;
            var oItems = oTree.getBinding("items"),
                oSorterCatalog = new Sorter("catalogTitle", bSortAscending);
            oItems.sort(oSorterCatalog);
        }

        /**
         * Controls collapsing and expanding all catalogs.
         *
         * @param {boolean} bCollapse Whether it should collapse all catalogs instead of expanding all catalogs.
         *
         * @private
         */
        function collapseAllCatalogs (bCollapse) {
            if (bCollapse) {
                oTree.collapseAll();
            } else {
                oTree.expandToLevel(1);
            }
        }

        /**
         * Toggles the collapse state of a tree item between collapsed and expanded.
         *
         * @param {sap.m.TreeItemBase} oTreeItem The tree item to have its collapse state toggled.
         *
         * @private
         */
        function _toggleCollapseTreeItem (oTreeItem) {
            var iTreeItemIndex = oTree.indexOfItem(oTreeItem);
            if (oTreeItem.getExpanded()) {
                oTree.collapse(iTreeItemIndex);
            } else {
                oTree.expand(iTreeItemIndex);
            }
        }

        /**
         * Get the item data of every selected tree item.
         * This is needed because "getSelectedItems()" do not return selected items within collapsed parents.
         *
         * @returns {object[]} An array of selected tree item data.
         *
         * @private
         */
        function _getSelectedTreeItemsData () {
            return oTree.getSelectedContextPaths().map(function (sSelectedItemContextPath) {
                return oTree.getModel().getContext(sSelectedItemContextPath).getProperty();
            });
        }

        /**
         * Opens the add tiles popover, containing the section list for selection of the tiles target sections.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the operation (e.g. a click on the "Add" button).
         *
         * @private
         */
        function _openSectionSelectionPopover (oEvent) {
            if (!oSectionSelectionPopover || oSectionSelectionPopover.bIsDestroyed) {
                _createSectionSelectionPopover();
            }
            oSectionList.removeSelections(true);
            oSectionSelectionPopover.getBeginButton().setEnabled(false);
            oSectionSelectionPopover.getEndButton().setEnabled(true);
            if (!oAddSingleTileItem && _isOverflownInOverflowToolbar(oAddSelectedTilesButton)) {
                oSectionSelectionPopover.openBy(oToolbar.getAggregation("_overflowButton"));
            } else {
                oSectionSelectionPopover.openBy(oEvent.getSource());
            }
        }

        /**
         * Checks if a control is currently overflown inside of an OverflowToolbar.
         *
         * @param {sap.ui.core.Control} oControl The control to check.
         * @returns {boolean} Whether the control is or is not overflown inside of an OverflowToolbar.
         *
         * @private
         */
        function _isOverflownInOverflowToolbar (oControl) {
            return (oControl.hasStyleClass("sapMOTAPButtonNoIcon") || oControl.hasStyleClass("sapMOTAPButtonWithIcon"));
        }

        /**
         * Creates the section selection popover, used to select to which section(s) the tile(s) should go to.
         *
         * @private
         */
        function _createSectionSelectionPopover () {
            oSectionSelectionPopover = new ResponsivePopover({
                placement: PlacementType.Auto,
                title: resources.i18n.getText("Tooltip.AddToSections"),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: resources.i18n.getText("Button.Add"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); _addTiles(); }
                }),
                endButton: new Button({
                    text: resources.i18n.getText("Button.Cancel"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); }
                }),
                content: oSectionList,
                initialFocus: oSectionList
            });
            oParentView.addDependent(oSectionSelectionPopover);
        }

        /**
         * Calls the handler for adding tiles. Does nothing if no function is set for the add tiles handler.
         *
         * @see setAddTileHandler
         *
         * @private
         */
        var _addTiles = function () {
            if (typeof fnAddTileHandler !== "function") {
                return;
            }
            var aSelectedSectionsIndexes = oSectionList.getSelectedItems().map(function (oSelectedSection) {
                return oSectionList.indexOfItem(oSelectedSection);
            });
            var aTileData;
            if (oAddSingleTileItem) {
                aTileData = [oAddSingleTileItem.getBindingContext().getProperty()]; // adds a single tile (from its own "Add" button)
            } else {
                aTileData = _getSelectedTreeItemsData(); // adds all selected tiles (from header "Add" button)
            }

            aTileData.forEach(function (oTileData) {
                fnAddTileHandler(oTileData, aSelectedSectionsIndexes);
            });

            if (!oAddSingleTileItem) { // unselect all tiles when adding through the header "Add" button
                oTree.removeSelections(true);
                this._onSelectionChange();
            } else if (oAddSingleTileItem.getSelected()) {
                oAddSingleTileItem.setSelected(false);
                this._onSelectionChange();
            }
        }.bind(this);
    };
});
