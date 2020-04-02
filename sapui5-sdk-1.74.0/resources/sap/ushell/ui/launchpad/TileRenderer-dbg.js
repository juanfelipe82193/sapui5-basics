// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Config",
    "sap/base/Log",
    "sap/m/Text"
], function (Config, Log, Text) {
    "use strict";

    /**
     * @name Tile renderer.
     * @static
     * @private
     */
    var TileRenderer = {
        apiVersion: 2
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} tile Tile to be rendered
     */
    TileRenderer.render = function (rm, tile) {
        var oTileView = null,
            aContent;

        try {
            oTileView = tile.getTileViews()[0];
        } catch (oException) {
            Log.warning("Failed to load tile view: ", oException.message);
            oTileView = tile.getFailedtoLoadViewText();
        }
        var oTileContainer = Config.last("/core/home/gridContainer") && tile.getParent().getParent() || tile.getParent(),
            oTiles = oTileContainer && oTileContainer.getTiles ? oTileContainer.getTiles() : [],
            oVisibleTiles = oTiles.filter(function (oTile) {
                return oTile.getVisible();
            }),
            iCurrentItemIndex = oVisibleTiles.indexOf(tile) > -1 ? oVisibleTiles.indexOf(tile) + 1 : "";

        if (!oTileContainer) {
            return;
        }

        rm.openStart("li", tile);

        // If xRay is enabled
        if (Config.last("/core/shell/model/enableHelp")) {
            // Currently only the Tile (and the Tile's footer) has a data attribute in the xRay integration
            // (as using this value as a class value instead as done in all of the static elements causes
            // parsing errors in the xRay hotspot definition flow)
            rm.attr("data-help-id", tile.getTileCatalogId()); // xRay support
        }
        rm.class("sapUshellTile");

        // In case of ActionMode we need actual height on tile
        // By this if we check if we are in the edit mode or not
        if (tile.getTileActionModeActive()) {
            rm.class("sapUshellTileWrapper");
        }

        // FeedTile BG should be transparent, since sapUshellTile BG style cannot be changed,
        // We add a special styleClass to FeedTile in order to set its BG to transparent
        if (oTileView && oTileView.getContent) {
            aContent = oTileView.getContent();
            aContent.forEach(function (oItem) {
                if (oItem.isA("sap.suite.ui.commons.FeedTile")) {
                    rm.class("sapUshellFeedTileBG");
                }
            });
        }

        if (tile.getLong()) {
            rm.class("sapUshellLong");
        }
        if (!tile.getVisible()) {
            rm.class("sapUshellHidden");
        }
        if (tile.getIsLocked()) {
            rm.class("sapUshellLockedTile");
        }

        if (Config.last("/core/home/sizeBehavior") === "Small") {
            rm.class("sapUshellSmall");
        }

        rm.attr("role", "option");
        rm.attr("aria-posinset", iCurrentItemIndex);
        rm.attr("aria-setsize", oVisibleTiles.length);

        var ariaDescribedBy = oTileContainer.getId() + "-titleText";
        rm.attr("aria-describedby", ariaDescribedBy);

        if (tile.getIeHtml5DnD()) {
            rm.attr("draggable", "true");
        }

        rm.attr("tabindex", "-1");

        var layoutPosition = tile.data("layoutPosition");
        if (layoutPosition) {
            var stylePosition = "-webkit-transfrm:" + layoutPosition.translate3D + ";-ms-transfrm:" + layoutPosition.translate2D + ";transfrm:" + layoutPosition.translate3D;
            rm.attr("style", stylePosition);
        }

        rm.openEnd(); // li - tag

        if (tile.getTileActionModeActive()) {
            this.renderTileActionMode(rm, tile);

            this.renderTileView(rm, tile, oTileView);
        } else {
            rm.openStart("div");
            rm.class("sapUshellTileWrapper");
            rm.openEnd(); // div - tag

            this.renderTileView(rm, tile, oTileView);

            // if Tile has the ActionsIcon (overflow icon at its top right corner) - display it
            if (tile.getShowActionsIcon()) {
                rm.renderControl(tile.actionIcon);
            }

            rm.close("div");
            this.renderTileActionsContainer(rm, oTileView, tile.getPinButton());
        }

        rm.close("li");
    };

    TileRenderer.renderTileActionsContainer = function (rm, oTileView, oPinButton) {
        oPinButton = oPinButton.length ? oPinButton[0] : undefined;
        // add overlay and pinButton
        if (oPinButton) {
            oPinButton.addStyleClass("sapUshellActionButton");

            rm.openStart("div");
            rm.class("sapUshellTilePinButtonOverlay");

            // For accessability needs: the overlay div will be read as readonly field
            if (oTileView.getHeader) {
                rm.writeAccessibilityState(oTileView, { role: "toolbar", label: oTileView.getHeader() });
            }
            rm.openEnd(); // div - tag
            rm.renderControl(oPinButton);
            rm.close("div");
        }
    };

    TileRenderer.renderTileView = function (rm, tile, oTileView) {
        var sUrlForLeanModeRightClick = "";
        // If the tileView contains a custom tile - we place the view into a div,
        // as it does not support to open a new tab via right click
        if (tile.getIsCustomTile()) {
            rm.openStart("div");
            rm.class("sapUshellTileInner");
            if (tile.getTileActionModeActive()) {
                rm.class("sapUshellTileActionBG");
            }
            rm.openEnd(); // div - tag
            rm.renderControl(oTileView);
            rm.close("div");
        } else {
            rm.openStart("a");
            rm.class("sapUshellTileInner");
            if (tile.getTileActionModeActive()) {
                rm.class("sapUshellTileActionBG");
            }
            var sTarget = tile.getTarget();
            if (sTarget) {
                // the new definition is that the href of a tile will open in "lean" state (in right click scenario)
                if (sTarget.charAt(0) === "#") {
                    if (window.location.search && window.location.search.length > 0) {
                        sUrlForLeanModeRightClick = window.location.origin + window.location.pathname + window.location.search + "&appState=lean" + sTarget;
                    } else {
                        sUrlForLeanModeRightClick = window.location.origin + window.location.pathname + "?appState=lean" + sTarget;
                    }
                } else {
                    sUrlForLeanModeRightClick = sTarget;
                }
                // on touch/combi devices - when pressing the href, it cause the original window also to be changed
                // we force it to be target as new window
                rm.attr("target", "_blank");
                rm.attr("href", sUrlForLeanModeRightClick);
            }
            rm.attr("tabindex", "-1");
            rm.openEnd(); // a - tag
            rm.renderControl(oTileView);
            rm.close("a");
        }
    };

    TileRenderer.renderTileActionMode = function (rm, tile) {
        // Add the ActioMode cover DIV to the tile
        rm.openStart("div");
        rm.class("sapUshellTileActionLayerDiv");
        rm.openEnd(); // div - tag

        // we display the Delete action icon - only if tile is not part of a locked group
        if (!tile.getIsLocked()) {
            // render the trash bin action
            // outer div - the click area for the delete action
            rm.openStart("div");
            rm.class("sapUshellTileDeleteClickArea");
            rm.openEnd(); // div - tag
            // 2nd div - to draw the circle around the icon
            rm.openStart("div");
            rm.class("sapUshellTileDeleteIconOuterClass");
            rm.openEnd(); // div - tag
            rm.renderControl(tile._initDeleteAction()); // initialize & render the tile's delete action icon
            rm.close("div"); // 2nd div - to draw the circle around the icon
            rm.close("div"); // outer div - the click area for the delete action
        }

        // add a div to render the tile's bottom overflow icon
        rm.openStart("div");
        rm.class("sapUshellTileActionDivCenter");
        rm.openEnd(); // div - tag
        rm.close("div");

        rm.openStart("div");
        rm.class("sapUshellTileActionIconDivBottom");
        rm.openEnd(); // div - tag
        rm.openStart("div");
        rm.class("sapUshellTileActionIconDivBottomInnerDiv");
        rm.openEnd(); // div - tag
        rm.renderControl(tile.getActionSheetIcon());
        rm.close("div");
        rm.close("div");

        rm.close("div");
    };

    return TileRenderer;
}, /* bExport= */ true);
