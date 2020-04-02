// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module deals with the retrieval of visualization data in a platform independent way.</p>
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/ushell/resources"
], function (resources) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("VisualizationDataProvider")</code>.
     * Constructs a new instance of the visualization data provider service.
     *
     * @namespace sap.ushell.services.VisualizationDataProvider
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @experimental Since 1.68.0
     *
     * @private
     */
    function VisualizationDataProvider () {
        this.S_COMPONENT_NAME = "sap.ushell.services.VisualizationDataProvider";
        this._init.apply(this, arguments);
    }

    /**
     * Private initializer.
     *
     * @param {object} launchPageAdapter The LaunchPageAdapter for the specific platform.
     * @experimental Since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._init = function (launchPageAdapter) {
        this.oLaunchPageAdapter = launchPageAdapter;
        this.oCatalogTilePromise = null;
    };

    /**
     * Retrieves and returns a map of all catalog tiles.
     *
     * @returns {Promise<Object>} The map of catalog tiles
     * @experimental Since 1.70.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._getCatalogTiles = function () {
        if (this.oCatalogTilePromise) {
            return this.oCatalogTilePromise;
        }

        var oLaunchPageAdapter = this.oLaunchPageAdapter;
        this.oCatalogTilePromise = new Promise(function (resolve, reject) {
            oLaunchPageAdapter.getCatalogs().then(function (catalogs) {
                var aDeferreds = [];
                var aCatalogTiles = [];
                var aFlattenedCatalogTiles = [];
                var oCatalogTiles = {};

                for (var i = 0; i < catalogs.length; i++) {
                    aDeferreds.push(oLaunchPageAdapter.getCatalogTiles(catalogs[i]).then(function (catalogTile) {
                        aCatalogTiles.push(catalogTile);
                    }));
                }

                jQuery.when.apply(null, aDeferreds).done(function () {
                    // Convert a two-dimensional array into a flat array
                    aFlattenedCatalogTiles = [].concat.apply([], aCatalogTiles);

                    for (var y = 0; y < aFlattenedCatalogTiles.length; y++) {
                        oCatalogTiles[oLaunchPageAdapter.getCatalogTileId(aFlattenedCatalogTiles[y])] = aFlattenedCatalogTiles[y];
                    }

                    resolve(oCatalogTiles);
                }).fail(reject);
            }).fail(reject);
        });

        return this.oCatalogTilePromise;
    };

    /**
     * @typedef {object} VisualizationData
     * An object representing a visualization in a format which is independent of the adapter.
     * @property {string} object.title The title.
     * @property {string} object.subTitle The subtitle.
     * @property {string} object.icon The icon.
     * @property {string} object.info The info.
     * @property {string} object.size The size.
     * @property {boolean} object.isCustomTile Is it a custom tile?
     */

    /**
     * Returns all visualization data.
     *
     * @returns {Promise<Object<string,VisualizationData>>} The visualization data.
     * @experimental Since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype.getVisualizationData = function () {
        var oLaunchPageAdapter = this.oLaunchPageAdapter,
            oCatalogTile;

        return this._getCatalogTiles().then(function (oCatalogTiles) {
            return Object.keys(oCatalogTiles).reduce(function (oVisualizationData, sId) {
                oCatalogTile = oCatalogTiles[sId];

                oVisualizationData[sId] = {
                    title: oLaunchPageAdapter.getCatalogTilePreviewTitle(oCatalogTile),
                    subTitle: oLaunchPageAdapter.getCatalogTilePreviewSubtitle(oCatalogTile),
                    icon: oLaunchPageAdapter.getCatalogTilePreviewIcon(oCatalogTile),
                    info: oLaunchPageAdapter.getCatalogTilePreviewInfo(oCatalogTile),
                    size: oLaunchPageAdapter.getCatalogTileSize(oCatalogTile),
                    indicatorDataSource: oLaunchPageAdapter.getCatalogTilePreviewIndicatorDataSource(oCatalogTile),
                    url: oLaunchPageAdapter.getCatalogTileTargetURL(oCatalogTile),
                    // The special custom tile logic is not needed on all the platforms so it doesn't have to be implemented
                    isCustomTile: oLaunchPageAdapter.isCustomTile && oLaunchPageAdapter.isCustomTile(oCatalogTile)
                };

                return oVisualizationData;
            }, {});
        })
        .catch(function (error) {
            var oError = {
                component: this.S_COMPONENT_NAME,
                description: resources.i18n.getText("VisualizationDataProvider.CannotLoadData"),
                detail: error
            };
            return Promise.reject(oError);
        }.bind(this));
    };

    /**
     * Instantiates the view of a given visualization.
     *
     * @param {string} vizId The id of the visualization to instantiate
     * @param {boolean} previewMode Determines if the visualization view should be a preview
     * @returns {Promise<sap.ui.core.Control>} The visualization view
     * @experimental Since 1.70.0
     *
     * @private
     */
    VisualizationDataProvider.prototype.getVisualizationView = function (vizId, previewMode) {
        var oLaunchPageAdapter = this.oLaunchPageAdapter;

        // Default case is false
        previewMode = previewMode || false;

        return this._getCatalogTileById(vizId).then(function (oCatalogTile) {
            return oLaunchPageAdapter.getCatalogTileView(oCatalogTile, previewMode);
        });
    };

    /**
     * Returns the catalog tile of the given visualization id
     *
     * @param {string} vizId The id of the visualization
     * @returns {Promise} The catalog tile
     * @experimental Since 1.72.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._getCatalogTileById = function (vizId) {
        return this._getCatalogTiles().then(function (oCatalogTiles) {
            var oCatalogTile = oCatalogTiles[vizId];

            if (!oCatalogTile) {
                return Promise.reject("Visualization " + vizId + " not found");
            }
            return oCatalogTile;
        });
    };

    /**
     * Returns the adapter used by this service
     *
     * @returns {object} The launch page adapter
     * @experimental Since 1.72.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._getAdapter = function () {
        return this.oLaunchPageAdapter;
    };

    VisualizationDataProvider.hasNoAdapter = false;
    return VisualizationDataProvider;
});