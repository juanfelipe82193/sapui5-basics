// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module deals with the page persistence.</p>
 *
 * @version 1.74.0
 */

sap.ui.define([], function () {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("PagePersistence")</code>.
     * Constructs a new instance of the page persistence service.
     *
     * @namespace sap.ushell.services.PagePersistence
     *
     * @param {object} adapter
     *     the page persistancy adapter for the frontend server
     * @param {object} serviceConfiguration
     *     the page persistency service configuration
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @experimental Since 1.67.0
     *
     * @private
     */
    function PagePersistence (/*adapter, serviceConfiguration*/) {
        this._init.apply(this, arguments);
    }

    PagePersistence.prototype._init = function (adapter, serviceConfiguration) {
        this._oServiceConfiguration = serviceConfiguration;
        this.oAdapter = adapter;
    };

    /**
     * Gets a specific page identified by its ID
     *
     * @param {string} id The ID of the page
     * @returns {Promise<object>} The page
     *
     * @private
     */
    PagePersistence.prototype.getPage = function (id) {
        return this.oAdapter.getPage(id);
    };

    PagePersistence.hasNoAdapter = false;
    return PagePersistence;
});