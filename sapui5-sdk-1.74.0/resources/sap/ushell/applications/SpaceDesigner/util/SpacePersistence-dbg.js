// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview SpacePersistence utility to interact with the /UI2/FDM_SPACE_REPOSITORY_SRV service on ABAP
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Constructs a new instance of the SpacePersistence utility.
     *
     * @param {sap.ui.model.odata.v2.ODataModel} oDataModel The ODataModel for the SpacePersistenceService
     * @param {sap.base.i18n.ResourceBundle} oResourceBundle The translation bundle
     * @constructor
     *
     * @since 1.70.0
     *
     * @private
     */
    var SpacePersistence = function (oDataModel, oResourceBundle) {
        this._oODataModel = oDataModel;
        this._oResourceBundle = oResourceBundle;
        this._oEtags = {};
    };

    /**
     * Returns a promise which resolves to an array of space headers of all available spaces.
     *
     * @returns {Promise<object[]>} Resolves to an array of spaces headers
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.getSpaces = function () {
        return this._readSpaces()
            .then(function (spaces) {
                for (var i = 0; i < spaces.results.length; i++) {
                    this._storeETag(spaces.results[i]);
                }
                return spaces;
            }.bind(this))
            .then(this._convertODataToSpaceList)
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Returns a space
     *
     * @param {string} sSpaceId The space ID
     * @returns {Promise<object>} Resolves to a space
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.getSpace = function (sSpaceId) {
        return this._readSpace(sSpaceId)
            .then(function (space) {
                this._storeETag(space);
                return space;
            }.bind(this))
            .then(this._convertODataToReferenceSpace)
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Creates a new space
     *
     * @param {object} oSpaceToCreate The new space
     * @returns {Promise} Resolves when the space has been created successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.createSpace = function (oSpaceToCreate) {
        var spaceToCreate = this._convertReferenceSpaceToOData(oSpaceToCreate);

        return this._createSpace(spaceToCreate).then(this._storeETag.bind(this));
    };

    /**
     * Updates a space. This method expects to get the complete space. Pages
     * that are left out will be deleted.
     *
     * @param {object} oUpdatedSpace The updated space data
     * @returns {Promise} Resolves when the space has been updated successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.updateSpace = function (oUpdatedSpace) {
        var oUpdatedODataSpace = this._convertReferenceSpaceToOData(oUpdatedSpace);

        oUpdatedODataSpace.modifiedOn = this._oEtags[oUpdatedSpace.content.id].modifiedOn;

        return this._createSpace(oUpdatedODataSpace)
            .then(this._storeETag.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Deletes a  space
     *
     * @param {string} sSpaceId The ID of the space to be deleted
     * @param {string} sTransportId The transport workbench
     * @returns {Promise} Resolves when the space has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.deleteSpace = function (sSpaceId, sTransportId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/deleteSpace", {
                method: "POST",
                urlParameters: {
                    spaceId: sSpaceId,
                    transportId: sTransportId,
                    modifiedOn: this._oEtags[sSpaceId].modifiedOn
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Copy a  space
     *
     * @param  {object} oSpaceToCreate The space data to copy
     * @returns {Promise} Resolves when the space has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.copySpace = function (oSpaceToCreate) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/copySpace", {
                method: "POST",
                urlParameters: {
                    targetId: oSpaceToCreate.content.targetId.toUpperCase(),
                    sourceId: oSpaceToCreate.content.sourceId,
                    title: oSpaceToCreate.content.title,
                    devclass: oSpaceToCreate.metadata.devclass,
                    transportId: oSpaceToCreate.metadata.transportId
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads the headers of the available spaces from the server
     *
     * @returns {Promise<object>} Resolves to the space headers in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._readSpaces = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/spaceSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads a space from the server
     *
     * @param {string} sSpaceId The space ID
     * @returns {Promise<object>} Resolves to a space in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._readSpace = function (sSpaceId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/spaceSet('" + encodeURIComponent(sSpaceId) + "')", {
                urlParameters: {
                    "$expand": "pages"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Creates a space on the server
     *
     * @param {object} oNewSpace The space data
     * @returns {Promise} Space the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._createSpace = function (oNewSpace) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.create("/spaceSet", oNewSpace, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Converts a list of space headers from the OData format into the FLP internal format
     *
     * @param {object[]} aSpaces The space headers in the OData format
     * @returns {object[]} The space headers in the FLP-internal format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertODataToSpaceList = function (aSpaces) {
        return aSpaces.results.map(function (oSpace) {
            return {
                content: {
                    id: oSpace.id,
                    title: oSpace.title,
                    description: oSpace.description,
                    createdBy: oSpace.createdBy,
                    createdByFullname: oSpace.createdByFullname,
                    createdOn: oSpace.createdOn,
                    modifiedBy: oSpace.modifiedBy,
                    modifiedByFullname: oSpace.modifiedByFullname,
                    modifiedOn: oSpace.modifiedOn,
                    masterLanguage: oSpace.masterLanguage
                },
                metadata: {
                    devclass: oSpace.devclass,
                    transportId: oSpace.transportId
                }
            };
        });
    };

    /**
     * Converts a reference space from the OData format to the FLP internal format
     *
     * @param {object} oSpace The space in the OData format
     * @returns {object} The space in the FLP format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertODataToReferenceSpace = function (oSpace) {
        return {
            content: {
                id: oSpace.id,
                title: oSpace.title,
                description: oSpace.description,
                createdBy: oSpace.createdBy,
                createdByFullname: oSpace.createdByFullname,
                createdOn: oSpace.createdOn,
                modifiedBy: oSpace.modifiedBy,
                modifiedByFullname: oSpace.modifiedByFullname,
                modifiedOn: oSpace.modifiedOn,
                masterLanguage: oSpace.masterLanguage,
                pages: oSpace.pages.results.map(function (page) {
                    return {
                        id: page.id,
                        title: page.title
                    };
                })
            },
            metadata: {
                transportId: oSpace.transportId,
                devclass: oSpace.devclass
            }
        };
    };

    /**
     * Converts the reference space from the FLP internal format to the OData format
     *
     * @param {object} oSpace The space in the FLP format
     * @returns {object} The space in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertReferenceSpaceToOData = function (oSpace) {
        var oReferenceSpace = oSpace.content,
            oMetadata = oSpace.metadata;

        var oODataSpace = {
            id: oReferenceSpace.id,
            title: oReferenceSpace.title,
            description: oReferenceSpace.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            pages: (oReferenceSpace.pages || []).map(function (page) {
                return {
                    id: page.id,
                    title: page.title
                };
            })
        };

        return oODataSpace;
    };

    /**
     * Stores the etag for a newly retrieved
     *
     * @param {object} oSpace The newly retrieved
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._storeETag = function (oSpace) {
        this._oEtags[oSpace.id] = {
            // this is used as an etag for the deep update
            modifiedOn: oSpace.modifiedOn,
            // this etag is used for deletion
            etag: oSpace.__metadata.etag
        };
    };

    /**
     * Aborts all the pending requests
     * @since 1.72.0
     */
    SpacePersistence.prototype.abortPendingBackendRequests = function () {
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
    SpacePersistence.prototype._rejectWithErrorMessage = function (oError) {
        var sErrorMessage;

        if (oError.statusCode === "412") {
            sErrorMessage = this._oResourceBundle.getText("Message.SpaceIsOutdated");
        } else {
            try {
                sErrorMessage = JSON.parse(oError.responseText).error.message.value || oError.message;
            } catch (error) {
                sErrorMessage = oError.message;
            }
        }
        return Promise.reject(sErrorMessage);
    };



    return SpacePersistence;
}, true /* bExport */);
