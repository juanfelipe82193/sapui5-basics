// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The CDM page dereferencer uses visualization- and navigation data to resolve
 * a reference page into a complete CDM site (without references).
 *
 * @version 1.74.0
 * @private
 */
sap.ui.define([
    "sap/ushell/utils/clone",
    "sap/base/util/ObjectPath",
    "sap/ushell/services/_PageReferencing/AppForInbound",
    "sap/base/Log"
], function (clone, ObjectPath, AppForInbound, Log) {
    "use strict";

    var PageDereferencer = {};

    PageDereferencer._VISUALIZATION_TYPES = {
        STATIC_TILE: "sap.ushell.StaticAppLauncher",
        DYNAMIC_TILE: "sap.ushell.DynamicAppLauncher",
        PLATFORM_VISUALIZATION: "sap.ushell.PlatformVisualization"
    };

    /**
     * Uses visualization- and navigation data to resolve a reference page
     * into a complete CDM site (without references).
     *
     * @param {object} page Reference page to dereference.
     * @param {object} visualizationData Hash map with visualization objects.
     * @param {object} navigationData Navigation data object containing an array of inbounds and a map of system aliases.
     * @returns {object} CDM site.
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer.dereference = function (page, visualizationData, navigationData) {
        var oSite = {};

        var oNavigationDataHashMap = {};
        var aInbounds = navigationData.inbounds;
        for (var i = 0; i < aInbounds.length; i++) {
            var sInboundPermanentKey = aInbounds[i].permanentKey || aInbounds[i].id;
            oNavigationDataHashMap[sInboundPermanentKey] = aInbounds[i];
        }

        oSite._version = "3.0.0";
        oSite.site = this._getSiteInfo(page);
        oSite.catalogs = {};
        oSite.groups = this._getGroups(page);
        oSite.visualizations = this._getVisualizations(page, visualizationData, oNavigationDataHashMap);
        oSite.applications = this._getApplications(oNavigationDataHashMap);
        oSite.vizTypes = this._getVizTypes();
        oSite.systemAliases = clone(navigationData.systemAliases);

        return oSite;
    };

    /**
     * Returns the site info of a CDM site for a reference page.
     *
     * @param  {object} page Reference page to dereference.
     * @returns {object} Site info property of the dereferenced CDM site.
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer._getSiteInfo = function (page) {
        var aGroupsOrder = [];
        var aPageSections = page.sections;
        if (aPageSections) {
            aGroupsOrder = aPageSections.map(function (section) {
                return section.id;
            });
        }

        var oSite = {
            identification: {
                id: page.id,
                title: page.title,
                description: page.description
            },
            payload: {
                groupsOrder: aGroupsOrder
            }
        };

        return oSite;
    };

    /**
     * Returns groups of a CDM site from a reference page.
     *
     * @param  {object} page Reference page to dereference.
     * @returns {object} Groups object
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer._getGroups = function (page) {
        var oGroups = {};
        var aPageSections = page.sections || [];
        for (var i = 0; i < aPageSections.length; i++) {
            oGroups[aPageSections[i].id] = {
                identification: {
                    id: aPageSections[i].id,
                    title: aPageSections[i].title,
                    locked: true,
                    isPreset: true
                },
                payload: {
                    tiles: [],
                    links: []
                }
            };

            for (var y = 0; y < aPageSections[i].visualizations.length; y++) {
                oGroups[aPageSections[i].id].payload.tiles.push({
                    id: aPageSections[i].visualizations[y].id,
                    vizId: aPageSections[i].visualizations[y].vizId
                });
            }
        }
        return oGroups;
    };

    /**
     * Returns visualizations of a CDM site from the reference page,
     * visualization and the navigation data.
     *
     * @param  {object} page Reference page to dereference.
     * @param  {object} visualizationData Visualization objects (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     * @param  {object} navigationData Navigation data as hash map.
     * @returns {object} Dereferenced visualizations object.
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer._getVisualizations = function (page, visualizationData, navigationData) {
        var oVisualizations = {};

        var aVisualizations = page.sections.map(function (section) {
            return section.visualizations;
        });

        var aFlattendVisualizations = Array.prototype.concat.apply([], aVisualizations);

        for (var i = 0; i < aFlattendVisualizations.length; i++) {
            oVisualizations[aFlattendVisualizations[i].vizId] = this._getVisualization(
                aFlattendVisualizations[i],
                visualizationData,
                navigationData
            );
        }

        return oVisualizations;
    };

    /**
     * Returns visualization of a CDM site using the navigation, visualization
     * and page visualization data.
     *
     * @param  {object} pageVisualization Visualization object which is provided by the page.
     * @param  {object} visualizationData Visualization data as a hash map (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     * @param  {object} navigationData Navigation data.
     * @returns {object} Dereferenced visualization object.
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer._getVisualization = function (pageVisualization, visualizationData, navigationData) {
        var oVisualizationData = visualizationData[pageVisualization.vizId],
            sVizType;

        if (!oVisualizationData) {
            return;
        }

        if (oVisualizationData.isCustomTile) {
            sVizType = this._VISUALIZATION_TYPES.PLATFORM_VISUALIZATION;
        } else if (oVisualizationData.indicatorDataSource) {
            sVizType = this._VISUALIZATION_TYPES.DYNAMIC_TILE;
        } else {
            sVizType = this._VISUALIZATION_TYPES.STATIC_TILE;
        }

        var oVisualization = {
            vizType: sVizType,
            vizConfig: {
                "sap.app": {
                    title: oVisualizationData.title,
                    subTitle: oVisualizationData.subTitle,
                    info: oVisualizationData.info
                },
                "sap.ui": {
                    icons: {
                        icon: oVisualizationData.icon
                    }
                },
                "sap.flp": {
                    tileSize: oVisualizationData.size,
                    indicatorDataSource: oVisualizationData.indicatorDataSource
                }
            }
        };

        if (oVisualizationData.url && !pageVisualization.inboundPermanentKey) {
            oVisualization.vizConfig["sap.flp"].target = {
                type: "URL",
                "url": oVisualizationData.url
            };
        } else {
            oVisualization.vizConfig["sap.flp"].target = {
                type: "IBN",
                appId: pageVisualization.inboundPermanentKey,
                inboundId: navigationData[pageVisualization.inboundPermanentKey] && navigationData[pageVisualization.inboundPermanentKey].id
            };
        }

        return oVisualization;
    };

    /**
     * Returns applications of dereferenced CDM site.
     *
     * An empty object is returned for an app which cannot be created.
     *
     * @param  {object} navigationData Navigation data as hash map.
     * @returns {objects} Dereferenced applications object.
     *
     * @experimental Since 1.68.0
     * @private
     */
    PageDereferencer._getApplications = function (navigationData) {

        return Object.keys(navigationData).reduce(function (oApplications, navigationDataId) {
            var oInbound = navigationData[navigationDataId],
                sInboundPermanentKey = oInbound.permanentKey || oInbound.id;

            // the navigation data ID becomes the application ID
            try {
                oApplications[sInboundPermanentKey] = AppForInbound.get(navigationDataId, oInbound);
            } catch (error) {
                Log.error("Unable to dereference app '" + navigationDataId + "' of CDM page.");
                oApplications[navigationDataId] = {};
            }

            return oApplications;
        }, {});
    };


    /**
     * Returns built in visualization types.
     *
     * Currently there is only the generic platform visualization type that indicates
     * that the visualization has to be created in a platform dependent way.
     *
     * @returns {object} Visualization types
     *
     * @experimental Since 1.70.0
     * @private
     */
    PageDereferencer._getVizTypes = function () {
        var oVizTypes = {};

        oVizTypes[this._VISUALIZATION_TYPES.PLATFORM_VISUALIZATION] = {
            "sap.app": {
                "id": this._VISUALIZATION_TYPES.PLATFORM_VISUALIZATION,
                "type": "platformVisualization"
            }
        };

        return oVizTypes;
    };

    return PageDereferencer;

});
