// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global Promise, sinaDefine */
sinaDefine(['../../core/core',
    '../../core/util',
    '../../core/Log',
    '../../core/lang',
    '../../sina/SinaObject',
    './ajax',
    './conditionSerializer',
    './FacetParser',
    './ItemParser',
    './suggestionParser',
    './suggestionTermSplitter',
    // './LabelCalculator',
    // './UserEventLogger',
    './MetadataParser'
], function (
    core,
    util,
    Log,
    lang,
    SinaObject,
    ajax,
    conditionSerializer,
    FacetParser,
    ItemParser,
    SuggestionParser,
    suggestionTermSplitter,
    // LabelCalculator,
    // UserEventLogger,
    MetadataParser
) {
    "use strict";

    return SinaObject.derive({

        id: 'hana_odata',

        _initAsync: function (configuration) {
            // var prefixUrl = util.getBaseUrl(configuration.url);
            // if (prefixUrl[prefixUrl.length - 1] === '/') {
            //     this.requestPrefix = prefixUrl + 'es/odata/callbuildin.xsjs';
            // } else {
            //     this.requestPrefix = prefixUrl + '/es/odata/callbuildin.xsjs';
            // }
            if (configuration.url) {
                this.requestPrefix = configuration.url;
            } else {
                this.requestPrefix = '/sap/es/odata';
            }
            this.sina = configuration.sina;
            this.ajaxClient = ajax.createAjaxClient();
            this.metadataLoadPromises = {};
            this.internalMetadata = {};
            // this.labelCalculator = new LabelCalculator();
            // this.userEventLogger = new UserEventLogger(this);
            this.metadataParser = new MetadataParser(this);
            this.itemParser = new ItemParser(this);
            this.facetParser = new FacetParser(this);
            this.suggestionParser = new SuggestionParser(this);

            return this.loadServerInfo().then(function (serverInfo) {
                this.serverInfo = serverInfo;
                if (!this.supports('Search')) {
                    return Promise.reject(new core.Exception('Enterprise Search is not active'));
                }
                return this.loadBusinessObjectDataSources();
            }.bind(this)).then(function () {
                if (this.sina.dataSources.length === 0) {
                    return Promise.reject(new core.Exception('Enterprise Search is not active - no datasources'));
                }
                return {
                    capabilities: this.sina._createCapabilities({
                        fuzzy: false
                    })
                };
            }.bind(this));
        },

        supports: function (service, capability) {
            var supportedServices = this.serverInfo.services;
            for (var supportedService in supportedServices) {
                if (supportedService === service) {
                    if (!capability) {
                        return true;
                    }
                    var supportedCapabilities = supportedServices[supportedService].Capabilities;
                    for (var j = 0; j < supportedCapabilities.length; ++j) {
                        var checkCapability = supportedCapabilities[j];
                        if (checkCapability === capability) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        loadServerInfo: function () {
            var simulatedHanaServerinfo = {
                rawServerInfo: {
                    Services: [{
                            Service: 'Search',
                            Capabilities: [{
                                Capability: 'SemanticObjectType'
                            }]
                        },
                        {
                            Service: 'Suggestions2',
                            Capabilities: [{
                                Capability: 'ScopeTypes'
                            }]
                        }
                    ]
                },
                services: {
                    Suggestions: {
                        suggestionTypes: ['objectdata']
                    },
                    Search: {
                        capabilities: ['SemanticObjectType']
                    }
                }
            };
            return Promise.resolve(simulatedHanaServerinfo);
        },

        loadBusinessObjectDataSources: function () {
            var that = this;
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/$metadata");
            return this.ajaxClient.getXML(requestUrl).then(function (response) {
                that.metadataParser.parseResponse(response).then(function (allMetaDataMap) {
                    for (var i = 0; i < allMetaDataMap.dataSourcesList.length; ++i) {
                        var dataSource = allMetaDataMap.dataSourcesList[i];
                        that.metadataParser.fillMetadataBuffer(dataSource, allMetaDataMap.businessObjectMap[dataSource.id]);
                    }
                });
            });
        },

        assembleOrderBy: function (query) {
            var result = [];
            for (var i = 0; i < query.sortOrder.length; ++i) {
                var sortKey = query.sortOrder[i];
                var sortOrder = (sortKey.order === this.sina.SortOrder.Descending) ? 'desc' : 'asc';
                result.push({
                    AttributeId: sortKey.id,
                    SortOrder: sortOrder
                });
            }
            return result;
        },

        translateOrder: function (order) {
            var result = 'desc';
            if (order === 'Ascending') {
                result = 'asc';
            }
            return result;
        },

        executeSearchQuery: function (query) {
            // assemble json request
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            var searchTerms = this._escapeSearchTerm(query.filter.searchTerm);
            var dataSource = query.filter.dataSource;

            var top = query.top || 10;
            var skip = query.skip || 0;
            var facetLimit = query.facetTop || 5;
            var origSortOrders = query.sortOrder;
            var sortOrderExpression = '';

            //construct search part of $apply
            var searchExpression = "Search.search(query='";
            if (dataSource !== this.sina.getAllDataSource()) {
                searchExpression += "SCOPE:" + dataSource.id + " ";
            }

            var parentthesis4SearchTermsOpen = '';
            var parentthesis4SearchTermsClose = '';
            if (searchTerms) {
                // include search terms inside parentthesis except for blank search term
                parentthesis4SearchTermsOpen = '(';
                parentthesis4SearchTermsClose = ')';
            }

            searchExpression += filter + " " + parentthesis4SearchTermsOpen + searchTerms + parentthesis4SearchTermsClose + "')";

            var apply = 'filter(' + searchExpression + ')';

            var data = {
                $count: true,
                $top: top,
                $skip: skip,
                $apply: apply,
                whyfound: true
            };

            if (Array.isArray(origSortOrders)) {
                for (var j = 0; j < origSortOrders.length; j++) {
                    var origSortOrder = origSortOrders[j];
                    if (j === 0) {
                        sortOrderExpression += origSortOrder.id + ' ' + this.translateOrder(origSortOrder.order);
                    } else {
                        sortOrderExpression += ',' + origSortOrder.id + ' ' + this.translateOrder(origSortOrder.order);
                    }
                }
            }

            if (sortOrderExpression.length > 0) {
                data.$orderby = sortOrderExpression;
            }

            var url = this.buildQueryUrl(this.requestPrefix, '/$all');
            if (query.calculateFacets) {
                data.facets = 'all';
                data.facetlimit = facetLimit;
            }

            // fire request
            var items, response;
            var log = new Log();
            return this.ajaxClient.getJson(url, data).then(function (inputResponse) {
                response = inputResponse;
                return this.metadataParser.parseDynamicMetadata(response);
            }.bind(this)).then(function (inputResponse) {
                return this.itemParser.parse(query, response.data, log);
            }.bind(this)).then(function (inputItems) {
                items = inputItems;
                var statistics = response.data['@com.sap.vocabularies.Search.v1.SearchStatistics'].ConnectorStatistics;
                if (query.getDataSource() === this.sina.getAllDataSource() && statistics && Array.isArray(statistics) && statistics.length === 1) {
                    var constructedDataSourceFacet = [{
                        "@com.sap.vocabularies.Search.v1.Facet": {
                            "PropertyName": "scope",
                            "isConnectorFacet": true
                        },
                        "Items": [{
                            "scope": statistics[0].OdataID,
                            "_Count": response.data["@odata.count"]
                        }]
                    }];
                    return this.facetParser.parse(query, constructedDataSourceFacet);
                }
                return this.facetParser.parse(query, response.data, log);
            }.bind(this)).then(function (facets) {
                return this.sina._createSearchResultSet({
                    title: 'Search Result List',
                    query: query,
                    items: items,
                    totalCount: response.data['@odata.count'] || 0,
                    facets: facets,
                    log: log
                });
            }.bind(this));
        },

        executeChartQuery: function (query) {
            var searchTerms = this._escapeSearchTerm(query.filter.searchTerm);
            var dataSource = query.filter.dataSource;
            var rootCondition = query.filter.rootCondition.clone();
            var log = new Log();

            var facetTop = 15; // default value for numeric range/interval facets

            //In value help mode delete current condition from root and prepare to construct the value help part of query
            var resultDeletion = rootCondition.removeAttributeConditions(query.dimension);
            var isValueHelpMode = resultDeletion.deleted;

            var filter = conditionSerializer.serialize(dataSource, rootCondition);

            var top = query.top || 5;
            // var skip = query.skip || 0;

            var searchExpression = "Search.search(query='";
            if (dataSource !== this.sina.getAllDataSource()) {
                searchExpression += "SCOPE:" + dataSource.id + " ";
            }

            var parentthesis4SearchTermsOpen = '';
            var parentthesis4SearchTermsClose = '';
            if (searchTerms) {
                // include search terms inside parentthesis except for blank search term
                parentthesis4SearchTermsOpen = '(';
                parentthesis4SearchTermsClose = ')';
            }

            //construct search part of $apply
            if (isValueHelpMode === true) { //value help mode
                // Attribute value "*" can only be used without EQ part
                // this will be changed on serverside later
                if (!resultDeletion.value || resultDeletion.value === '' || resultDeletion.value.match(/^[*\s]+$/g) !== null) {
                    resultDeletion.value = '*';
                    searchExpression += '(' + resultDeletion.attribute + ':"*") ' + parentthesis4SearchTermsOpen + searchTerms;
                } else {
                    searchExpression += '(' + resultDeletion.attribute + ':EQ:"' + resultDeletion.value + '*") ' + parentthesis4SearchTermsOpen + searchTerms;
                }

            } else {
                searchExpression += filter + " " + parentthesis4SearchTermsOpen + searchTerms;
            }
            searchExpression += parentthesis4SearchTermsClose + "')";

            var apply = 'filter(' + searchExpression + ')';

            var data = {
                $count: true,
                $top: 0,
                // $skip: skip,
                $apply: apply
            };

            var url = this.buildQueryUrl(this.requestPrefix, '/$all');

            var facetScope = 'all';


            data.facetlimit = top;
            if (query.dimension) {
                facetScope = query.dimension;
                var metadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
                if ((metadata.type === 'Double' || metadata.type === 'Integer') && top >= 20) {
                    //facet limit decides number of intervals/ranges of numeric data types, but has no effect on date/time ranges
                    data.facetlimit = facetTop;
                }
            }

            //just require own chart facet in case that
            data.facets = facetScope;



            // fire request
            return this.ajaxClient.getJson(url, data).then(function (response) {
                // return this.facetParser.parse(query, response.data);
                var facets = this.facetParser.parse(query, response.data, log);
                return facets;
            }.bind(this)).then(function (facets) {
                if (facets.length > 0) {
                    return facets[0];
                }
                return this.sina._createChartResultSet({
                    title: query.filter.dataSource.getAttributeMetadata(query.dimension).label,
                    items: [],
                    query: query,
                    log: log
                });
            }.bind(this));

        },

        executeSuggestionQuery: function (query) {
            var sina2OdataConversion = {
                SearchTerm: {
                    Data: 'SuggestObjectData',
                    History: 'SuggestSearchHistory'
                },
                Object: {},
                DataSource: {
                    Data: 'SuggestDataSources'
                }
            };
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            var blankPromise = core.Promise.resolve({
                items: []
            });
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2OdataConversion[suggestionType][calculationMode];
                    switch (value) {
                    case "SuggestObjectData":
                        return this._fireSuggestionQuery(query);
                        // case "SuggestSearchHistory":
                        // case "SuggestDataSources":

                    default:
                        return blankPromise;
                    }
                }
            }
            // return this._fireSuggestionQuery(query);
        },

        _escapeSearchTerm: function (term) {
            if (term) {
                //left and right trim
                // term = term.replace(/\s+$/, "").replace(/^\s+/, "");
                // special chars 
                term = term.replace(/[\\]/g, '\\$&');
            }
            return term;
        },

        _fireSuggestionQuery: function (query) {
            /*
                type=scope for search connector names 
                currently only for technical names, shall be discussed
                Do we need count?
                $apply=filter part exactly as search query but move search terms to term parameter in getSuggestion
            */

            // split search term in query into (1) searchTerm (2) suggestionTerm
            var searchTerm = this._escapeSearchTerm(query.filter.searchTerm);
            var dataSource = query.filter.dataSource;
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);

            // assemble request
            var top = query.top || 10;
            var skip = query.skip || 0;

            //construct term part
            var suggestionExpression = "GetSuggestion(term='" + searchTerm + "')";

            var data = {
                $top: top,
                $skip: skip
            };

            //construct $apply part
            var apply = '';

            if (dataSource !== this.sina.getAllDataSource()) {
                apply += "SCOPE:" + dataSource.id;
            }

            if (filter) {
                apply += " " + filter;
            }

            if (apply) {
                apply = "filter(Search.search(query='" + apply + "'))";
                data.$apply = apply;
            }

            var url = this.buildQueryUrl(this.requestPrefix, '/$all/' + suggestionExpression);

            // fire request
            return this.ajaxClient.getJson(url, data).then(function (response) {
                var suggestions = [];
                if (response.data.value) {
                    suggestions = this.suggestionParser.parse(query, response.data.value);
                }
                return this.sina._createSuggestionResultSet({
                    title: 'Suggestions',
                    query: query,
                    items: suggestions
                });
            }.bind(this));
        },

        _fireSuggestionQueryV5: function (query) {
            // split search term in query into (1) searchTerm (2) suggestionTerm
            var searchTerm = this._escapeSearchTerm(query.filter.searchTerm);
            var splittedTerm = suggestionTermSplitter.split(this, searchTerm);
            var dataSource = query.filter.dataSource;
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);

            // assemble request
            // var top = query.top || 5;
            // var skip = query.skip || 0;

            //construct search part of $apply
            var searchExpression = "GetSuggestion(term='";
            if (dataSource !== this.sina.getAllDataSource()) {
                searchExpression += "SCOPE:" + dataSource.id + " ";
            }
            searchExpression += filter + " " + searchTerm + "')";

            var data = {
                // $top: top,
                // $skip: skip
            };

            var url = this.buildQueryUrl(this.requestPrefix, '/$all/' + searchExpression);

            // fire request
            return this.ajaxClient.getJson(url, data).then(function (response) {
                var suggestions = [];
                if (response.data.value) {
                    suggestions = this.suggestionParser.parse(query, response.data.value);
                }
                suggestionTermSplitter.concatenate(this, splittedTerm, suggestions);
                return this.sina._createSuggestionResultSet({
                    title: 'Suggestions',
                    query: query,
                    items: suggestions
                });
            }.bind(this));
        },

        getFilterValueFromConditionTree: function (dimension, conditionTree) {
            if (conditionTree.ConditionAttribute && conditionTree.ConditionAttribute === dimension) {
                return conditionTree.ConditionValue;
            } else if (conditionTree.SubFilters) {
                var i;
                var result = null;
                for (i = 0; result === null && i < conditionTree.SubFilters.length; i++) {
                    result = this.getFilterValueFromConditionTree(dimension, conditionTree.SubFilters[i]);
                }
                return result;
            }
            return null;
        },

        logUserEvent: function (event) {
            //return this.userEventLogger.logUserEvent(event);
        },

        buildQueryUrl: function (queryPrefix, queryPostfix) {
            var requestUrl = queryPrefix + '/v20411' + queryPostfix;
            return requestUrl;
        },

        getDebugInfo: function () {
            return ' SinaProvider :' + this.id;
        }

    });

});
