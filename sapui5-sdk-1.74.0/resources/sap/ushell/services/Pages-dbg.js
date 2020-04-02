// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module exposes a model containing the pages hierarchy to its clients.
 * </p>
 *
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/utils",
    "sap/ushell/utils/RestrictedJSONModel"
], function (
    Log,
    ObjectPath,
    readHome,
    readVisualizations,
    utils,
    RestrictedJSONModel
) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("PageReferencing")</code>.
     * Constructs a new instance of the page referencing service.
     *
     * @namespace sap.ushell.services.PageReferencing
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.72.0
     *
     * @private
     */
    var Pages = function () {
        this.COMPONENT_NAME = "sap/ushell/services/Pages";
        this._oCdmServicePromise = sap.ushell.Container.getServiceAsync("CommonDataModel");

        this._oPagesModel = new RestrictedJSONModel({pages: []});
    };

    /**
     * Reduces a cdm object according to the model
     *
     * @param {object} oCdmSite CDM Site to reduce
     * @returns {object} object according to the model
     * @since 1.72.0
     *
     * @private
     */
    Pages.prototype._getParsedCdmPage = function (oCdmSite) {

        var oPage = {
            id: oCdmSite.site.identification.id || "",
            title: oCdmSite.site.identification.title || "",
            description: oCdmSite.site.identification.description || ""
        };

        oPage.sections = readHome.getGroupIdsFromSite(oCdmSite).map(function (sGroupId) {
            var oCdmGroup = readHome.getGroupFromSite(oCdmSite, sGroupId);
            var oSection = {
                id: readHome.getGroupId(oCdmGroup) || "",
                title: readHome.getGroupTitle(oCdmGroup) || ""
            };

            oSection.visualizations = readHome.getGroupTiles(oCdmGroup).reduce(function (aVisualizations, oCdmTile) {
                var oCdmViz = readVisualizations.get(oCdmSite, readHome.getTileVizId(oCdmTile));
                if (!oCdmViz) {
                    Log.error("Tile " + oCdmTile.id + " with vizId " + oCdmTile.vizId + " has no matching visualization. As the tile cannot be used to start an app it is removed from the page.");
                } else {
                    var aCdmParts = readVisualizations.getCdmParts(oCdmSite, oCdmTile);

                    var oVisualization = {
                        vizId: readHome.getTileVizId(oCdmTile) || "",
                        vizType: readVisualizations.getTypeId(oCdmViz) || "",
                        title: readVisualizations.getTitle(aCdmParts) || "",
                        subTitle: readVisualizations.getSubTitle(aCdmParts) || "",
                        icon: readVisualizations.getIcon(aCdmParts) || "",
                        keywords: readVisualizations.getKeywords(aCdmParts) || [],
                        info: readVisualizations.getInfo(aCdmParts) || "",
                        target: readVisualizations.getTarget(oCdmViz) || {}
                    };
                    aVisualizations.push(oVisualization);
                }
                return aVisualizations;
            }, []);

            return oSection;
        });

        return oPage;
    };

    /**
     * Returns the model
     *
     * @returns {object} Read only model
     * @since 1.72.0
     *
     * @private
     */
    Pages.prototype.getModel = function () {
        return this._oPagesModel;
    };

    /**
     * Calculates the path to a specific page in the model
     *
     * @param {string} sPageId Id of the page
     * @returns {string} Path to the page in the model
     * @since 1.72.0
     *
     * @private
     */
    Pages.prototype.getPagePath = function (sPageId) {
        var aPages = this._oPagesModel.getProperty("/pages");
        for (var iPageIndex = 0; iPageIndex < aPages.length; iPageIndex += 1) {
            if (aPages[iPageIndex].id === sPageId) {
                return "/pages/" + iPageIndex;
            }
        }
        return "";
    };

    /**
     * Loads a page into the model
     *
     * @param {string} sPageId id of the page
     * @returns {Promise<string>} promise resolves with the path to the model in the page after the page is loaded
     * @since 1.72.0
     *
     * @private
     */
    Pages.prototype.loadPage = function (sPageId) {
        var sPagePath = this.getPagePath(sPageId);

        if (sPagePath) {
            return Promise.resolve(sPagePath);
        }

        return this._oCdmServicePromise
            .then(function (oCdmService) {
                return oCdmService._getPage(sPageId)
                    .then(function (oSite) {
                        var iPageCount = this._oPagesModel.getProperty("/pages/").length;
                        var sNewPagePath = "/pages/" + iPageCount;
                        this._oPagesModel._setProperty(sNewPagePath, this._getParsedCdmPage(oSite));
                        return sNewPagePath;
                    }.bind(this))
                    .catch(function (oError) {
                        Log.error("Pages: Failed to gather Site from CDM Service.", oError, this.COMPONENT_NAME);
                        return Promise.reject(oError);
                    }.bind(this));
            }.bind(this))
            .catch(function (oError) {
                Log.error("Pages: Couldn't to resolve CDM Service.", oError, this.COMPONENT_NAME);
                return Promise.reject(oError);
            }.bind(this));
    };

    Pages.hasNoAdapter = true;
    return Pages;
}, /*export=*/ true);