// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core',
    '../../core/util',
    '../../core/lang',
    '../../sina/SinaObject',
    './ajax',
    './ajaxTemplates',
    './conditionSerializer',
    './dataSourceSerializer',
    './FacetParser',
    './ItemParser',
    './NlqParser',
    './suggestionParser',
    './suggestionTermSplitter',
    './labelCalculation',
    './UserEventLogger',
    './MetadataParser'
], function (
    core,
    util,
    lang,
    SinaObject,
    ajax,
    ajaxTemplates,
    conditionSerializer,
    dataSourceSerializer,
    FacetParser,
    ItemParser,
    NlqParser,
    SuggestionParser,
    suggestionTermSplitter,
    labelCalculation,
    UserEventLogger,
    MetadataParser) {
    "use strict";

    return SinaObject.derive({

        id: 'abap_odata',

        _initAsync: function (configuration) {
            this.requestPrefix = '/sap/opu/odata/sap/ESH_SEARCH_SRV';
            this.sina = configuration.sina;
            this.ajaxClient = ajax.createAjaxClient();
            this.metadataLoadPromises = {};
            this.internalMetadata = {};
            this.labelCalculator = labelCalculation.createLabelCalculator();
            this.userEventLogger = new UserEventLogger(this);
            this.metadataParser = new MetadataParser(this);
            this.itemParser = new ItemParser(this);
            this.nlqParser = new NlqParser(this);
            this.facetParser = new FacetParser(this);
            this.suggestionParser = new SuggestionParser(this, this.itemParser);
            this.sessionId = core.generateGuid();
            this.sorsNavigationTargetGenerator = this.sina._createSorsNavigationTargetGenerator({
                urlPrefix: '#Action-search&/top=10&filter=',
                getPropertyMetadata: function (metadata) {
                    return {
                        name: metadata.id,
                        label: metadata.label,
                        semanticObjectType: metadata._private.semanticObjectType,
                        response: !!(metadata.usage && (metadata.usage.Detail || metadata.usage.Title)),
                        request: true
                    };
                }
            });

            return this.loadServerInfo().then(function (serverInfo) {
                this.serverInfo = serverInfo.d.results[0];
                if (!this.supports('Search')) {
                    return Promise.reject(new core.Exception('Enterprise Search is not active'));
                }
                return this.loadBusinessObjectDataSources();
            }.bind(this)).then(function () {
                return {
                    capabilities: this.sina._createCapabilities({
                        fuzzy: false
                    })
                };
            }.bind(this));
        },

        supports: function (service, capability) {
            for (var i = 0; i < this.serverInfo.Services.results.length; ++i) {
                var checkService = this.serverInfo.Services.results[i];
                if (checkService.Id == service) {
                    if (!capability) {
                        return true;
                    }
                    for (var j = 0; j < checkService.Capabilities.length; ++j) {
                        var checkCapability = checkService.Capabilities[j];
                        if (checkCapability.Capability === capability) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        loadServerInfo: function () {
            var requestUrlServerInfos = this.buildQueryUrl(this.requestPrefix, "/ServerInfos?$expand=Services/Capabilities");
            var requestUrlMetadata = this.buildQueryUrl(this.requestPrefix, "/$metadata");

            var serverInfosProm = this.ajaxClient.getJson(requestUrlServerInfos);
            var metadataProm = this.ajaxClient.getXML(requestUrlMetadata);

            return Promise.all([serverInfosProm, metadataProm]).then(function (values) {
                var response = values[0];
                var serviceXML = values[1];
                var oParser = new DOMParser();
                var oDOM = oParser.parseFromString(serviceXML, "text/xml");
                if (oDOM.documentElement.nodeName != "parsererror") {
                    this.serviceXML = oDOM;
                }
                return response.data;
            }.bind(this));
        },

        loadBusinessObjectDataSources: function () {
            // complete requestUrlTemplate is "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View' and IsInternal eq false";
            var requestUrlTemplate = "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View'";
            if (this.serviceXML) {
                var annotationsQueryString = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSource]>NavigationProperty[Name=Annotations]," +
                    "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSourceAttribute]>NavigationProperty[Name=Annotations]";
                var elements = this.serviceXML.querySelectorAll(annotationsQueryString);
                if (elements.length != 2) {
                    // Do not query for annotations in data sources request
                    requestUrlTemplate = "/DataSources?$expand=Attributes/UIAreas&$filter=Type eq 'View'";
                }

                var isInternalPath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSource]>Property[Name=IsInternal]";
                if (this.isQueryPropertySupported(isInternalPath)) {
                    // add isInternal filter in data sources request
                    requestUrlTemplate = requestUrlTemplate + " and IsInternal eq false";
                }
            }
            var requestUrl = this.buildQueryUrl(this.requestPrefix, requestUrlTemplate);
            return this.ajaxClient.getJson(requestUrl).then(function (response) {
                var dataSourcesData = response.data.d.results;
                this.metadataParser.parseDataSourceData(dataSourcesData, this.sorsNavigationTargetGenerator);
                this.sorsNavigationTargetGenerator.finishRegistration();
            }.bind(this));
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

        executeSearchQuery: function (query) {
            var items, response;
            var requestTemplate = ajaxTemplates.searchRequest;
            if (query.nlq) {
                requestTemplate = ajaxTemplates.nlqSearchRequest;
            }

            var clientServiceNamePath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchOptions]>Property[Name=ClientServiceName]";
            if (!this.isQueryPropertySupported(clientServiceNamePath)) {
                // remove ClientServiceName from data sources request
                delete requestTemplate.d.QueryOptions.ClientServiceName;
            }

            requestTemplate = JSON.parse(JSON.stringify(requestTemplate));

            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);

            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            } else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = [dataSourceSerializer.serialize(query.filter.dataSource)];
            requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.OrderBy = this.assembleOrderBy(query);
            this.addSessionId(requestTemplate);
            if (!query.calculateFacets) {
                delete requestTemplate.d.MaxFacetValues;
                delete requestTemplate.d.Facets;
            } else {
                requestTemplate.d.MaxFacetValues = 5;
                requestTemplate.d.Facets = [{
                    "Values": []
                }];
            }

            // build url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");
            // fire request
            return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (inputResponse) {
                response = inputResponse;
                return this.metadataParser.parseDynamicMetadata(response.data.d);
            }.bind(this)).then(function () {
                return this.itemParser.parse(query, response.data.d);
            }.bind(this)).then(function (inputItems) {
                items = inputItems;
                return this.facetParser.parse(query, response.data.d);
            }.bind(this)).then(function (facets) {
                var nlqResult = this.nlqParser.parse(response.data.d);
                var title = nlqResult.success ? nlqResult.description : 'Search Result List';
                return this.sina._createSearchResultSet({
                    id: response.data.d.ResultList.ExecutionID,
                    title: title,
                    query: query,
                    items: items,
                    nlqSuccess: nlqResult.success,
                    totalCount: response.data.d.ResultList.TotalHits,
                    facets: facets
                });
            }.bind(this)).then(function (searchResultSet) {
                this.sorsNavigationTargetGenerator.generateNavigationTargets(searchResultSet);
                return searchResultSet;
            }.bind(this));

        },

        executeChartQuery: function (query) {
            var requestUrl = "";
            var requestTemplate = {};
            var rootCondition = query.filter.rootCondition.clone();
            var filter;

            if (this.decideValueHelp(query)) {
                // value help chart query
                requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.valueHelperRequest));
                requestTemplate.d.ValueHelpAttribute = query.dimension;
                filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
                if (filter.SubFilters.length !== 0) {
                    requestTemplate.d.Filter = filter;
                } else {
                    delete requestTemplate.d.Filter;
                }
                requestTemplate.d.ValueFilter = this.getFilterValueFromConditionTree(query.dimension, filter);
                requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
                requestTemplate.d.DataSources = [dataSourceSerializer.serialize(query.filter.dataSource)];
                requestUrl = this.buildQueryUrl(this.requestPrefix, "/ValueHelpQueries");

            } else {
                // normal chart query
                requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.chartRequest));
                filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
                if (filter.SubFilters.length !== 0) {
                    requestTemplate.d.Filter = filter;
                } else {
                    delete requestTemplate.d.Filter;
                }
                requestTemplate.d.DataSources = [dataSourceSerializer.serialize(query.filter.dataSource)];
                requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
                requestTemplate.d.QueryOptions.Skip = 0;
                this.addSessionId(requestTemplate);
                requestTemplate.d.FacetRequests = [{
                    DataSourceAttribute: query.dimension
                }];
                requestTemplate.d.MaxFacetValues = query.top;
                requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");
            }

            return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (response) {
                    // DataSourceAttribute is facet attribute
                    return this.facetParser.parse(query, response.data.d);
                }.bind(this)
                // , function (error) {
                //     // DataSourceAttribute is advanced search relevant attribute, but NOT facet attribute
                //     return [];
                // }
            ).then(function (facets) {
                if (facets.length > 0) {
                    return facets[0];
                }
                return this.sina._createChartResultSet({
                    title: query.filter.dataSource.getAttributeMetadata(query.dimension).label,
                    items: [],
                    query: query
                });
            }.bind(this));
        },

        decideValueHelp: function (query) {
            var conditions = query.filter.rootCondition.conditions;
            for (var i = 0; i < conditions.length; i++) {
                if (query.filter._getAttribute(conditions[i]) === query.dimension) {
                    return true;
                }
            }
            return false;
        },

        executeSuggestionQuery: function (query) {
            // handle regular suggestions and object suggestion separately because
            // object suggestions have only searchterms and no suggestionInput
            return core.Promise.all([this.executeRegularSuggestionQuery(query), this.executeObjectSuggestionQuery(query)])
                .then(function (results) {
                    var suggestions = [];
                    suggestions.push.apply(suggestions, results[1]);
                    suggestions.push.apply(suggestions, results[0]);
                    return this.sina._createSuggestionResultSet({
                        title: 'Suggestions',
                        query: query,
                        items: suggestions
                    });
                }.bind(this));
        },

        isObjectSuggestionQuery: function (query) {
            return query.types.indexOf('Object') >= 0 && query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject;
        },

        executeObjectSuggestionQuery: function (query) {

            // check query type
            if (!this.supports('ObjectSuggestions') || !this.isObjectSuggestionQuery(query)) {
                return core.Promise.resolve([]);
            }

            // build request
            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.objectSuggestionRequest));
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            } else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = [dataSourceSerializer.serialize(query.filter.dataSource)];
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
            this.addSessionId(requestTemplate);

            // build request url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");

            // fire request
            return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (response) {
                return this.suggestionParser.parseObjectSuggestions(query, response.data);
            }.bind(this));

        },

        executeRegularSuggestionQuery: function (query) {

            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.suggestionRequest));

            // split search term in query into (1) searchTerm (2) suggestionTerm
            var searchTerm = query.filter.searchTerm;
            var splittedTerm = suggestionTermSplitter.split(this, searchTerm);

            // add search term to condition
            var rootCondition = query.filter.rootCondition.clone();

            // assemble request
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            } else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = [dataSourceSerializer.serialize(query.filter.dataSource)];
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.SuggestionInput = splittedTerm.suggestionTerm;
            requestTemplate.d.QueryOptions.SearchTerms = splittedTerm.searchTerm === null ? "" : splittedTerm.searchTerm;
            if (!this.includeSuggestionTypes(query, requestTemplate)) {
                // no regular suggestions requested -> return
                return [];
            }
            this.addSessionId(requestTemplate);

            // build request url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");

            // fire request
            return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (response) {
                return this.suggestionParser.parseRegularSuggestions(query, response.data);
            }.bind(this)).then(function (suggestions) {
                suggestionTermSplitter.concatenate(this, splittedTerm, suggestions);
                return suggestions;
            }.bind(this));
        },

        includeSuggestionTypes: function (query, suggestionRequest) {
            var sina2OdataConversion = {
                SearchTerm: {
                    Data: 'IncludeAttributeSuggestions',
                    History: 'IncludeHistorySuggestions'
                },
                Object: {},
                DataSource: {
                    Data: 'IncludeDataSourceSuggestions'
                }
            };
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            var success = false;
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2OdataConversion[suggestionType][calculationMode];
                    if (typeof value === 'undefined') {
                        continue;
                    }
                    suggestionRequest.d[value] = true;
                    success = true;
                }
            }
            return success;
        },

        addSessionId: function (request) {
            //            if (!this.sessionId) {
            //                this.sessionId = core.generateGuid();
            //            }
            request.d.QueryOptions.ClientSessionID = this.sessionId;
            var timeStamp = new Date().getTime();
            request.d.QueryOptions.ClientCallTimestamp = "\\/Date(" + timeStamp + ")\\/";
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

        getConfigurationAsync: function () {
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/PersonalizedSearchMainSwitches?$filter=Selected eq true");
            return this.ajaxClient.getJson(requestUrl).then(function (response) {
                var config = {
                    personalizedSearch: false,
                    personalizedSearchIsEditable: false
                };

                switch (response.data.d.results[0].MainSwitch) {
                case 3:
                    // Enabled after user‘s approval
                    config.isPersonalizedSearchEditable = true;
                    break;
                case 4:
                    // Enabled until user‘s rejection
                    config.isPersonalizedSearchEditable = true;
                    break;
                case 2:
                    // Enabled for all users
                    config.isPersonalizedSearchEditable = false;
                    break;
                case 1:
                    // Disabled for all users
                    config.isPersonalizedSearchEditable = false;
                    break;
                }

                requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
                return this.ajaxClient.getJson(requestUrl).then(function (response) {

                    if (response.data.d.IsEnabledForPersonalizedSearch) {
                        config.personalizedSearch = true;
                    }
                    return this.sina._createConfiguration(config);
                }.bind(this));
            }.bind(this));

        },

        saveConfigurationAsync: function (configuration) {
            var data = {
                "IsEnabledForPersonalizedSearch": configuration.personalizedSearch
            };

            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
            return this.ajaxClient.mergeJson(requestUrl, data);
        },

        resetPersonalizedSearchDataAsync: function () {
            var data = {
                "ClearPersonalizedSearchHistory": true
            };

            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
            return this.ajaxClient.mergeJson(requestUrl, data);
        },

        logUserEvent: function (event) {
            return this.userEventLogger.logUserEvent(event);
        },

        buildQueryUrl: function (queryPrefix, queryPostfix) {
            var windowUrl = window.location.href;
            var requestUrl = "";
            var systemStringBegin = "";
            var systemString = "";
            var systemInRequestUrl = "";

            // assign search backend system manuelly
            // url: esh-system=sid(PH6.002) -> query: ;o=sid(PH6.002)
            systemStringBegin = windowUrl.indexOf("esh-system=sid(");
            if (systemStringBegin !== -1) {
                var systemStringEnd = windowUrl.substring(systemStringBegin).indexOf(")");
                if (systemStringEnd !== -1) {
                    systemString = windowUrl.substring(systemStringBegin + 15, systemStringBegin + systemStringEnd);
                    if (systemString.length !== 0) {
                        systemInRequestUrl = ";o=sid(" + systemString + ")";
                    }
                }
            }

            // assign search backend system manuelly
            // url: esh-system=ALIASNAMEXYZCLNT002 -> query: ;o=sid(ALIASNAMEXYZCLNT002)
            if (systemString.length === 0) {
                systemStringBegin = windowUrl.indexOf("esh-system=");
                if (systemStringBegin !== -1) {
                    var systemStringEnd1 = windowUrl.substring(systemStringBegin).indexOf("&");
                    var systemStringEnd2 = windowUrl.substring(systemStringBegin).indexOf("#");

                    if (systemStringEnd1 !== -1 && systemStringEnd2 !== -1) {
                        if (systemStringEnd1 < systemStringEnd2) {
                            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
                        } else {
                            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
                        }
                    }

                    if (systemStringEnd1 !== -1 && systemStringEnd2 === -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
                    }

                    if (systemStringEnd1 === -1 && systemStringEnd2 !== -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
                    }

                    if (systemStringEnd1 === -1 && systemStringEnd2 === -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11);
                    }
                }
                if (systemString.length !== 0) {
                    systemInRequestUrl = ";o=" + systemString;
                }
            }

            requestUrl = queryPrefix + systemInRequestUrl + queryPostfix;
            return requestUrl;
        },

        getDebugInfo: function () {
            return 'Searchsystem: ' + this.serverInfo.SystemId + ' Client: ' + this.serverInfo.Client + ' SinaProvider :' + this.id;
        },

        isQueryPropertySupported: function (path) {
            if (this.serviceXML === undefined) {
                return false;
            }

            var elements = this.serviceXML.querySelectorAll(path);
            if (elements.length > 0) {
                return true;
            }
            return false;

        }

    });

});
