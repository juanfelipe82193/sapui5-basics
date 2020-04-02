// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistence utility to interact with the /UI2/FDM_PAGE_REPOSITORY_SRV service on ABAP
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Constructs a new instance of the PagePersistence utility.
     *
     * @param {sap.ui.model.odata.v2.ODataModel} oDataModel The ODataModel for the PageRepositoryService
     * @param {sap.base.i18n.ResourceBundle} oResourceBundle The translation bundle
     * @param {sap.ui.model.message.MessageModel} oMessagemodel The sap-message model
     * @constructor
     *
     * @since 1.70.0
     *
     * @private
     */
    var PagePersistence = function (oDataModel, oResourceBundle, oMessagemodel) {
        this._oODataModel = oDataModel;
        this._oResourceBundle = oResourceBundle;
        this._oEtags = {};
        this._oMessageModel= oMessagemodel;
    };

    /**
     * Returns a promise which resolves to an array of page headers of all available pages.
     *
     * @returns {Promise<object[]>} Resolves to an array of page headers.
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.getPages = function () {
        return this._readPages()
            .then(function (pages) {
                for (var i = 0; i < pages.results.length; i++) {
                    this._storeETag(pages.results[i]);
                }
                return pages;
            }.bind(this))
            .then(this._convertODataToPageList.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Returns a page
     *
     * @param {string} sPageId The page ID
     * @returns {Promise<object>} Resolves to a page
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.getPage = function (sPageId) {
        return this._readPage(sPageId)
            .then(function (page) {
                this._storeETag(page);
                return page;
            }.bind(this))
            .then(this._convertODataToReferencePage.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Creates a new page
     *
     * @param {object} oPageToCreate The new page
     * @returns {Promise} Resolves when the page has been created successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.createPage = function (oPageToCreate) {
        var pageToCreate = this._convertReferencePageToOData(oPageToCreate);

        return this._createPage(pageToCreate).then(this._storeETag.bind(this));
    };

    /**
     * Updates a page. This method expects to get the complete page. Sections and tiles
     * that are left out will be deleted.
     *
     * @param {object} oUpdatedPage The updated page data
     * @returns {Promise} Resolves when the page has been updated successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.updatePage = function (oUpdatedPage) {
        var oUpdatedODataPage = this._convertReferencePageToOData(oUpdatedPage);

        oUpdatedODataPage.modifiedOn = this._oEtags[oUpdatedPage.content.id].modifiedOn;

        return this._createPage(oUpdatedODataPage)
            .then(this._storeETag.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Deletes a  page
     *
     * @param {string} sPageId The ID of the page to be deleted
     * @param {string} sTransportId The transport workbench
     * @returns {Promise} Resolves when the page has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.deletePage = function (sPageId, sTransportId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/deletePage", {
                method: "POST",
                urlParameters: {
                    pageId: sPageId,
                    transportId: sTransportId,
                    modifiedOn: this._oEtags[sPageId].modifiedOn
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Copy a  page
     *
     * @param  {object} oPageToCreate The page data to copy
     * @returns {Promise} Resolves when the page has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.copyPage = function (oPageToCreate) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/copyPage", {
                method: "POST",
                urlParameters: {
                    targetId: oPageToCreate.content.targetId.toUpperCase(),
                    sourceId: oPageToCreate.content.sourceId,
                    title: oPageToCreate.content.title,
                    description: oPageToCreate.content.description,
                    devclass: oPageToCreate.metadata.devclass,
                    transportId: oPageToCreate.metadata.transportId
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Fetches the catalog information.
     * @param {string} pageId The page ID by which to scope the catalogs.
     * @param {string[]} [aRoles=undefined] The roles by which to scope the catalogs, will override the scoping by page ID if passed.
     * @returns {Promise<object[]>[]} An array of promises resolving to an array of objects containing the visualization catalogs
     *
     * @private
     */
    PagePersistence.prototype.getCatalogs = function (pageId, aRoles) {
        return !aRoles || aRoles.length === 1 && !aRoles[0]
            ? [this._getCatalogsByPage(pageId)]
            : this._getCatalogsByRole(aRoles);
    };

    /**
     * Reads the headers of the available pages from the server
     *
     * @returns {Promise<object>} Resolves to the page headers in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._readPages = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads a page from the server
     *
     * @param {string} sPageId The page ID
     * @returns {Promise<object>} Resolves to a page in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._readPage = function (sPageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(sPageId) + "')", {
                urlParameters: {
                    "$expand": "sections/tiles"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Creates a page on the server
     *
     * @param {object} oNewPage The page data
     * @returns {Promise} Page the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._createPage = function (oNewPage) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.create("/pageSet", oNewPage, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Converts a list of page headers from the OData format into the FLP internal format
     *
     * @param {object[]} aPages The page headers in the OData format
     * @returns {object[]} The page headers in the FLP-internal format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertODataToPageList = function (aPages) {
        return aPages.results.map(function (oPage) {
            return {
                content: {
                    id: oPage.id,
                    title: oPage.title,
                    description: oPage.description,
                    createdBy: oPage.createdBy,
                    createdByFullname: oPage.createdByFullname,
                    createdOn: oPage.createdOn,
                    modifiedBy: oPage.modifiedBy,
                    modifiedByFullname: oPage.modifiedByFullname,
                    modifiedOn: oPage.modifiedOn,
                    masterLanguage: oPage.masterLanguage,
                    editAllowed: this.checkErrorMessage(oPage.id)
                },
                metadata: {
                    devclass: oPage.devclass,
                    transportId: oPage.transportId
                }
            };
        }.bind(this));
    };

    /**
     * Converts a reference page from the OData format to the FLP internal format
     *
     * @param {object} oPage The page in the OData format
     * @returns {object} The page in the FLP format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertODataToReferencePage = function (oPage) {
        return {
            content: {
                id: oPage.id,
                title: oPage.title,
                description: oPage.description,
                createdBy: oPage.createdBy,
                createdByFullname: oPage.createdByFullname,
                createdOn: oPage.createdOn,
                modifiedBy: oPage.modifiedBy,
                modifiedByFullname: oPage.modifiedByFullname,
                modifiedOn: oPage.modifiedOn,
                masterLanguage: oPage.masterLanguage,
                editAllowed: this.checkErrorMessage(oPage.id),
                sections: oPage.sections.results.map(function (section) {
                    return {
                        id: section.id,
                        title: section.title,
                        visualizations: section.tiles.results.map(function (tile) {
                            return {
                                id: tile.id,
                                vizId: tile.catalogTile,
                                inboundPermanentKey: tile.targetMapping,
                                title: tile.title,
                                subTitle: tile.subTitle,
                                iconUrl: tile.iconUrl,
                                tileType: tile.tileType
                            };
                        })
                    };
                })
            },
            metadata: {
                transportId: oPage.transportId,
                devclass: oPage.devclass
            }
        };
    };

    /**
     * Converts the reference page from the FLP internal format to the OData format
     *
     * @param {object} oPage The page in the FLP format
     * @returns {object} The page in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertReferencePageToOData = function (oPage) {
        var oReferencePage = oPage.content,
            oMetadata = oPage.metadata;

        var oODataPage = {
            id: oReferencePage.id,
            title: oReferencePage.title,
            description: oReferencePage.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            sections: (oReferencePage.sections || []).map(function (section) {
                return {
                    id: section.id,
                    title: section.title,
                    tiles: (section.visualizations || []).map(function (tile) {
                        return {
                            id: tile.id,
                            catalogTile: tile.vizId,
                            targetMapping: tile.inboundPermanentKey
                        };
                    })
                };
            })
        };

        return oODataPage;
    };

    /**
     * Stores the etag for a newly retrieved
     *
     * @param {object} oPage The newly retrieved
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._storeETag = function (oPage) {
        this._oEtags[oPage.id] = {
            // this is used as an etag for the deep update
            modifiedOn: oPage.modifiedOn,
            // this etag is used for deletion
            etag: oPage.__metadata.etag
        };
    };

    /**
     * Aborts all the pending requests
     * @since 1.72.0
     */
    PagePersistence.prototype.abortPendingBackendRequests = function () {
        if (this._oODataModel.hasPendingRequests()) {
            for (var i = 0; i < this._oODataModel.aPendingRequestHandles.length; i++) {
                this._oODataModel.aPendingRequestHandles[i].abort();
            }
        }
    };

    /**
     * Extracts the error message from an error object
     *
     * @param {object} oError The error object
     * @returns {Promise} A rejected promise containing the error message
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._rejectWithErrorMessage = function (oError) {
        var sErrorMessage,
            oSimpleError = {};

        if (oError.statusCode === "412") {
            sErrorMessage = this._oResourceBundle.getText("Message.OverwriteChanges");
        } else if (oError.statusCode === "400") {
            sErrorMessage = this._oResourceBundle.getText("Message.OverwriteRemovedPage");
        } else {
            try {
                sErrorMessage = JSON.parse(oError.responseText).error.message.value || oError.message;
            } catch (error) {
                sErrorMessage = oError.message;
            }
        }
        oSimpleError.message = sErrorMessage;
        oSimpleError.statusCode = oError.statusCode;
        oSimpleError.statusText = oError.statusText;
        return Promise.reject(oSimpleError);
    };

    /**
     * Extracts the error message from an message model.
     *
     * @param {string} sPageId The Page ID.
     * @returns {boolean} returns true when page has Errors.
     *
     * @since 1.74.0
     *
     * @private
     */
    PagePersistence.prototype.checkErrorMessage = function (sPageId) {
        function filterItems (arr, query) {
            return arr.filter(function (obj) {
                return obj.target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
        }
        var oMessageModelData = this._oMessageModel.getData();
        return !(filterItems(oMessageModelData, "/pageSet('"+sPageId+"')").length>0);

    };


    /**
     * Get the catalogs with expanded visualizations scoped by the roleId
     *
     * @param {string[]} aRoleIds Array of IDs of the role to scope by
     * @returns {Promise<object[]>[]} An array of promises resolving to an array of objects containing the visualization catalogs
     * @private
     */
    PagePersistence.prototype._getCatalogsByRole = function (aRoleIds) {
        var promises = [];
        aRoleIds.forEach(function (sRoleId) {
            promises.push(new Promise(function (resolve, reject) {
                this._oODataModel.read("/roleSet('" + encodeURIComponent(sRoleId) + "')", {
                    urlParameters: {
                        "$expand": "catalogs/visualizations"
                    },
                    success: function (oRole) {
                        resolve(oRole.catalogs.results);
                    },
                    error: reject
                });
            }.bind(this)));
        }.bind(this));
        return promises;
    };

    /**
     * Get the catalogs  with expanded visualizations scoped by the roleIds attached to the given pageId
     *
     * @param {string} pageId The pageId to scope by
     * @returns {Promise<{object}[]>} A promise resolving to an array of objects containing the visualization catalogs
     * @private
     */
    PagePersistence.prototype._getCatalogsByPage = function (pageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                urlParameters: {
                    "$expand": "roles/catalogs/visualizations"
                },
                success: function (oPage) {
                    var aRoles = oPage.roles.results;
                    var aCatalogs = aRoles.reduce(function (catalogs, role) {
                        return catalogs.concat(role.catalogs.results);
                    }, []);
                    resolve(aCatalogs);
                },
                error: reject
            });
        }.bind(this));
    };

    /**
     * @typedef {object} RoleObject Object expanded from the oData model containing role information.
     * @property {string} title Title of the role.
     * @property {string} name Name, i.e. the ID of the role.
     * @property {object} catalogs A deferred object to the page catalogs.
     * @property {object} __metadata The metadata for this role object.
     */
    /**
     * Expand the oData model to get the available roles.
     *
     * @param {String} pageId The ID of the page the roles need to be read from.
     * @returns {Promise<RoleObject[]>} An array of roles available for the given page.
     *
     * @private
     */
    PagePersistence.prototype.getRoles = function (pageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                urlParameters: {
                    "$expand": "roles/catalogs/visualizations"
                },
                success: function (oPage) {
                    var aRoles = oPage.roles.results;
                    resolve(aRoles);
                },
                error: reject
            });
        }.bind(this));
    };

    return PagePersistence;
}, true /* bExport */);
