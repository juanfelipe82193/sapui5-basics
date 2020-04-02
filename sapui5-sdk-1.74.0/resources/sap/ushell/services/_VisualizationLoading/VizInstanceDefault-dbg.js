// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control
sap.ui.define([
    "sap/ushell/services/_VisualizationLoading/VizInstance"
], function (
    VizInstance
) {
    "use strict";

    /**
     * Constructor for a new Visualization Instance of the "default" type.
     *
     * A Visualization Instance is a control wrapper that unifies the API of Tiles,
     * Cards, etc. in the Launchpad. Its API is platform independent, its inner
     * workings platform dependent, thus being both a small service and an adapter.
     *
     * The default VizInstance should be used if no specific instance for a platform
     * exists. Its main role is to delegate any function call to the correct adapter.
     * The Visualization Loading Service is responsible for choosing the correct
     * VizInstance.
     *
     * Once a VizInstance is created, its #load method needs to be called for it to load
     * its inner control (although this can be delegated to the service, see its documentation).
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that wraps one FLP UI control.
     * @extends sap.ushell.ui.launchpad.VizInstance
     * @constructor
     * @name sap.ushell.ui.launchpad.VizInstanceDefault
     */
    var oVisualization = VizInstance.extend("sap.ushell.ui.launchpad.VizInstanceDefault", /** @lends  sap.ushell.ui.launchpad.VizInstanceDefault.prototype*/ {
        renderer: VizInstance.getMetadata().getRenderer()
    });

    /**
     * Returns the visualization's title.
     *
     * @returns {string} Visualization title
     * @since 1.72.0
     */
    oVisualization.prototype.getTitle = function () {
        return this.getAdapter().getCatalogTilePreviewTitle(this.getCatalogTile());
    };

    /**
     * Returns the subtitle for a visualization.
     *
     * @returns {string} the subtitle for the visualization's underlying application
     * @since 1.72.0
     */
    oVisualization.prototype.getSubtitle = function () {
        return this.getAdapter().getCatalogTilePreviewSubtitle(this.getCatalogTile());
    };

    /**
     * Returns the preview icon for a visualization.
     *
     * @returns {string} the preview icon as URL/URI for the visualization's underlying application
     * @since 1.72.0
     */
    oVisualization.prototype.getIcon = function () {
        return this.getAdapter().getCatalogTilePreviewIcon(this.getCatalogTile());
    };

    /**
     * Returns the keywords associated with a visualization which can be used to find the visualization in a search.
     * Note: loadView/loadPreview <b>must</b> be called <b>before</b> this method. Otherwise the keywords may be incomplete.
     *
     * @returns {string[]} The keywords associated with this catalog tile
     * @since 1.72.0
     */
    oVisualization.prototype.getKeywords = function () {
        return this.getAdapter().getCatalogTileKeywords(this.getCatalogTile());
    };

    /**
     * Returns the visualization footer
     *
     * @returns {string} The visualization tile footer
     * @since 1.72.0
     */
    oVisualization.prototype.getFooter = function () {
        return this.getAdapter().getCatalogTilePreviewInfo(this.getCatalogTile());
    };

    oVisualization.prototype.getTarget = function () {
        return this.getAdapter().getCatalogTileTargetURL(this.getCatalogTile());
    };

    /**
     * Returns the visualization's type.
     *
     * @returns {string} The type
     * @since 1.72.0
     */
    oVisualization.prototype.getType = function () {
        var oAdapter = this.getAdapter();
        if (oAdapter.getTileType) {
            return oAdapter.getTileType(this.getCatalogTile());
        }
        return this.getVizType();
    };

    /**
     * Updates the tile active state. Inactive dynamic tiles do not send requests
     *
     * @param {boolean} active The visualization's updated active state
     * @param {boolean} refresh Determines if the tile should be immediately updated
     * @since 1.72.0
     */
    oVisualization.prototype.setActive = function (active, refresh) {
        var oInnerControl = this.getInnerControl(),
            oController = oInnerControl && oInnerControl.getController && oInnerControl.getController(),
            oCatalogTile = this.getCatalogTile(),
            oVisibleContract = oCatalogTile && oCatalogTile.getContract && oCatalogTile.getContract("visible");

        if (oController && oController.visibleHandler && oVisibleContract && oVisibleContract.setVisible) {
            oController.visibleHandler(active);
            oVisibleContract.setVisible(active);
            if (refresh && oController.refreshHandler) {
                oController.refreshHandler();
            }
        }
    };

    /**
     * Triggers a refresh action of a visualization.
     * Typically this action is related to the value presented in dynamic visualizations
     *
     * @since 1.72.0
     */
    oVisualization.prototype.refresh = function () {
        this.getAdapter().refresh(this.getCatalogTile());
    };

    /**
     * Returns the height of the visualization as an integer
     *
     * @returns {integer} Tile visualization height in number of rows
     * @since 1.72.0
     */
    oVisualization.prototype.getHeight = function () {
        var sSize = this.getAdapter().getTileSize(this.getCatalogTile());
        var iRows = +sSize.split("x")[0];

        return iRows;
    };

    /**
     * Returns the width of the visualization as an integer
     *
     * @returns {integer} Tile visualization width in number of columns
     * @since 1.72.0
     */
    oVisualization.prototype.getWidth = function () {
        var sSize = this.getAdapter().getTileSize(this.getCatalogTile());
        var iColumns = +sSize.split("x")[1];

        return iColumns;
    };

    /**
     * Returns the size of the visualization. E.g.: "2x2"
     *
     * @returns {String} Tile visualization size in columns x rows
     * @since 1.72.0
     */
    oVisualization.prototype.getSize = function () {
        return this.getAdapter().getTileSize(this.getCatalogTile());
    };

    /**
     * Returns whether a tile is a custom tile
     *
     * @returns {boolean} True if it is a custom tile, false if it is a static or dynamic tile
     * @since 1.72.0
     */
    oVisualization.prototype.isCustomTile = function () {
        return this.getAdapter().isCustomTile(this.getCatalogTile());
    };

    /**
     * Stores the inner control's loading promise
     * This is needed to allow the superclass to take care of most of the loading process.
     * @since 1.72.0
     */
    oVisualization.prototype._setVizViewControlPromise = function () {
        // Default case is false
        var bPreviewMode = this.getPreviewMode();
        this.oControlPromise = sap.ushell.Container.getService("VisualizationDataProvider").getVisualizationView(this.getVisualizationId(), bPreviewMode);
    };

    /**
     * Instantiates the inner control.
     * This method first loads the suitable adapter (through VisualizationDataProvider)
     * and then delegates to its superclass (VizInstance) to load the inner control.
     *
     * @returns {Promise} A promise that will resolve once the instantiation is done.
     * @since 1.72.0
     */
    oVisualization.prototype.load = function () {
        this.setAdapter(sap.ushell.Container.getService("VisualizationDataProvider")._getAdapter());
        return VizInstance.prototype.load.apply(this, arguments);
    };

    return oVisualization;
});
