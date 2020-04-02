// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module deals with page related referencing and dereferencing.</p>
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/ushell/services/_PageReferencing/PageDereferencer",
    "sap/ushell/services/_PageReferencing/PageReferencer"
], function (PageDereferencer, PageReferencer) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("PageReferencing")</code>.
     * Constructs a new instance of the page referencing service.
     *
     * @namespace sap.ushell.services.PageReferencing
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @experimental Since 1.68.0
     *
     * @private
     */
    function PageReferencing () {
    }

    /**
     * Uses visualization- and navigation data to resolve a CDM page with references
     * into a complete CDM site (without references).
     *
     * @param {object} page CDM page to dereference.
     * @param {object} visualizationData Hash map with visualization objects.
     * @param {object[]} navigationData Array with navigation data.
     *
     * @returns {object} CDM site.

     * @experimental Since 1.68.0
     * @protected
     */
    PageReferencing.prototype.dereferencePage = function (page, visualizationData, navigationData) {
        return PageDereferencer.dereference(page, visualizationData, navigationData);
    };

    /**
     * Create reference page based on the page layout
     *
     * @param {Object} pageInfo Data are given by the user when creating the page
     * @param {Array} pageLayout Exported homepage model:<br>
     *  Properties of the contained object:<br>
     *   - {string} id<br>
     *       Generated group id<br>
     *   - {string} title<br>
     *       The group title<br>
     *   - {Array} tiles<br>
     *       The list of the tiles in the group. The tiles object should have target (hash to the application) and tileCatalogId properies.
     *
     * @returns {Object} Reference page

     * @experimental Since 1.68.0
     * @protected
     */
    PageReferencing.prototype.createReferencePage = function (pageInfo, pageLayout) {
        return PageReferencer.createReferencePage(pageInfo, pageLayout);
    };

    PageReferencing.hasNoAdapter = true;
    return PageReferencing;

});
