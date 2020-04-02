// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
// TODO error handle search sub providers
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/appsearch/CatalogSearch',
    'sap/ushell/renderers/fiori2/search/appsearch/TransactionSearch'
], function (CatalogSearch, TransactionSearch) {
    "use strict";

    var AppSearch = function () {
        this.init.apply(this, arguments);
    };

    AppSearch.prototype = {

        init: function (properties) {
            this.catalogSearch = new CatalogSearch(properties);
            this.transactionSearch = new TransactionSearch(properties);
            this.searchProviders = [this.catalogSearch, this.transactionSearch]; // deactivate transaction search
        },

        prefetch: function () {
            for (var i = 0; i < this.searchProviders.length; i++) {
                var searchProvider = this.searchProviders[i];
                searchProvider.prefetch();
            }
        },

        search: function (query) {
            var queryPromises = [];
            for (var i = 0; i < this.searchProviders.length; i++) {
                var searchProvider = this.searchProviders[i];
                queryPromises.push(searchProvider.search(query));
            }
            return jQuery.when.apply(null, queryPromises).then(function () {
                var subResults = arguments;
                var result = {
                    totalCount: 0,
                    tiles: []
                };
                for (var i = 0; i < subResults.length; i++) {
                    var subResult = subResults[i];
                    result.totalCount += subResult.totalCount;
                    result.tiles.push.apply(result.tiles, subResult.tiles);
                }
                return result;
            });
        }

    };

    return AppSearch;
});
