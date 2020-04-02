// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core',
    '../../sina/sinaFactory',
    './ProviderHelper',
    './FederationMethod',
    './FederationType',
    './FacetMode'
], function (
    core,
    sinaFactory,
    ProviderHelper,
    FederationMethod,
    FederationType,
    FacetMode) {
    "use strict";

    return core.defineClass({

        id: 'multi',

        _initAsync: function (properties) {

            this.sina = properties.sina;
            this.facetMode = FacetMode[properties.facetMode] || FacetMode.flat;
            this.federationType = FederationType[properties.federationType] || FederationType.advanced_round_robin;
            this.multiSina = [];
            this.multiDataSourceMap = {}; //key: multiId, value: originalDataSource
            this.sina.dataSourceMap[this.sina.allDataSource.id] = this.sina.allDataSource;
            this.providerHelper = new ProviderHelper(this);
            this.federationMethod = FederationMethod;

            var doCreate = function (index) {

                if (index >= properties.subProviders.length) {
                    if (this.multiSina.length < 1) {
                        return core.Promise.reject(new core.Exception('sina creation by trial failed'));
                    }
                    return undefined;

                }

                var configuration = properties.subProviders[index];
                return sinaFactory.createAsync(configuration).then(function (childSina) {

                    this.providerHelper.updateProviderId(childSina);

                    for (var i = 0; i < childSina.dataSources.length; i++) {
                        var childDataSource = childSina.dataSources[i];
                        var multiId = this.providerHelper.calculateMultiDataSourceId(childDataSource.id, childSina.provider.id);
                        this.providerHelper.createMultiDataSource(multiId, childDataSource);
                        this.multiDataSourceMap[multiId] = childDataSource;
                    }

                    this.multiSina.push(childSina);
                    return doCreate(index + 1);

                }.bind(this), function () {
                    return doCreate(index + 1);
                });
            }.bind(this);
            return doCreate(0);

        },

        executeSearchQuery: function (query) {
            var that = this;
            var childQuery;

            that.searchResultSet = that.sina._createSearchResultSet({
                title: 'Search Multi Result List',
                query: query,
                items: [],
                totalCount: 0,
                facets: []
            });
            that.searchResultSetItemList = [];

            if (query.filter.dataSource === that.sina.allDataSource) {

                that.searchResultSet.facets.push(that.sina._createDataSourceResultSet({
                    title: query.filter.dataSource.label,
                    items: [],
                    query: query
                }));

                var querys = [];
                for (var i = 0; i < that.multiSina.length; i++) {
                    childQuery = that.multiSina[i].createSearchQuery({
                        calculateFacets: query.calculateFacets,
                        multiSelectFacets: query.multiSelectFacets,
                        dataSource: that.multiSina[i].allDataSource,
                        searchTerm: query.getSearchTerm(),
                        top: query.top,
                        skip: query.skip,
                        sortOrder: query.sortOrder
                    });
                    querys.push(childQuery.getResultSetAsync());
                }
                return core.Promise.all(querys).then(function (result) {
                    for (var j = 0; j < result.length; j++) {
                        var searchResultSet = result[j];
                        for (var k = 0; k < searchResultSet.items.length; k++) {
                            var resultItem = searchResultSet.items[k];
                            var multiId = that.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
                            // var dataSource = that.providerHelper.createMultiDataSource(multiId, resultItem.dataSource);
                            var dataSource = that.sina.dataSourceMap[multiId];
                            resultItem.dataSource = dataSource;
                            resultItem.sina = that.sina;
                        }
                        that.searchResultSet.totalCount += searchResultSet.totalCount;
                        that.searchResultSetItemList.push(searchResultSet.items);

                        if (searchResultSet.facets[0]) {
                            if (that.facetMode === FacetMode.tree) {
                                var childDataSource = that.sina.getDataSource(that.providerHelper.calculateMultiDataSourceId(searchResultSet.query.filter.dataSource.id, searchResultSet.sina.provider.id));
                                that.searchResultSet.facets[0].items.push(that.sina._createDataSourceResultSetItem({
                                    dataSource: childDataSource,
                                    dimensionValueFormatted: that.providerHelper.calculateMultiDataSourceLabel(searchResultSet.query.filter.dataSource.label, searchResultSet.sina.provider),
                                    measureValue: searchResultSet.totalCount,
                                    measureValueFormatted: searchResultSet.totalCount
                                }));
                            } else {
                                var dataSourceFacets = that.providerHelper.updateDataSourceFacets(searchResultSet.facets);
                                dataSourceFacets[0].items.forEach(function (facetItem) {
                                    that.searchResultSet.facets[0].items.push(facetItem);
                                });
                            }
                        }
                    }
                    that.searchResultSet.items = that.federationMethod[that.federationType].sort(that.searchResultSetItemList);
                    that.searchResultSet.items = that.searchResultSet.items.slice(query.skip, query.top);

                    return that.searchResultSet;
                });

            }

            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            childQuery = childDataSource.sina.createSearchQuery({
                calculateFacets: query.calculateFacets,
                multiSelectFacets: query.multiSelectFacets,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                rootCondition: query.getRootCondition(),
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder
            });
            return childQuery.getResultSetAsync().then(function (searchResultSet) {
                that.searchResultSet.items = searchResultSet.items;
                that.searchResultSet.totalCount = searchResultSet.totalCount;
                //                    that.searchResultSet.facets = searchResultSet.facets;

                for (var i = 0; i < that.searchResultSet.items.length; i++) {
                    var resultItem = that.searchResultSet.items[i];
                    var resultItemMultiId = that.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
                    //update attributes metadata
                    that.providerHelper.updateAttributesMetadata(resultItem.dataSource, that.sina.dataSourceMap[resultItemMultiId]);
                    //set the facet result item dataSource as multi provider dataSource
                    resultItem.dataSource = that.sina.dataSourceMap[resultItemMultiId];
                    resultItem.sina = that.sina;
                }

                var multiFacets;
                //dataSource facet
                if (searchResultSet.facets.length === 1 && searchResultSet.facets[0].items[0].dataSource) {
                    multiFacets = searchResultSet.facets;
                    multiFacets[0].title = that.providerHelper.calculateMultiDataSourceLabel(searchResultSet.facets[0].title, searchResultSet.facets[0].sina.provider);
                    that.providerHelper.updateDataSourceFacets(multiFacets);
                } else { //chart facet
                    multiFacets = [];
                    for (var k = 0; k < searchResultSet.facets.length; k++) {
                        var chartResultSet = searchResultSet.facets[k];
                        multiFacets.push(that.providerHelper.createMultiChartResultSet(chartResultSet));
                    }
                }
                that.searchResultSet.facets = multiFacets;

                return that.searchResultSet;
            });

        },

        executeChartQuery: function (query) {
            var that = this;
            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            // check (todo): double chart request,
            var childQuery = childDataSource.sina.createChartQuery({
                dimension: query.dimension,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                rootCondition: query.getRootCondition(),
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder
            });
            return childQuery.getResultSetAsync().then(function (chartResultSet) {
                return that.providerHelper.createMultiChartResultSet(chartResultSet);
            });
        },

        executeSuggestionQuery: function (query) {
            var that = this;
            var childQuery;

            if (query.filter.dataSource === that.sina.allDataSource) {

                var querys = [];
                for (var i = 0; i < that.multiSina.length; i++) {
                    childQuery = that.multiSina[i].createSuggestionQuery({
                        types: query.types,
                        calculationModes: query.calculationModes,
                        dataSource: that.multiSina[i].allDataSource,
                        searchTerm: query.getSearchTerm(),
                        top: query.top,
                        skip: query.skip,
                        sortOrder: query.sortOrder
                    });
                    querys.push(childQuery.getResultSetAsync());
                }

                return core.Promise.all(querys).then(function (result) {
                    var mergedSuggestionResultSet = that.sina._createSuggestionResultSet({
                        title: 'Multi Suggestions',
                        query: query,
                        items: []
                    });
                    for (var j = 0; j < result.length; j++) {
                        var suggestionResultSet = that.providerHelper.updateSuggestionDataSource(result[j]);
                        mergedSuggestionResultSet.items = that.federationMethod.roundRobin.mergeMultiResults(mergedSuggestionResultSet.items, suggestionResultSet.items, j + 1);
                    }
                    return mergedSuggestionResultSet;
                });

            }

            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            childQuery = childDataSource.sina.createSuggestionQuery({
                types: query.types,
                calculationModes: query.calculationModes,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder
            });

            return childQuery.getResultSetAsync().then(function (results) {
                return that.providerHelper.updateSuggestionDataSource(results);
            });

        }
    });

});
