// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's search service which provides Enterprise Search via SINA.
 *
 * @version 1.74.0
 */
/* global jQuery,sap */
sap.ui.define(["jquery.sap.global", 'sap/ushell/renderers/fiori2/search/appsearch/AppSearch'], function ($, AppSearch) {
    "use strict";
    /* eslint valid-jsdoc:0 */

    function Search(oAdapter, oContainerInterface) {
        this.init.apply(this, arguments);
    }

    Search.prototype = {

        init: function (oAdapter, oContainerInterface, sParameter, oServiceProperties) {
            this.oAdapter = oAdapter;
            this.oContainerInterface = oContainerInterface;
            this.oLpdService = sap.ushell.Container.getService("LaunchPage");
            var appSearchProviderProperties = { optimizedAppSearch: false };
            if (oServiceProperties && oServiceProperties.config && oServiceProperties.config.optimizedAppSearch !== undefined) {
                appSearchProviderProperties.optimizedAppSearch = oServiceProperties.config.optimizedAppSearch;
            }
            this.appSearch = new AppSearch(appSearchProviderProperties);
        },

        isSearchAvailable: function () {
            return this.oAdapter.isSearchAvailable();
        },

        getSina: function () {
            return this.oAdapter.getSina();
        },

        prefetch: function () {
            return this.appSearch.prefetch();
        },

        queryApplications: function (query) {
            query.top = query.top || 10;
            query.skip = query.skip || 0;
            return this.appSearch.search(query).then(function (searchResult) {
                return {
                    totalResults: searchResult.totalCount,
                    searchTerm: query.searchTerm,
                    getElements: function () {
                        return searchResult.tiles;
                    }
                };
            }.bind(this));
        }

    };


    Search.hasNoAdapter = false;
    return Search;

}, true /* bExport */);