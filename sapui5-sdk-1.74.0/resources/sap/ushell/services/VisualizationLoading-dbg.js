// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview This module deals with the instantiation of visualizations in a platform independent way.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/m/library",
    "sap/ushell/services/_VisualizationLoading/VizInstanceLocal",
    "sap/ushell/services/_VisualizationLoading/VizInstanceDefault",
    "sap/ushell/services/_VisualizationLoading/VizInstanceEmpty"
], function (
    mobileLibrary,
    VizLocal,
    VizDefault,
    VizEmpty
) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    var VISUALIZATION_TYPES = {
        ABAP: "ABAP",
        local: "local",
        default: "default",
        card: "card",
        empty: "empty"
    };

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("VisualizationLoading")</code>.
     * Constructs a new instance of the visualization loading service.
     *
     * @namespace sap.ushell.services.VisualizationLoading
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.72.0
     *
     * @private
     */
    function VisualizationLoading () {
        this._init.apply(this, arguments);
    }

    /**
     * Private initializer.
     *
     * @param {object} launchPageAdapter The LaunchPageAdapter for the specific platform.
     * @since 1.72.0
     *
     * @private
     */
    VisualizationLoading.prototype._init = function () { };

    /**
     * Instantiation - WIP
     *
     * @param {object} vizData The instantiation information.
     * @param {string} vizData.vizId The visualization id.
     * @param {string} vizData.properties Additional initialization data - Only "local" - experimental
     *
     * @returns {Promise<void>} the visualization instance
     * @since 1.72.0
     * @private
     */
    VisualizationLoading.prototype.loadVisualizationData = function () {
        if (this.oCatalogTileRequest) {
            return this.oCatalogTileRequest;
        }

        this.oCatalogTileRequest = sap.ushell.Container.getService("VisualizationDataProvider")._getCatalogTiles()
            .then(function (oCatalogTiles) {
                this._oCatalogTiles = oCatalogTiles;
                return Promise.resolve();
            }.bind(this)).catch(function (error) {
                return Promise.reject(error);
            });

        return this.oCatalogTileRequest;
    };

    /**
     * Instantiation - WIP
     *
     * @param {object} vizData The instantiation information.
     * @param {string} vizData.vizId The visualization id.
     * @param {boolean} [vizData.localLoad] Whether to load the tile locally using a "VizInstanceLocal".
     *   If set to "true", then "tileType" and "properties" data will be used to instantiate the tile. Default is "false".
     * @param {string} [vizData.tileType] Only used when "localLoad" is set to "true", contains the tile type.
     * @param {object} [vizData.properties] Only used when "localLoad" is set to "true", contains the tile properties data.
     * @returns {sap.ui.core.Control} the visualization instance
     * @since 1.72.0
     * @private
     */
    VisualizationLoading.prototype.instantiateVisualization = function (vizData) {
        var oVizInstance, oVizConfig, oCatalogTile;
        if (!vizData.localLoad) {
            if (!vizData.vizId) {
                return {};
            }

            if (!this._oCatalogTiles) {
                // start the loading if not yet the case
                this.loadVisualizationData();
                // assume the request is still ongoing and return a loading vizInstance
                oVizInstance = new VizEmpty({
                    visualizationId: vizData.vizId,
                    vizType: VISUALIZATION_TYPES.empty,
                    state: LoadState.Loaded
                });
                oVizInstance.load();
                return oVizInstance;
            }
            oCatalogTile = this._oCatalogTiles[vizData.vizId];
            if (!oCatalogTile) {
                oVizInstance = new VizEmpty({
                    visualizationId: vizData.vizId,
                    vizType: VISUALIZATION_TYPES.empty,
                    state: LoadState.Error
                });
                oVizInstance.load();
                return oVizInstance;
            }
        }

        var sType = this._getPlatform(oCatalogTile, vizData);
        switch (sType) {
            case VISUALIZATION_TYPES.local:
                oVizConfig = this._prepareLocalConfig(vizData, oCatalogTile);
                oVizInstance = new VizLocal(oVizConfig.oInitData);
                break;
            default:
                oVizConfig = this._prepareDefaultConfig(vizData, oCatalogTile);
                oVizInstance = new VizDefault(oVizConfig.oInitData);
                break;
        }

        if (!vizData.deferLoading) {
            oVizInstance.load(oVizConfig.oAdditionalData);
        }

        return oVizInstance;
    };

    VisualizationLoading.prototype._getPlatform = function (oCatalogTile, oVizData) {
        var sType = VISUALIZATION_TYPES.default;

        if (oCatalogTile) {
            if (oCatalogTile.getChip !== undefined) {
                sType = VISUALIZATION_TYPES.ABAP;
            } else if (oCatalogTile.namespace || oCatalogTile.tileType || oCatalogTile.properties || oVizData.properties) {
                sType = VISUALIZATION_TYPES.local;
            }
        } else if (oVizData.localLoad && oVizData.properties) {
            sType = VISUALIZATION_TYPES.local;
        }

        return sType;
    };

    VisualizationLoading.prototype._prepareDefaultConfig = function (vizData, catalogTile) {
        var oVizConfig = {
            oInitData: {
                catalogTile: catalogTile,
                visualizationId: vizData.vizId,
                vizType: VISUALIZATION_TYPES.default
            }
        };

        return oVizConfig;
    };

    VisualizationLoading.prototype._prepareLocalConfig = function (vizData, catalogTile) {
        var oVizConfig = {
            oInitData: {
                catalogTile: catalogTile,
                visualizationId: vizData.vizId,
                vizType: VISUALIZATION_TYPES.local
            }
        };
        if (vizData.properties) {
            oVizConfig.oAdditionalData = {};
            oVizConfig.oAdditionalData.properties = vizData.properties;
            oVizConfig.oAdditionalData.mode = vizData.mode;
            oVizConfig.oAdditionalData.namespace = vizData.namespace;
            oVizConfig.oAdditionalData.path = vizData.path;
            oVizConfig.oAdditionalData.moduleType = vizData.moduleType;
            oVizConfig.oAdditionalData.moduleName = vizData.moduleName;
            oVizConfig.oAdditionalData.tileType = vizData.tileType || "sap.ushell.ui.tile.StaticTile";
            oVizConfig.oAdditionalData.keywords = vizData.keywords || [];
        }
        return oVizConfig;
    };

    VisualizationLoading.hasNoAdapter = true;

    return VisualizationLoading;
});
