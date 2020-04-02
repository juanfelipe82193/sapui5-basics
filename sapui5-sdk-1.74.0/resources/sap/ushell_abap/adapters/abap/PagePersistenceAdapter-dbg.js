// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PagePersistenceAdapter for the ABAP platform.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ushell/resources"
], function (ObjectPath, ODataModel, resources) {
    "use strict";

    /**
    * Constructs a new instance of the PagePersistenceAdapter for the ABAP
    * platform
    *
    * @constructor
    *
    * @param {object} system The system information
    * @param {string} parameter The adapter parameter
    * @param {object} adapterConfiguration The adapter configuration
    *
    * @experimental Since 1.67.0
    * @private
    */
    var PagePersistenceAdapter = function (system, parameter, adapterConfiguration) {
        this.S_COMPONENT_NAME = "sap.ushell_abap.adapters.abap.PagePersistenceAdapter";
        var sPagePersistenceServiceURL = (ObjectPath.get("config.serviceUrl", adapterConfiguration) || "").replace(/\/?$/, "/");

        this._oODataModel = new ODataModel({
            serviceUrl: sPagePersistenceServiceURL,
            headers: {
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": (system && system.getClient()) || sap.ushell.Container.getLogonSystem().getClient()
            },
            defaultCountMode: "None",
            skipMetadataAnnotationParsing: true,
            useBatch: false
        });
    };

    /**
    * Returns a page
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.getPage = function (pageId) {
        var oPromise = this._readPage(pageId)
            .then(this._convertODataToReferencePage)
            .catch(this._rejectWithError.bind(this));

        return oPromise;
    };

    /**
    * Reads a page from the server
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page in the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._readPage = function (pageId) {
        var oPromise = new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) +"')", {
                urlParameters: {
                    "$expand": "sections/tiles"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));

        return oPromise;
    };

    /**
    * Converts a reference page from the OData format to the FLP internal format
    *
    * @param {object} page The page in the OData format
    * @returns {object} The page in the FLP format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._convertODataToReferencePage = function (page) {
        return {
            content: {
                id: page.id,
                title: page.title,
                description: page.description,
                sections: page.sections.results.map(function (section) {
                    return {
                        id: section.id,
                        title: section.title,
                        visualizations: section.tiles.results.map(function (tile) {
                            return {
                                id: tile.id,
                                vizId: tile.catalogTile,
                                inboundPermanentKey: tile.targetMapping
                            };
                        })
                    };
                })
            }
        };
    };

    /**
    *
    * @param {object} error The error object
    * @returns {Promise} A rejected promise containing the error
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._rejectWithError = function (error) {
        var oError = {
            component: this.S_COMPONENT_NAME,
            description: resources.i18n.getText("PagePersistenceAdapter.CannotLoadPage"),
            detail: error
        };
        return Promise.reject(oError);
    };

    return PagePersistenceAdapter;
}, true /* bExport */);
