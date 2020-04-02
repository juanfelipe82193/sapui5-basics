// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
    "use strict";

    /**
     * @param {string} oODataModel The oData model of the transport service
     * @constructor
     */
    var TransportHelper = function (oODataModel) {
        this.oODataModel = oODataModel;
    };

    /**
     * Returns a promise which resolves to
     * - the transport information if there are results
     * - true if there are no results
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<boolean|object>} A promise resolving to the object or true
     *
     * @private
     */
    TransportHelper.prototype._getTransportLockedInformation = function (sPageId) {
        return this._readTransportInformation(sPageId)
            .then(function (oTransport) {
                return oTransport.results.length ? oTransport.results[0] : true;
            });
    };

    /**
     * Reads the transport information for the given pageId
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<object>} A promise resolving to a result object
     *
     * @private
     */
    TransportHelper.prototype._readTransportInformation = function (sPageId) {
        var sUrl = "/transportSet";
        var filter = new Filter("pageId", FilterOperator.EQ, sPageId);
        return new Promise(function (resolve, reject) {
            this.oODataModel.read(sUrl, {
                filters: [filter],
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if a transport is required for the given package name
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<boolean>} A promise resolving to boolean
     *
     * @private
     */
    TransportHelper.prototype._isPackageTransportRequired = function (sPackageName) {
        return this._readPackageInformation(sPackageName)
            .then(function (result) {
                return result.transportRequired;
            });
    };

    /**
     * Reads information for a given package
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<object>} A promise resolving to the result object
     *
     * @private
     */
    TransportHelper.prototype._readPackageInformation = function (sPackageName) {
        var sUrl = "/packageSet('" + encodeURIComponent(sPackageName) + "')";
        return new Promise(function (resolve, reject) {
            this.oODataModel.read(sUrl, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if the transport information should be displayed
     *
     * True if the transportId is NOT set but transport is required for the package
     *
     * @param {object} oPage The page object to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @private
     */
    TransportHelper.prototype._showTransport = function (oPage) {
        var sPackageName = oPage.metadata.devclass;

        if (oPage && oPage.metadata && !oPage.metadata.transportId) {
            return this._isPackageTransportRequired(sPackageName);
        }

        return Promise.resolve(false);
    };

    /**
     * Checks if the transport information needs to be shown
     *
     * @param {object} page The page to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @protected
     */
    TransportHelper.prototype.checkShowTransport = function (page) {
        return this._showTransport(page).then(function (showTransport) {
            return showTransport;
        });
    };

    /**
     * Checks if the page is locked by another user
     *
     * @param {object} page The page to edit
     * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
     *
     * @protected
     */
    TransportHelper.prototype.checkShowLocked = function (page) {
        return this._getTransportLockedInformation(page.content.id).then(function (transportLockedInformation) {
            if (transportLockedInformation.foreignOwner) {
                return transportLockedInformation;
            }
            return false;
        });
    };

    return TransportHelper;
});