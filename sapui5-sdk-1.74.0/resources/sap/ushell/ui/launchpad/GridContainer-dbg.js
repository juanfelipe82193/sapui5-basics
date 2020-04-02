// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.GridContainer.
sap.ui.define([
    "sap/f/dnd/GridDropInfo",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/Control",
    "sap/ui/core/Icon",
    "sap/m/Input",
    "sap/m/Text",
    "sap/ushell/resources",
    "sap/f/GridContainer",
    "sap/f/GridContainerSettings",
    "sap/f/GridContainerItemLayoutData",
    "sap/ushell/utils",
    "sap/m/library",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/library",
    "sap/ushell/ui/launchpad/GridContainerRenderer"
], function (
    GridDropInfo,
    DragInfo,
    Control,
    Icon,
    Input,
    Text,
    resources,
    Ui5GridContainer,
    Ui5GridContainerSettings,
    Ui5GridContainerItemLayoutData,
    UshellUtils,
    mobileLibrary
) {
    "use strict";

    // shortcut for sap.m.HeaderLevel
    var HeaderLevel = mobileLibrary.HeaderLevel;

    var TILE_SIZE_BEHAVIOR = {
        RESPONSIVE: "Responsive",
        SMALL: "Small"
    };

    /**
     * Constructor for a new sap/ushell/ui/launchpad/GridContainer.
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that arranges Tile and Card controls.
     * @extends sap.ui.core.Control
     * @constructor
     * @protected
     * @name sap.ushell.ui.launchpad.GridContainer
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     * @since 1.62
     */
    var GridContainer = Control.extend("sap.ushell.ui.launchpad.GridContainer", /** @lends sap.ushell.ui.launchpad.GridContainer.prototype*/{
        metadata: {
            library: "sap.ushell",
            properties: {
                groupId:
                    { type: "string", group: "Misc", defaultValue: null },
                showHeader:
                    { type: "boolean", group: "Misc", defaultValue: true },
                defaultGroup:
                    { type: "boolean", group: "Misc", defaultValue: false },
                isLastGroup:
                    { type: "boolean", group: "Misc", defaultValue: false },
                headerText:
                    { type: "string", group: "Misc", defaultValue: null },
                headerLevel:
                    { type: "sap.m.HeaderLevel", group: "Misc", defaultValue: HeaderLevel.H2 },
                // Header level (H1-H6) used for headers of tile groups.
                groupHeaderLevel:
                    { type: "sap.m.HeaderLevel", group: "Misc", defaultValue: HeaderLevel.H4 },
                showGroupHeader:
                    { type: "boolean", group: "Misc", defaultValue: true },
                homePageGroupDisplay:
                    { type: "string", defaultValue: null },
                isGroupLocked:
                    { type: "boolean", group: "Misc", defaultValue: null },
                isGroupSelected:
                    { type: "boolean", group: "Misc", defaultValue: false },
                editMode:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showBackground:
                    { type: "boolean", group: "Misc", defaultValue: false },
                icon:
                    { type: "string", group: "Misc", defaultValue: "sap-icon://locked" },
                showIcon:
                    { type: "boolean", group: "Misc", defaultValue: false },
                enableHelp:
                    { type: "boolean", group: "Misc", defaultValue: false },
                tileActionModeActive:
                    { type: "boolean", group: "Misc", defaultValue: false },
                ieHtml5DnD:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showEmptyLinksArea:
                    { type: "boolean", group: "Misc", defaultValue: false },
                showEmptyLinksAreaPlaceHolder:
                    { type: "boolean", group: "Misc", defaultValue: false },
                // set to true if the LaunchPageAdapter supports link personalization
                supportLinkPersonalization:
                    { type: "boolean", group: "Misc", defaultValue: false },
                tileSizeBehavior:
                    { type: "string", group: "Misc", defaultValue: TILE_SIZE_BEHAVIOR.RESPONSIVE }
            },
            aggregations: {
                tiles: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "tile",
                    forwarding: {
                        getter: "_getInternalGrid",
                        aggregation: "items"
                    },
                    dnd: true
                },
                links:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "link" },
                _grid:
                    { type: "sap.f.GridContainer", multiple: false, visibility: "hidden" },
                beforeContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "beforeContent" },
                afterContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "afterContent" },
                footerContent:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "footerContent" },
                headerActions:
                    { type: "sap.ui.core.Control", multiple: true, singularName: "headerAction" }
            },
            events: {
                afterRendering: {},
                // this event is triggered when the group title is modified
                titleChange: {},
                tileDragStart: {},
                tileDragEnter: {},
                tileDrop: {},
                layoutChange: {}
            },
            dnd: { draggable: true, droppable: true }
        }
    });

    GridContainer.prototype.init = function () {
        var oUi5GridContainer = new Ui5GridContainer({
            snapToRow: true,
            layoutChange: this.fireLayoutChange.bind(this),
            containerQuery: true
        });

        this.setAggregation("_grid", oUi5GridContainer);

        this.oNoLinksText = new Text({
            text: resources.i18n.getText("emptyLinkContainerInEditMode")
        }).addStyleClass("sapUshellNoLinksAreaPresentTextInner");

        this.oTransformationErrorText = new Text({
            text: resources.i18n.getText("transformationErrorText")
        }).addStyleClass("sapUshellTransformationErrorText");

        this.oTransformationErrorIcon = new Icon({
            src: "sap-icon://message-error"
        }).addStyleClass("sapUshellTransformationErrorIcon");

        this.oIcon = new Icon({
            src: this.getIcon()
        });
        this.oIcon.addStyleClass("sapUshellContainerIcon");

        this.oEditInputField = new Input({
            placeholder: resources.i18n.getText("new_group_name"),
            value: this.getHeaderText(),
            maxLength: 100
        }).addStyleClass("sapUshellTileContainerTitleInput");

        this.oEditInputField.addEventDelegate({
            onfocusout: this.setEditMode.bind(this, false),
            onsapenter: this.setEditMode.bind(this, false)
        });

        this._setGridLayout();
    };

    GridContainer.prototype.exit = function () {
        if (this.oNoLinksText) {
            this.oNoLinksText.destroy();
        }

        if (this.oTransformationErrorText) {
            this.oTransformationErrorText.destroy();
        }

        if (this.oTransformationErrorIcon) {
            this.oTransformationErrorIcon.destroy();
        }

        if (this.oIcon) {
            this.oIcon.destroy();
        }

        if (this.oEditInputField) {
            this.oEditInputField.destroy();
        }

        Control.prototype.exit.apply(this, arguments);
    };

    GridContainer.prototype.onAfterRendering = function () {
        var oTitleText = window.document.getElementById(this.getId() + "-titleText");
        if (oTitleText) {
            oTitleText.addEventListener("click", function () {
                var bEnableRenameLockedGroup = this.getModel() && this.getModel().getProperty("/enableRenameLockedGroup"),
                    bEditMode = (bEnableRenameLockedGroup || !this.getIsGroupLocked())
                        && !this.getDefaultGroup()
                        && this.getTileActionModeActive();
                this.setEditMode(bEditMode);
            }.bind(this));
        }

        var oEditDomRef = this.oEditInputField.getDomRef();
        if (oEditDomRef) {
            setTimeout(function () {
                oEditDomRef.querySelector("input").focus();
                this.oEditInputField.selectText(0, this.oEditInputField.getValue().length);
            }.bind(this), 0);
        }

        var oEventBus = sap.ui.getCore().getEventBus();
        oEventBus.publish("launchpad", "GroupHeaderVisibility");
        this.fireAfterRendering();
    };

    GridContainer.prototype.getShowPlaceholder = function () {
        // TODO: Function should be deleted if we remove feature switch 'Config.last("/core/home/gridContainer")'
        return false;
    };

    GridContainer.prototype.setGroupId = function (sValue) {
        this.setProperty("groupId", sValue, true);
        return this;
    };

    GridContainer.prototype.groupHasTiles = function () {
        var aTiles = this.getTiles();

        if (this.getBindingContext()) {
            var sPath = this.getBindingContext().sPath;
            aTiles = this.getModel().getProperty(sPath).tiles;
        }

        return UshellUtils.groupHasVisibleTiles(aTiles, []);
    };

    GridContainer.prototype.getInnerContainersDomRefs = function () {
        var oContainerDOM = this.getDomRef();

        if (!oContainerDOM) {
            return null;
        }

        var oInnerContainer = oContainerDOM.querySelector(".sapUshellTilesContainer-sortable"),
            oLinksContainer = oContainerDOM.querySelector(".sapUshellLineModeContainer");

        return [oInnerContainer, oLinksContainer];
    };

    GridContainer.prototype.setTileActionModeActive = function (bValue) {
        if (this.getTileActionModeActive() === bValue) {
            return;
        }

        this.setProperty("tileActionModeActive", bValue);

        var oGrid = this.getAggregation("_grid");

        if (bValue) {
            oGrid.addDragDropConfig(new DragInfo({
                groupName: "GridContainer",
                sourceAggregation: "items",
                dragStart: function () {
                    this.fireTileDragStart();
                }.bind(this)
            }));
            oGrid.addDragDropConfig(new GridDropInfo({
                groupName: "GridContainer",
                dropLayout: sap.ui.core.dnd.DropLayout.Horizontal,
                dropPosition: sap.ui.core.dnd.DropPosition.Between,
                targetAggregation: "items",
                dropIndicatorSize: function (oItem) {
                    return this._getItemLayoutData(oItem);
                }.bind(this),
                drop: function (oInfo) {
                    this.fireTileDrop(oInfo.getParameters());
                }.bind(this),
                dragEnter: function () {
                    this.fireTileDragEnter();
                }.bind(this)
            }));
        } else {
            oGrid.destroyDragDropConfig();
        }
    };

    /**
     * Sets the editMode for the GridContainer
     *
     * @param {boolean} bValue Set editMode to true or false.
     * @param {boolean} [bNewGroup] If true (i.e. the function was called through the creation of a new GridContainer)
     * the input field will be set to an empty string to only show the placeholder.
     * Otherwise it will be set to the previous header text.
     */
    GridContainer.prototype.setEditMode = function (bValue, bNewGroup) {
        if (this.getEditMode() === bValue) {
            return;
        }

        this.setProperty("editMode", bValue, false);
        this.getModel().setProperty("/editTitle", bValue, false);

        if (bValue) {
            this.addStyleClass("sapUshellEditing");
            this.oEditInputField.setValue(bNewGroup ? "" : this.getHeaderText());

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("launchpad", "scrollToGroup", {
                group: this,
                groupChanged: false,
                focus: false
            });
        } else {
            this.removeStyleClass("sapUshellEditing");

            var sNewTitle = this.oEditInputField.getValue();
            sNewTitle = sNewTitle.substring(0, 256).trim() || this.oEditInputField.getPlaceholder();

            if (sNewTitle && sNewTitle !== this.getHeaderText()) {
                this.fireTitleChange({
                    newTitle: sNewTitle
                });
                this.setHeaderText(sNewTitle);
            }
        }
    };

    GridContainer.prototype.setShowEmptyLinksArea = function (bValue) {
        this.setProperty("showEmptyLinksArea", bValue, true);
        this.toggleStyleClass("sapUshellLinksAreaHidden", !bValue);
    };

    GridContainer.prototype.setShowEmptyLinksAreaPlaceHolder = function (bValue) {
        this.setProperty("showEmptyLinksArea", bValue, true);
        this.toggleStyleClass("sapUshellTileContainerEditMode", bValue);
        this.toggleStyleClass("sapUshellTileContainerTabsModeEmptyLinksArea", bValue);
        this.toggleStyleClass("sapUshellEmptyLinksAreaPlaceHolder", !bValue);
    };

    GridContainer.prototype.setTileSizeBehavior = function (sTileSizeBehavior) {
        this.setProperty("tileSizeBehavior", sTileSizeBehavior);
        this._setGridLayout();
    };

    GridContainer._generateSetting = function (sSize, iColumns) {
        return new Ui5GridContainerSettings({
            columns: iColumns,
            rowSize: sSize,
            columnSize: sSize,
            gap: "0.5rem"
        });
    };

    GridContainer.prototype._setGridLayout = function () {
        var sTileSizeBehavior = this.getProperty("tileSizeBehavior"),
            oUi5GridContainer = this._getInternalGrid(),
            oLayoutSetting;

        oLayoutSetting = sTileSizeBehavior === "Small" ? {
            oBreakpoints: { "S": 4, "M": 6, "L": 12, "XL": 16 },
            sSize: "4.375rem"
        } : {
            oBreakpoints: { "S": 4, "M": 6, "L": 10, "XL": 14 },
            sSize: "5.25rem"
        };

        oUi5GridContainer.setLayout(new Ui5GridContainerSettings({
            rowSize: oLayoutSetting.sSize,
            columnSize: oLayoutSetting.sSize,
            gap: "0.5rem"
        }));

        oUi5GridContainer.setLayoutXS(GridContainer._generateSetting("4.375rem", 4));
        oUi5GridContainer.setLayoutS(GridContainer._generateSetting(oLayoutSetting.sSize, oLayoutSetting.oBreakpoints.S));
        oUi5GridContainer.setLayoutM(GridContainer._generateSetting(oLayoutSetting.sSize, oLayoutSetting.oBreakpoints.M));
        oUi5GridContainer.setLayoutL(GridContainer._generateSetting(oLayoutSetting.sSize, oLayoutSetting.oBreakpoints.L));
        oUi5GridContainer.setLayoutXL(GridContainer._generateSetting(oLayoutSetting.sSize, oLayoutSetting.oBreakpoints.XL));

        return this;
    };

    GridContainer.prototype._getInternalGrid = function () {
        return this.getAggregation("_grid");
    };

    GridContainer.prototype.addAggregation = function (sAggregationName, oObject) {
        Control.prototype.addAggregation.apply(this, arguments);

        if (sAggregationName === "tiles") {
            this._addItemLayoutData(oObject);
        }

        return this;
    };

    GridContainer.prototype.insertAggregation = function (sAggregationName, oObject, iIndex) {
        Control.prototype.insertAggregation.apply(this, arguments);

        if (sAggregationName === "tiles") {
            this._addItemLayoutData(oObject);
        }

        return this;
    };

    /**
     * Returns the LayoutData for the given item.
     *
     * @param {sap.ui.core.Control} oItem The item to retrieve the LayoutData from.
     * @returns {sap.ui.core.LayoutData} The LayoutData object.
     * @private
     */
    GridContainer.prototype._getItemLayoutData = function (oItem) {
        var oLayoutData = { rows: 2, columns: 2 }; // fallback value

        if (oItem.isA("sap.ushell.ui.launchpad.Tile")) {
            oLayoutData = {
                rows: 2,
                columns: {
                    path: "long",
                    formatter: GridContainer._getItemLayoutColumn
                }
            };
        } else if (oItem.isA("sap.m.GenericTile")) {
            oLayoutData = {
                rows: 2,
                columns: 2
            };
        } else if (oItem.isA("sap.ui.integration.widgets.Card")) {
            var oCardManifest = oItem.getManifest(),
                sCardRow = UshellUtils.getMember(oCardManifest, "sap|flp.rows") || 3,
                sCardColumn = UshellUtils.getMember(oCardManifest, "sap|flp.columns") || 3;

            oLayoutData = {
                rows: parseInt(sCardRow, 10),
                columns: parseInt(sCardColumn, 10)
            };
        }

        return oLayoutData;
    };

    /**
     * Adds LayoutData to the given item.
     *
     * @param {sap.ui.core.Control} oItem The item to add LayoutData to.
     * @private
     */
    GridContainer.prototype._addItemLayoutData = function (oItem) {
        var oLayoutData = this._getItemLayoutData(oItem),
            oItemLayout = new Ui5GridContainerItemLayoutData(oLayoutData);

        oItem.setLayoutData(oItemLayout);
    };

    /**
     * @param {boolean} bLong An item is long or not
     * @returns {string} The column layout of the item
     * @private
     */
    GridContainer._getItemLayoutColumn = function (bLong) {
        return bLong ? 4 : 2;
    };

    /**
     * @returns {string} The maximum number of items
     */
    GridContainer.prototype.getMaximumItemNumber = function () {
        return this._getInternalGrid().getActiveLayoutSettings().getColumns() / 2;
    };

    /**
     * @returns {string} The active gap size in pixels
     */
    GridContainer.prototype.getActiveGapSize = function () {
        return this._getInternalGrid().getActiveLayoutSettings().getGapInPx();
    };

    return GridContainer;
});
