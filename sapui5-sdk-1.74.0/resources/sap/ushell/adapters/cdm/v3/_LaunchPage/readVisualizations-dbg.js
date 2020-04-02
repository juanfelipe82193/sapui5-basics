// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Helper of accessing visualization data for the 'CDM' platform.
 *
 * TODO: Simplify function names
 *
 * @version 1.74.0
 * @private
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome"
], function (utils, readHome) {
    "use strict";

    var readVisualizations = {};

    /* ***** Access to visualizations ***** */

    /**
     * Returns the map of visualizations.
     *
     *  @param {object} oSite
     *      Common Data Model site
     *  @returns {object}
     *      an object containing all visualizations as properties (property name
     *      is the vizId, property value is the visualizations data)
     */
    readVisualizations.getMap = function (oSite) {
        return oSite.visualizations;
    };

    /**
     * Returns the visualization with the given ID.
     *
     *  @param {object} oSite
     *      Common Data Model site
     *  @param {string} sId
     *      ID of the visualization to be returned
     *  @returns {object}
     *      the visualization with the specified ID or undefined if not present
     */
    readVisualizations.get = function (oSite, sId) {
        return oSite.visualizations[sId];
    };

    /* ***** Access to visualization types ***** */

    /**
     * Returns the map of visualization types.
     *
     *  @param {object} oSite
     *      Common Data Model site
     *  @returns {object}
     *      an object containing all visualization types as properties (property name
     *      is the vizTypeId, property value is the visualization type data)
     */
    readVisualizations.getTypeMap = function (oSite) {
        return oSite.vizTypes;
    };

    /**
     * Returns the visualization type with the given ID.
     *
     *  @param {object} oSite
     *      Common Data Model site
     *  @param {string} sId
     *      ID of the visualization type to be returned
     *  @returns {object}
     *      the visualization type with the specified ID or undefined if not present
     */
    readVisualizations.getType = function (oSite, sId) {
        return oSite.vizTypes[sId];
    };

    /**
     * Returns the visualization type ID.
     *
     *  @param {object} oVisualization
     *      Visualization
     *  @returns {string}
     *      the visualization type ID or undefined if not present
     */
    readVisualizations.getTypeId = function (oVisualization) {
        return oVisualization.vizType;
    };

    /* ***** Access to visualization config and its attributes ***** */

    /**
     * Returns the configuration of the visualization
     *
     * @param {object} oVisualization
     *      Visualization
     * @returns {object}
     *      the visualization config or undefined if not present
     */
    readVisualizations.getConfig = function (oVisualization) {
        return oVisualization.vizConfig;
    };

    /**
     * Returns the visualization's target
     * which is located inside its configuration
     *
     *  @param {object} oVisualization
     *      Visualization
     *  @returns {string}
     *      the visualization's app ID or undefined if not present
     */
    readVisualizations.getTarget = function (oVisualization) {
        var oVizConfig = this.getConfig(oVisualization);
        return oVizConfig && oVizConfig["sap.flp"] && oVizConfig["sap.flp"].target;
    };

    /**
     * Returns the visualization's target app ID
     * which is located inside its configuration
     *
     *  @param {object} oVisualization
     *      Visualization
     *  @returns {string}
     *      the visualization's app ID or undefined if not present
     */
    readVisualizations.getAppId = function (oVisualization) {
        var oTarget = this.getTarget(oVisualization);
        return oTarget && oTarget.appId;
    };

    /**
     * Returns the visualization's target inbound ID
     * which is located inside its configuration
     *
     * @param {object} oVisualization
     *      Visualization
     *  @returns {string}
     *      the visualization's inbound ID or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getInboundId = function (oVisualization) {
        var oTarget = this.getTarget(oVisualization);
        return oTarget && oTarget.inboundId;
    };

    /**
     * Returns the outbound for a visualization. Appends the parameter sap-ui-app-id-hint
     * to the parameter list.
     *
     *  @param {object} oVisualization
     *      Visualization
     *  @param {object} oInbound
     *      Inbound
     *  @returns {object}
     *      The outbound based on the visualization and the inbound
     */
    readVisualizations.getOutbound = function (oVisualization, oInbound) {

        var oOutbound;

        oOutbound = {
            semanticObject: oInbound.semanticObject,
            action: oInbound.action,
            parameters: this.getTarget(oVisualization).parameters || {}
        };

        oOutbound.parameters["sap-ui-app-id-hint"] = {
            value: {
                format: "plain",
                value: this.getAppId(oVisualization)
            }
        };
        return oOutbound;
    };


    /**
     * Checks whether a visualization starts an external URL.
     *
     *  @param {object} oVisualization
     *      Visualization
     *  @returns {boolean}
     *      Returns whether the visualization starts an external URL
     */
    readVisualizations.startsExternalUrl = function (oVisualization) {
        var oTarget = this.getTarget(oVisualization);
        return oTarget && oTarget.type === "URL";
    };

    /* ***** Access to site application descriptor ***** */

    /**
     * Returns the app descriptor with the given app ID.
     *
     *  @param {object} oSite
     *      Common Data Model site
     *  @param {string} sId
     *      ID of the app descriptor to be returned
     *  @returns {object}
     *      the app descriptor with the specified ID or undefined if not present
     */
    readVisualizations.getAppDescriptor = function (oSite, sId) {
        return oSite.applications && oSite.applications[sId];
    };

    /* ***** Access to CDM-evaluated properties ***** */

    /**
     * Returns the keyword array
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string[]}
     *      the evaluated keyword array or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getKeywords = function (aCdmParts) {
        var aClonedCdmParts = utils.clone(aCdmParts); // do not modify input parameter
        aClonedCdmParts.splice(2, 1); // Inbound
        aClonedCdmParts.splice(0, 1); // Tile
        return utils.getNestedObjectProperty(
            aClonedCdmParts,
            ["sap|app.tags.keywords", "sap|app.tags.keywords"]);
    };

    /**
     * Returns the title
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string}
     *      the evaluated title or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getTitle = function (aCdmParts) {
        return utils.getNestedObjectProperty(
            aCdmParts,
            ["title", "sap|app.title", "title", "sap|app.title"]);
    };

    /**
     * Returns the subtitle
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string}
     *      the evaluated subtitle or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getSubTitle = function (aCdmParts) {
        return utils.getNestedObjectProperty(
            aCdmParts,
            ["subTitle", "sap|app.subTitle", "subTitle", "sap|app.subTitle"]);
    };

    /**
     * Returns the icon
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string}
     *      the evaluated icon or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getIcon = function (aCdmParts) {
        return utils.getNestedObjectProperty(
            aCdmParts,
            ["icon", "sap|ui.icons.icon", "icon", "sap|ui.icons.icon"]);
    };

    /**
     * Returns the info
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string}
     *      the evaluated info or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getInfo = function (aCdmParts) {
        return utils.getNestedObjectProperty(
            aCdmParts,
            ["info", "sap|app.info", "info", "sap|app.info"]);
    };

    /**
     * Returns the shorttitle
     * which is evaluated on the basis of the CDM parts
     *
     * @param {object[]} aCdmParts
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     * @returns {string}
     *      the evaluated shorttitle or undefined if not present
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getShortTitle = function (aCdmParts) {
        var aClonedCdmParts = utils.clone(aCdmParts); // do not modify input parameter
        aClonedCdmParts.splice(0, 1); // Tile
        return utils.getNestedObjectProperty(
            aClonedCdmParts,
            ["sap|app.shortTitle", "shortTitle", "sap|app.shortTitle"]);
    };

    /* ***** Helper ***** */

    /**
     * Returns an array based on a group tile
     * which contains the cdm parts containing the information about the tile
     *
     * @param {object} oSite
     *      a CDM Site
     * @param {object} oTile
     *      a tile
     * @returns {array}
     *      A fixed list containing the Tile, the VizConfig, the Inbound, and the App.
     *
     * @since 1.74.0
     * @private
     */
    readVisualizations.getCdmParts = function (oSite, oTile) {
        var oViz = this.get(oSite, readHome.getTileVizId(oTile)) || {};
        var oVizConfig = this.getConfig(oViz);
        var oApp = this.getAppDescriptor(oSite, this.getAppId(oViz));
        var oInbound = readHome.getInbound(oApp, this.getInboundId(oViz));
        if (oInbound) {
            oInbound = oInbound.inbound;
        }

        return [oTile, oVizConfig, oInbound, oApp];
    };

    return readVisualizations;

}, /* bExport = */ true);
