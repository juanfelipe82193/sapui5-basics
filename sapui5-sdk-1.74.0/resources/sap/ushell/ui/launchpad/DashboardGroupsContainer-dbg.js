// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Control",
    "sap/ui/core/InvisibleText",
    "sap/ui/core/ResizeHandler",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/override",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ui/Device",
    "./DashboardGroupsContainerRenderer"
], function (ManagedObject, Control, InvisibleText, ResizeHandler, library, resources, override, utils, Config, Device) {
    "use strict";

    var DEVICE_SET = "UShellTileDeviceSet";

    /**
     * Constructor for a new ui/launchpad/DashboardGroupsContainer.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the newui/launchpad/DashboardGroupsContainer
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @name sap.ushell.ui.launchpad.DashboardGroupsContainer
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var DashboardGroupsContainer = Control.extend("sap.ushell.ui.launchpad.DashboardGroupsContainer", /** @lends sap.ushell.ui.launchpad.DashboardGroupsContainer.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {

                /**
                 * An value for an optional accessibility label
                 */
                accessibilityLabel: { type: "string", defaultValue: null },

                /**
                 */
                displayMode: { type: "string", defaultValue: null },

                _gridEnabled: { type: "boolean", defaultValue: false }
            },
            aggregations: {

                /**
                 */
                groups: {type: "sap.ui.core.Control", multiple: true, singularName: "group"}
            },
            events: {

                /**
                 */
                afterRendering: {}
            }
        }
    });

    DashboardGroupsContainer.prototype.init = function () {
        // Create dynamic style container
        this._getDynamicStyleElement();

        if (!Device.media.hasRangeSet(DEVICE_SET)) {
            Device.media.initRangeSet(DEVICE_SET, [ 374 ], "px", ["Small", "Responsive"], true);
        }

        this._iContainerWidth = null;
        this._oTileDimensions = null;
        this._bRangeSetSmall = false;

        if (Config.last("/core/home/gridContainer")) {
            this.setProperty("_gridEnabled", true);
        } else {
            this.setProperty("_gridEnabled", false);
        }

        ResizeHandler.register(this, this._handleResize.bind(this));

        // add invisible texts in order to support screen reader support on tiles inside the dashboard
        this.addInvisibleAccessabilityTexts();

        this._oConfigChange = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
            this._sSizeBehavior = sSizeBehavior;

            this._updateTileContainer(true);
        }.bind(this));

        if (!sap.ui.getCore().isInitialized()) {
            sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));
        } else {
            this._handleCoreInitialized();
        }
    };

    /**
     * Handler for the core's init event. In order for the control to be updated only if all themes
     * are loaded and everything is properly initialized, we attach a theme check in here.
     *
     * @private
     */
    DashboardGroupsContainer.prototype._handleCoreInitialized = function () {
        sap.ui.getCore().attachThemeChanged(this._handleThemeApplied, this);
    };

    /**
     * Triggers an update of the link container if the theme is applied at a later point in time to ensure a correct
     * rendering. This is necessary for custom themes which are loaded too late, resulting in a wrong calculation.
     *
     * @private
     */
    DashboardGroupsContainer.prototype._handleThemeApplied = function () {
        sap.ui.getCore().detachThemeChanged(this._handleThemeApplied, this);

        this._updateTileContainer(true);
    };

    DashboardGroupsContainer.prototype.exit = function () {
        if (this._oStyleElement) {
            document.head.removeChild(this._oStyleElement); // ChildNode.remove not available in IE
        }
        delete this._oStyleElement;
        this._oConfigChange.off();

        if (this.oTileText) {
            this.oTileText.destroy();
        }

        if (this.oTileEditModeText) {
            this.oTileEditModeText.destroy();
        }

        Device.media.detachHandler(this._handleMediaChange, this, DEVICE_SET);

        Control.prototype.exit.apply(this, arguments);
    };

    /**
     * Handles the resizing of the Dashboard Groups Container control.
     * Updates the line tile container unless only the height changes.
     *
     * @param {jQuery.Event} event The jQuery event object
     * @private
     */
    DashboardGroupsContainer.prototype._handleResize = function (event) {
        if (event.size.width > 0 && event.size.width !== event.oldSize.width) {
            this._updateTileContainer();
        }
    };

    /**
     * Calculates the new number of tiles that fit in one row.
     * If the number changes, the global style for Line Tile Containers is adapted to exactly fit the new width of the tiles.
     *
     * @param {boolean} [refresh] Whether to refresh the dimensions from a new DOM element if e.g. tile size changed
     * @private
     */
    DashboardGroupsContainer.prototype._updateTileContainer = function (refresh) {
        var oInnerContainer = this._getInnerTileContainer();
        if (!oInnerContainer) {
            return;
        }

        var bSmall = this._sSizeBehavior === "Small" || this._bRangeSetSmall;
        var oTileDimensions = this._getTileDimensions(bSmall, refresh);
        var oContainerDimensions = this._getElementDimensions(oInnerContainer);
        var iTileWidth = oTileDimensions.width;
        var iMarginEnd;
        var iMaxTilesPerRow;

        if (this.getProperty("_gridEnabled")) {
            var aGroups = this.getGroups();
            if (aGroups.length > 0) {
                var oGroup = aGroups[0];

                if (!oGroup.hasListeners("layoutChange")) {
                    oGroup.attachEvent("layoutChange", this._updateTileContainer.bind(this));
                }

                if (oGroup.getTileSizeBehavior() !== this._sSizeBehavior) {
                    oGroup.setTileSizeBehavior(this._sSizeBehavior);
                }
                iMarginEnd = oGroup.getActiveGapSize();
                iTileWidth = iTileWidth + iMarginEnd;
                iMaxTilesPerRow = oGroup.getMaximumItemNumber();
            }
        } else {
            iMarginEnd = oTileDimensions.marginEnd;
            iTileWidth = iTileWidth + iMarginEnd;
            iMaxTilesPerRow = Math.floor(oContainerDimensions.width / iTileWidth);
        }
        var iTileContainerWidth = iTileWidth * iMaxTilesPerRow - oTileDimensions.marginEnd;

        var bChanged = this._iContainerWidth !== iTileContainerWidth;

        if (bChanged) {
            this._iContainerWidth = iTileContainerWidth;

            this._updateTileContainerWidth(iTileContainerWidth);
        }
    };

    /**
     * Searches for the inner tile container of the first non-hidden group and returns it.
     *
     * @returns {HTMLElement} An HTMLELement instance or null if the container cannot be found
     * @private
     */
    DashboardGroupsContainer.prototype._getInnerTileContainer = function () {
        var oDomRef = this.getDomRef();
        if (!oDomRef) {
            return null;
        }

        var oTileContainerContent,
            aTileContainerContentList = oDomRef.querySelectorAll(".sapUshellTileContainerContent");

        // A group might be hidden. If that is the case, its dimensions cannot be used to
        // calculate the number of tiles that fit in one row. We need to find the first visible group.
        for (var i = 0; i < aTileContainerContentList.length; ++i) {
            if (!aTileContainerContentList[i].parentElement.classList.contains("sapUshellHidden")) {
                oTileContainerContent = aTileContainerContentList[i];
                break;
            }
        }

        if (oTileContainerContent) {
            return oTileContainerContent.querySelector(".sapUshellInner");
        }

        return null;
    };

    /**
     * Retrieves or creates the sap-ushell-dynamic-style style element and appends it to the document head.
     * This can be used to globally apply new style rules.
     *
     * @returns {HTMLElement} An HTMLElement instance
     * @private
     */
    DashboardGroupsContainer.prototype._getDynamicStyleElement = function () {
        if (!this._oStyleElement) {
            this._oStyleElement = document.createElement("style");

            document.head.appendChild(this._oStyleElement);
        }

        return this._oStyleElement;
    };

    /**
     * Sets the given tile container width in pixels as the width of all Line Mode Tile Containers.
     *
     * @param {int} tileContainerWidth The width of all Line Mode Tile Containers in pixels
     * @private
     */
    DashboardGroupsContainer.prototype._updateTileContainerWidth = function (tileContainerWidth) {
        var oStyleElement = this._getDynamicStyleElement();

        oStyleElement.innerHTML = ".sapUshellLineModeContainer, .sapUshellLinksContainer { width: " + tileContainerWidth + "px; }";
    };

    /**
     * Retrieves an sapUshellTile's effective dimensions by adding a ghost element to the DOM and then
     * reading its resulting styles.
     *
     * @param {boolean} small Whether to use the small version of the tile class
     * @param {boolean} refresh Whether to refresh the dimensions from a new DOM element if e.g. tile size changed
     * @returns {object} An object containing the tile's width, height, end margin and bottom margin as floats
     * @private
     */
    DashboardGroupsContainer.prototype._getTileDimensions = function (small, refresh) {
        if (this._oTileDimensions && !refresh) {
            return this._oTileDimensions;
        }

        var oTileElement = document.createElement("div");

        oTileElement.style.visibility = "hidden";
        oTileElement.classList.add("sapUshellTile");

        if (small) {
            oTileElement.classList.add("sapUshellSmall");
        }

        document.body.appendChild(oTileElement);
        this._oTileDimensions = this._getElementDimensions(oTileElement);
        document.body.removeChild(oTileElement);

        return this._oTileDimensions;
    };

    /**
     * Retrieves the effective dimensions of the given HTMLElement instance.
     *
     * @param {HTMLElement} element The element to be measured
     * @returns {object} An object containing the horizontal measurements of the given element
     * @private
     */
    DashboardGroupsContainer.prototype._getElementDimensions = function (element) {
        var oStyles = window.getComputedStyle(element);
        var bRTL = sap.ui.getCore().getConfiguration().getRTL();
        var iMarginEnd = bRTL ? oStyles.marginLeft : oStyles.marginRight;

        return {
            width: parseFloat(oStyles.width), // Must use parseFloat as IE calculates with pixel fractions
            marginEnd: parseFloat(iMarginEnd)
        };
    };

    /**
     * @name sap.ushell.ui.launchpad.DashboardGroupsContainer
     *
     * @private
     */

    // Overwrite update function (version without filter/sort support)
    DashboardGroupsContainer.prototype.updateGroups = override.updateAggregatesFactory("groups");
    // Alternative (supports all bindings, uses default as fallback)
    // sap.ushell.ui.launchpad.TileContainer.prototype.updateAggregation = sap.ushell.override.updateAggregation;

    DashboardGroupsContainer.prototype.onAfterRendering = function () {
        var that = this,
            oConfigMarks = {bUseUniqueMark: true};

        if (this.onAfterRenderingTimer) {
            clearTimeout(this.onAfterRenderingTimer);
        }

        this.onAfterRenderingTimer = setTimeout(function () {
            that.onAfterRenderingTimer = undefined;
            utils.setPerformanceMark("FLP-TimeToInteractive_tilesLoaded", oConfigMarks);
            that.fireAfterRendering();
        }, 0);

        Device.media.attachHandler(this._handleMediaChange, this, DEVICE_SET);
    };

    DashboardGroupsContainer.prototype.onBeforeRendering = function () {
        Device.media.detachHandler(this._handleMediaChange, this, DEVICE_SET);
    };

    DashboardGroupsContainer.prototype._handleMediaChange = function (event) {
        this._bRangeSetSmall = event.name === "Small";
        this._updateTileContainer(true);
    };

    DashboardGroupsContainer.prototype.getGroupControlByGroupId = function (groupId) {
        try {
            var groups = this.getGroups();
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].getGroupId() == groupId) {
                    return groups[i];
                }
            }
        } catch (e) {
            // continue regardless of error
        }

        return null;
    };

    DashboardGroupsContainer.prototype.addLinksToUnselectedGroups = function () {
        var aGroups = this.getGroups();
        aGroups.forEach(function (oGroup, index) {
            if (!oGroup.getIsGroupSelected()) {
                ManagedObject.prototype.updateAggregation.call(oGroup, "links");
            }
        });
    };


    DashboardGroupsContainer.prototype.removeLinksFromAllGroups = function () {
        var aGroups = this.getGroups();
        aGroups.forEach(function (oGroup, index) {
            var aLinks = oGroup.getLinks();
            if (aLinks.length) {
                if (aLinks[0].getMetadata().getName() === "sap.m.GenericTile") {
                    oGroup.removeAllLinks();
                } else {
                    for (var i = 0; i < aLinks.length; i++) {
                        aLinks[i].destroy();
                    }
                }
            }
        });
    };


    DashboardGroupsContainer.prototype.removeLinksFromUnselectedGroups = function () {
        var aGroups = this.getGroups();
        aGroups.forEach(function (oGroup, index) {
            var aLinks = oGroup.getLinks();
            if (aLinks.length && !oGroup.getIsGroupSelected()) {
                if (aLinks[0].getMetadata().getName() === "sap.m.GenericTile") {
                    oGroup.removeAllLinks();
                } else {
                    for (var i = 0; i < aLinks.length; i++) {
                        aLinks[i].destroy();
                    }
                }
            }
        });
    };

    DashboardGroupsContainer.prototype.addInvisibleAccessabilityTexts = function () {
        this.oTileText = new InvisibleText("sapUshellDashboardAccessibilityTileText", {
            text: resources.i18n.getText("tile")
        }).toStatic();

        var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
        if (oBundle) {
            this.oTileEditModeText = new InvisibleText("sapUshellDashboardAccessibilityTileEditModeText", {
                text: oBundle.getText("LIST_ITEM_NAVIGATION")
            }).toStatic();
        }
    };

    return DashboardGroupsContainer;

});
