// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's platform independent sap.ushell.adapters.PagesCommonDataModelAdapter.
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath"
], function (Log, ObjectPath) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the platform independent PagesCommonDataModelAdapter.
     *
     * @class
     * @constructor
     * @see {@link sap.ushell.adapters.PagesCommonDataModelAdapter}
     *
     * @since 1.69.0
     * @private
     */
    var PagesCommonDataModelAdapter = function () {
        this._oCDMPagesRequests = {};
        this._sComponent = "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter";
    };

    /**
     * Retrieves the CDM site for the first assigned space.
     *
     * @returns {jQuery.Deferred.Promise}
     *   The promise's done handler returns the CDM site object.
     *   In case an error occurred, the promise's fail handler returns an error message.
     *
     * @since 1.69.0
     * @private
     */
    PagesCommonDataModelAdapter.prototype.getSite = function () {
        var oDeferred = new jQuery.Deferred();

        sap.ushell.Container.getServiceAsync("Menu")
            .then(function (oMenuService) {
                return oMenuService.getMenuEntries();
            })
            .then(function (aMenuEntries) {
                if (!ObjectPath.get("target.parameters", aMenuEntries[0])) {
                    var sErrorMessage = "PagesCommonDataModelAdapter: Couldn't determine the default page from the first menu entry";
                    Log.error(sErrorMessage, null, this._sComponent);
                    return Promise.reject(sErrorMessage);
                }

                var sPageId = aMenuEntries[0].target.parameters.find(function (oParameter) {
                    return oParameter.name === "pageId";
                });
                return this._getPage(sPageId && sPageId.value);
            }.bind(this))
            .then(oDeferred.resolve)
            .catch(oDeferred.reject);

        return oDeferred.promise();
    };

    /**
     * Retrieves the CDM Site of a specific page id.
     *
     * @param {string} pageId the id of the page.
     * @returns {Promise}
     *   The Promise resolves with the CDM site object.
     *   The Promise rejects with an error message.
     * @since 1.72.0
     *
     * @private
     */
    PagesCommonDataModelAdapter.prototype._getPage = function (pageId) {
        if (!pageId) {
            var sErrorMessage = "PagesCommonDataModelAdapter: _getPage was called without a pageId";
            Log.fatal(sErrorMessage, null, this._sComponent);
            return Promise.reject(sErrorMessage);
        }

        if (this._oCDMPagesRequests[pageId]) {
            return this._oCDMPagesRequests[pageId];
        }

        this._oCDMPagesRequests[pageId] = Promise.all([
                sap.ushell.Container.getServiceAsync("NavigationDataProvider"),
                sap.ushell.Container.getServiceAsync("VisualizationDataProvider"),
                sap.ushell.Container.getServiceAsync("PagePersistence")
            ]).then(function (aServices) {
                return Promise.all([
                    aServices[2].getPage(pageId),
                    aServices[1].getVisualizationData(),
                    aServices[0].getNavigationData(),
                    sap.ushell.Container.getServiceAsync("PageReferencing")
                ]);
            }).then(function (aResult) {
                var oPage = aResult[0].content;
                var oVisualizationData = aResult[1];
                var oNavigationData = aResult[2];
                var PageReferencing = aResult[3];

                var oCDMSite = PageReferencing.dereferencePage(oPage, oVisualizationData, oNavigationData);
                return oCDMSite;
            }).catch(function (vError) {
                Log.fatal(
                    "PagesCommonDataModelAdapter encountered an error while fetching required services: ",
                    vError,
                    this._sComponent);
                return Promise.reject(vError);
            }.bind(this));

        return this._oCDMPagesRequests[pageId];
    };


    /**
     * Retrieves the personalization part of the CDM site
     *
     * @returns {jQuery.Deferred.Promise}
     *   The promise's done handler returns the personalization object of the CDM site.
     *   In case an error occurred, the promise's fail handler returns an error message.
     *
     * @since 1.69.0
     * @private
     */
    PagesCommonDataModelAdapter.prototype.getPersonalization = function () {
        // No implementation until further notice
        return new jQuery.Deferred().resolve({}).promise();
    };

    /**
     * Wraps the logic for storing the personalization data.
     *
     * @param {object} oPersonalizationData
     *   Personalization data which should get stored
     * @returns {jQuery.Deferred.Promise} promise
     *   The promise's done handler indicates successful storing of personalization data.
     *   In case an error occured, the promise's fail handler returns an error message.
     *
     * @since 1.69.0
     * @private
     */
    PagesCommonDataModelAdapter.prototype.setPersonalization = function (oPersonalizationData) {
        // No implementation until further notice
        return new jQuery.Deferred().resolve().promise();
    };

    return PagesCommonDataModelAdapter;
}, /*export=*/ true);
