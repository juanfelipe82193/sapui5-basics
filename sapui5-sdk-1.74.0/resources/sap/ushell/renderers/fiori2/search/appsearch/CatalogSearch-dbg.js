// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/appsearch/JsSearchFactory',
    'sap/base/Log'
], function (jsSearchFactory, Log) {
    "use strict";

    var CatalogSearch = function () {
        this.init.apply(this, arguments);
    };

    CatalogSearch.prototype = {

        init: function (properties) {
            this.launchPageService = sap.ushell.Container.getService("LaunchPage");
            this.optimizedAppSearch = properties.optimizedAppSearch;
            this.searchEngines = {};
        },

        prefetch: function () {
            return this._getTiles();
        },

        search: function (query) {
            query.scope = query.scope || 'allTiles';

            return this._getSearchEngine(query.scope).then(function (searchEngine) {

                var searchResults;

                // search
                try {
                    searchResults = searchEngine.search({
                        searchFor: query.searchTerm,
                        top: query.top,
                        skip: query.skip
                    });
                } catch (error) {
                    var errorDeferred = new jQuery.Deferred();
                    errorDeferred.reject(error);
                    return errorDeferred;
                }

                // format search result 
                var resultTiles = [];
                for (var i = 0; i < searchResults.results.length; ++i) {
                    var searchResult = searchResults.results[i];
                    var tile = searchResult.object;
                    var highlightedLabel = searchResult.highlighted.label;
                    resultTiles.push(this._formatTile(tile, highlightedLabel));
                }

                // return results
                return {
                    totalCount: searchResults.totalCount,
                    tiles: resultTiles
                };
            }.bind(this));
        },

        _getView: function (tileData) {
            // catalog tile view
            try {
                var typesContract = tileData.tile.getContract('types');
                typesContract.setType('tile');
            } catch (e) {
                /* nothing to do.. */
            }
            // create view
            var view = sap.ushell.Container.getService('LaunchPage').getCatalogTileView(tileData.tile);

            var title = 'app';
            if (tileData.tile.getTitle) {
                title = tileData.tile.getTitle();
            }

            view.eventLoggingData = {
                targetUrl: tileData.url,
                title: title
            };

            return view;
        },

        _getTiles: function () {

            var that = this;

            if (this.loadDeferred) {
                return this.loadDeferred;
            }

            this.loadDeferred = this.launchPageService.getCatalogs().then(function (catalogs) {

                var catalogDeferreds = [];

                // 1) get promises for all catalogs' tiles
                for (var i = 0; i < catalogs.length; i++) {
                    catalogDeferreds.push(this.launchPageService.getCatalogTiles(catalogs[i]));
                }

                // 2) append personalized group tiles
                catalogDeferreds.push(this._getPersonalizedGroupTiles());

                // when all promises have been resolved, merge their results together
                return jQuery.when.apply(jQuery, catalogDeferreds).then(function () {

                    // split into general catalogs and personalized part
                    var args = Array.prototype.slice.call(arguments);
                    var catalogs = args.slice(0, -1);
                    var personalizedCatalogs = args.slice(-1);

                    // collect valid catalog tiles
                    var catalogTiles, personalizedTiles, allTiles;
                    try {

                        // all tiles = catalog tiles + personalized tiles
                        allTiles = [];

                        // collect tiles from catalogs
                        // display catalog tiles at first, then display personalized Tiles
                        return that._collectTilesOfCatalogs(catalogs).then(function (results) {
                            catalogTiles = [];
                            for (var i = 0; i < results.length; i++) {
                                catalogTiles = catalogTiles.concat(results[i]);
                            }
                            that._sortTiles(catalogTiles);
                            allTiles.push.apply(allTiles, catalogTiles);
                            allTiles = that._removeDuplicateTiles(allTiles);
                            return that._collectTilesOfCatalogs(personalizedCatalogs);
                        }).then(function (results) {
                            // collect tiles from homepage (personalized+pinned)
                            // display duplicated tiles in catalog tiles section
                            // remove duplicated tiles in personalized tiles section
                            personalizedTiles = [];
                            for (var j = 0; j < results.length; j++) {
                                personalizedTiles = personalizedTiles.concat(results[j]);
                            }
                            that._sortTiles(personalizedTiles);
                            allTiles.push.apply(allTiles, personalizedTiles);
                            allTiles = that._removeDuplicateTiles(allTiles);
                            that._sortTiles(allTiles);

                            // return tile collections
                            return {
                                catalogTiles: catalogTiles,
                                personalizedTiles: personalizedTiles,
                                allTiles: allTiles
                            };
                        });
                    } catch (e) {
                        return jQuery.Deferred().reject(e); // eslint-disable-line new-cap
                    }
                });
            }.bind(this));

            return this.loadDeferred;
        },

        _getSearchEngine: function (scope) {
            return this._getTiles().then(function (tiles) {
                var searchEngine = this.searchEngines[scope];
                if (searchEngine) {
                    return searchEngine;
                }
                searchEngine = jsSearchFactory.createJsSearch({
                    objects: tiles[scope],
                    fields: ['label', 'keywords']
                });
                this.searchEngines[scope] = searchEngine;
                return searchEngine;
            }.bind(this));
        },

        _formatTile: function (tile, highlightedLabel) {
            var that = this;
            var resultTile = jQuery.extend({}, tile);
            if (highlightedLabel) {
                resultTile.label = highlightedLabel;
            }
            resultTile.type = "catalog";
            resultTile.getView = function () {
                return that._getView(this);
            };
            return resultTile;
        },

        _isTileViewNeeded: function (tile) {
            if (this.optimizedAppSearch) {
                return false;
            }
            return !this.launchPageService.getCatalogTilePreviewTitle(tile);
        },

        _collectTilesOfCatalogs: function (catalogs) {
            var promises = [];
            /*var factSheetTest = new RegExp('DisplayFactSheet', 'i');*/
            for (var i = 0; i < catalogs.length; i++) {
                promises.push(this._collectTilesOfCatalog(catalogs[i]));
            }
            return jQuery.when.apply(null, promises).then(function () {
                var tiles = [];
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i].length !== 0) {
                        tiles.push(arguments[i]);
                    }
                }
                return tiles;
            }, function (error) {

            });
        },

        _collectTilesOfCatalog: function (catalog) {
            var promises = [];

            for (var i = 0; i < catalog.length; i++) {
                promises.push(this._getTileAsync(catalog[i]));
            }

            return jQuery.when.apply(null, promises).then(function () {
                var tiles = [];
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== null) {
                        tiles.push(arguments[i]);
                    }
                }
                return tiles;
            }, function (error) {

            });
        },

        _getTileAsync: function (tile) {
            var promise = new jQuery.Deferred();
            var tileView, title, keywords, targetURL, subTitle, size, icon;

            try {
                // create tile view
                tileView = null;
                if (this._isTileViewNeeded(tile)) {
                    tileView = this.launchPageService.getCatalogTileView(tile);
                }

                // get tile properties
                keywords = this.launchPageService.getCatalogTileKeywords(tile);
                targetURL = this.launchPageService.getCatalogTileTargetURL(tile);
                title = this.launchPageService.getCatalogTilePreviewTitle(tile) || this.launchPageService.getCatalogTileTitle(tile);
                subTitle = this.launchPageService.getCatalogTilePreviewSubtitle(tile);
                size = this.launchPageService.getCatalogTileSize(tile);
                icon = this.launchPageService.getCatalogTilePreviewIcon(tile) || "sap-icon://business-objects-experience";

                // destroy tile view
                if (tileView) {
                    if (!tileView.destroy) {
                        var err = new Error('The tileview "' + title + '" with target url "' + targetURL + '" does not implement mandatory function destroy!');
                        err.name = 'Missing Impementation';
                        throw err;
                    }
                    tileView.destroy();
                }

                // unknown special logic: unclear whether this is needed
                if (tile.getContract) {
                    var previewContract = tile.getContract("preview");
                    if (previewContract) {
                        previewContract.setEnabled(false);
                    }
                }

                // check validity
                if (!this._isValid(tile)) {
                    promise.resolve(null);
                }

                // remove tiles without url
                if (!targetURL) {
                    promise.resolve(null);
                }

                /*
                // removed because there are regular apps like MaintenanceNotification-displayFactSheet
                // remove factsheet tiles
                if (factSheetTest.test(targetURL)) {
                    continue;
                }*/

                // assemble label
                var label = title;
                if (subTitle) {
                    label += ' - ' + subTitle;
                }

                // collect tile
                promise.resolve({
                    tile: tile,
                    keywords: (keywords instanceof Array) ? keywords.join(' ') : keywords,
                    url: targetURL,
                    label: label,
                    title: title || '',
                    subtitle: subTitle || '',
                    tooltip: title || '',
                    icon: icon,
                    size: size
                });

            } catch (e) {
                promise.resolve(null);
                Log.error(e);
                if (e.toString().indexOf('does not implement mandatory function destroy') >= 0) {
                    throw e;
                }
            }

            return promise;
        },

        _isValid: function (tile) {
            if (this.launchPageService.isTileIntentSupported) {
                return this.launchPageService.isTileIntentSupported(tile);
            }
            return true;

        },

        _getPersonalizedGroupTiles: function () {
            return this.launchPageService.getGroups().then(function (groups) {
                var resultTiles = [];
                for (var j = 0; j < groups.length; j++) {
                    var tiles = this.launchPageService.getGroupTiles(groups[j]) || [];
                    resultTiles.push.apply(resultTiles, tiles);
                }
                return resultTiles;
            }.bind(this));
        },

        _calcKey: function (tile) {
            return tile.title + '$$' + tile.subtitle + '$$' + tile.url + '$$' + tile.icon;
        },

        _removeDuplicateTiles: function (tiles) {
            var tileMap = {};
            var resultTiles = [];
            for (var i = 0; i < tiles.length; ++i) {
                var tile = tiles[i];
                var key = this._calcKey(tile);
                // remove duplicate tiles
                if (tileMap[key]) {
                    continue;
                }
                // append tile to result
                tileMap[key] = tile;
                resultTiles.push(tile);
            }
            return resultTiles;
        },

        _sortTiles: function (tiles) {
            // sort by title (for primitive alphabetical ranking in result list)
            tiles.sort(function (a, b) {
                if (a.title.toUpperCase() < b.title.toUpperCase()) {
                    return -1;
                }
                if (a.title.toUpperCase() > b.title.toUpperCase()) {
                    return 1;
                }
                return 0;
            });
        }

    };

    return CatalogSearch;
});
