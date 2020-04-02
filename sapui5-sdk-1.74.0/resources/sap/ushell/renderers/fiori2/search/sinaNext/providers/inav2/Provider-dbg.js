// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core',
    '../../core/util',
    '../../core/lang',
    './ajax',
    './ajaxTemplates',
    './pivotTableParser',
    './conditionSerializer',
    './dataSourceSerializer',
    './FacetParser',
    './ItemParser',
    './suggestionParser',
    './suggestionTermSplitter',
    './labelCalculation',
    './UserEventLogger',
    './MetadataParser'
], function (
    core,
    util,
    lang,
    ajax,
    ajaxTemplates,
    pivotTableParser,
    conditionSerializer,
    dataSourceSerializer,
    FacetParser,
    ItemParser,
    suggestionParser,
    suggestionTermSplitter,
    labelCalculation,
    UserEventLogger,
    MetadataParser) {
    "use strict";

    return core.defineClass({

        id: 'inav2',

        _initAsync: function (configuration) {
            this.urlPrefix = '/sap/es/ina';
            this.getServerInfoUrl = this.urlPrefix + '/GetServerInfo';
            this.getResponseUrl = this.urlPrefix + '/GetResponse';
            this.sina = configuration.sina;
            this.ajaxClient = ajax.createAjaxClient();
            this.metadataLoadPromises = {};
            this.internalMetadata = {};
            this.labelCalculator = labelCalculation.createLabelCalculator();
            this.userEventLogger = new UserEventLogger(this);
            this.metadataParser = new MetadataParser(this);
            this.itemParser = new ItemParser(this);
            this.facetParser = new FacetParser(this);
            this.executeSearchQuery = this.addMetadataLoadDecorator(this.executeSearchQuery);
            this.executeChartQuery = this.addMetadataLoadDecorator(this.executeChartQuery);
            this.executeSuggestionQuery = this.addMetadataLoadDecorator(this.executeSuggestionQuery);
            this.sessionId = core.generateGuid();
            return this.loadServerInfo().then(function (serverInfo) {
                this.serverInfo = serverInfo;
                this.userEventLogger.delayedInit();
                if (!this.supports('Search')) {
                    return Promise.reject(new core.Exception('Enterprise Search is not active'));
                }
                return this.loadBusinessObjectDataSources();
            }.bind(this)).then(function () {
                return {
                    capabilities: this.sina._createCapabilities({
                        fuzzy: this.supports('Search', 'OptionFuzzy')
                    })
                };
            }.bind(this));
        },
        addMetadataLoadDecorator: function (executeQuery) {
            return function () {
                var args = arguments;
                var query = arguments[0];
                var dataSource = query.filter.dataSource;
                return Promise.resolve().then(function () {
                    // 1) load metadata
                    return this.loadMetadata(dataSource);
                }.bind(this)).then(function () {
                    // 2) execute query
                    return executeQuery.apply(this, args);
                }.bind(this));
            }.bind(this);
        },

        loadMetadata: function (dataSource) {

            // categories have no metadata
            if (dataSource.type === this.sina.DataSourceType.Category) {
                return core.Promise.resolve();
            }

            // check cache
            var loadPromise = this.metadataLoadPromises[dataSource.id];
            if (loadPromise) {
                return loadPromise;
            }

            // fire request
            ajaxTemplates.loadDataSourceMetadataRequest.DataSource.ObjectName = dataSource.id;
            this.addLanguagePreferences(ajaxTemplates.loadDataSourceMetadataRequest);
            loadPromise = this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.loadDataSourceMetadataRequest).then(function (response) {
                this.metadataParser.parseMetadataRequestMetadata(dataSource, response.data);
            }.bind(this));
            this.metadataLoadPromises[dataSource.id] = loadPromise;
            return loadPromise;
        },

        supports: function (service, capability) {
            for (var i = 0; i < this.serverInfo.Services.length; ++i) {
                var checkService = this.serverInfo.Services[i];
                if (checkService.Service == service) {
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
            return this.ajaxClient.getJson(this.getServerInfoUrl).then(function (response) {
                return response.data;
            });
        },

        loadBusinessObjectDataSources: function () {
            var that = this;
            that.addLanguagePreferences(ajaxTemplates.loadDataSourcesRequest);

            // description plural in capability -> add description plural property in request 
            if (that.supports('Search', 'PluralDescriptionForDataSource')) {
                ajaxTemplates.loadDataSourcesRequest.Search.NamedValues.push({
                    AttributeName: "DescriptionPlural",
                    Name: "DescriptionPlural"
                });
            }

            return that.ajaxClient.postJson(that.getResponseUrl, ajaxTemplates.loadDataSourcesRequest).then(function (response) {
                that._processDataSourcesResponse(response, false);
            }, function (error) {
                var connector = that.serverInfo.ServerInfo.SystemId + that.serverInfo.ServerInfo.Client + "~ESH_CONNECTOR~";
                ajaxTemplates.fallbackLoadDataSourcesRequest.DataSource.ObjectName = connector;
                return that.ajaxClient.postJson(that.getResponseUrl, ajaxTemplates.fallbackLoadDataSourcesRequest).then(function (response) {
                    that._processDataSourcesResponse(response, true);
                });
            });
        },

        _processDataSourcesResponse: function (response, isFallback) {
            var data = pivotTableParser.parse(response.data);
            var dataSourcesData = data.axes[0];
            for (var i = 0; i < dataSourcesData.length; ++i) {

                var dataSourceData = dataSourcesData[i];
                var label = '';
                var labelPlural = '';
                var id = '';

                if (!isFallback) {
                    if (core.isObject(dataSourceData.Description)) {
                        label = dataSourceData.Description.Value;
                    } else {
                        label = dataSourceData.Description;
                    }
                    if (core.isObject(dataSourceData.DescriptionPlural)) {
                        labelPlural = dataSourceData.DescriptionPlural.Value;
                    } else {
                        labelPlural = dataSourceData.DescriptionPlural;
                    }
                    if (core.isObject(dataSourceData.ObjectName)) {
                        id = dataSourceData.ObjectName.Value;
                    } else {
                        id = dataSourceData.ObjectName;
                    }
                } else {
                    // fallback
                    dataSourceData.$$ResultItemAttributes$$.forEach(function (elem) {
                        if (elem.Name === "DESCRIPTION") {
                            label = elem.Value;
                        }
                        if (elem.Name === "DESCRIPTION_PLURAL") {
                            labelPlural = elem.Value;
                        }
                        if (elem.Name === "OBJECT_NAME") {
                            id = elem.Value;
                        }
                    });
                }

                if (!label) {
                    label = id;
                }
                if (!labelPlural) {
                    labelPlural = label;
                }

                var dataSource = this.sina._createDataSource({
                    id: id,
                    label: label,
                    labelPlural: labelPlural,
                    type: this.sina.DataSourceType.BusinessObject,
                    attributesMetadata: [{
                        id: 'dummy'
                    }] // fill with dummy attribute
                });

                this.labelCalculator.calculateLabel(dataSource);
            }
        },

        getInternalMetadataAttributes: function (dataSource) {
            var attributesMetadata = [];
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                return attributesMetadata;
            }
            for (var attributeId in internalMetadata.data) {
                attributesMetadata.push(internalMetadata.data[attributeId]);
            }
            return attributesMetadata;
        },

        getInternalMetadataAttribute: function (dataSource, attributeId) {
            return this.internalMetadata[dataSource.id].data[attributeId];
        },

        getInternalMetadataLoadStatus: function (dataSource) {
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                return {};
            }
            return internalMetadata.loadStatus;
        },

        fillInternalMetadata: function (dataSource, loadStatusType, attributesMetadata) {
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                internalMetadata = {
                    loadStatus: {},
                    data: {}
                };
                this.internalMetadata[dataSource.id] = internalMetadata;
            }
            for (var i = 0; i < attributesMetadata.length; ++i) {
                var attributeMetadata = attributesMetadata[i];
                var bufferAttributeMetadata = internalMetadata.data[attributeMetadata.Name];
                if (!bufferAttributeMetadata) {
                    bufferAttributeMetadata = {};
                    internalMetadata.data[attributeMetadata.Name] = bufferAttributeMetadata;
                }
                for (var name in attributeMetadata) {
                    bufferAttributeMetadata[name] = attributeMetadata[name];
                }
            }
            internalMetadata.loadStatus[loadStatusType] = true;
        },

        addTemplateConditions: function (rootCondition) {
            rootCondition.addCondition({
                attribute: '$$RenderingTemplatePlatform$$',
                operator: this.sina.ComparisonOperator.Eq,
                value: 'html'
            });
            rootCondition.addCondition({
                attribute: '$$RenderingTemplateTechnology$$',
                operator: this.sina.ComparisonOperator.Eq,
                value: 'Tempo'
            });
            rootCondition.addCondition({
                attribute: '$$RenderingTemplateType$$',
                operator: this.sina.ComparisonOperator.Eq,
                value: 'ResultItem'
            });
            rootCondition.addCondition({
                attribute: '$$RenderingTemplateType$$',
                operator: this.sina.ComparisonOperator.Eq,
                value: 'ItemDetails'
            });
        },

        assembleOrderBy: function (query) {
            var result = [];
            for (var i = 0; i < query.sortOrder.length; ++i) {
                var sortKey = query.sortOrder[i];
                var sortOrder = (sortKey.order === this.sina.SortOrder.Descending) ? 'DESC' : 'ASC';
                result.push({
                    AttributeName: sortKey.id,
                    SortOrder: sortOrder
                });
            }
            return result;
        },

        executeSearchQuery: function (query) {
            var parsedItems, response;

            // assemble json request
            var rootCondition = query.filter.rootCondition.clone();
            this.addTemplateConditions(rootCondition);
            ajaxTemplates.searchRequest.Search.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            ajaxTemplates.searchRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
            ajaxTemplates.searchRequest.Search.SearchTerms = query.filter.searchTerm;
            ajaxTemplates.searchRequest.Search.Top = query.top;
            ajaxTemplates.searchRequest.Search.Skip = query.skip;
            ajaxTemplates.searchRequest.Options = this.assembleRequestOptions(query);
            ajaxTemplates.searchRequest.Search.OrderBy = this.assembleOrderBy(query);
            ajaxTemplates.searchRequest.Search.Expand = ['Grid', 'Items', 'TotalCount'];
            this.addLanguagePreferences(ajaxTemplates.searchRequest);
            this.addSessionId(ajaxTemplates.searchRequest);
            if (query.calculateFacets) {
                ajaxTemplates.searchRequest.Search.Expand.push('ResultsetFacets');
            }

            // fire request
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.searchRequest).then(function (InputResponse) {
                response = InputResponse;
                return this.itemParser.parse(query, response.data);
            }.bind(this)).then(function (InputParsedItems) {
                parsedItems = InputParsedItems;
                return this.facetParser.parse(query, response.data);
            }.bind(this)).then(function (parsedFacets) {
                return this.sina._createSearchResultSet({
                    id: response.data.ExecutionID,
                    title: 'Search Result List',
                    query: query,
                    items: parsedItems.items,
                    totalCount: parsedItems.totalCount,
                    facets: parsedFacets
                });
            }.bind(this));
        },

        executeChartQuery: function (query) {

            // assemble json request
            var rootCondition = query.filter.rootCondition.clone();
            this.addTemplateConditions(rootCondition);
            ajaxTemplates.chartRequest.Search.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            ajaxTemplates.chartRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
            ajaxTemplates.chartRequest.Search.SearchTerms = query.filter.searchTerm;
            ajaxTemplates.chartRequest.Search.Top = 1;
            ajaxTemplates.chartRequest.Search.Skip = 0;
            ajaxTemplates.chartRequest.Facets.Attributes = [query.dimension];
            ajaxTemplates.chartRequest.Facets.MaxNumberOfReturnValues = query.top;
            ajaxTemplates.chartRequest.Options = this.assembleRequestOptions(query);
            this.addLanguagePreferences(ajaxTemplates.chartRequest);
            this.addSessionId(ajaxTemplates.chartRequest);

            // fire request
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.chartRequest).then(function (response) {
                return this.facetParser.parse(query, response.data);
            }.bind(this)).then(function (facets) {
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

        executeSuggestionQuery: function (query) {

            // split search term in query into (1) searchTerm (2) suggestionTerm
            var searchTerm = query.filter.searchTerm;
            var splittedTerm = suggestionTermSplitter.split(this, searchTerm);

            // add search term to condition
            var rootCondition = query.filter.rootCondition.clone();
            if (splittedTerm.searchTerm) {
                rootCondition.addCondition(query.sina.createSimpleCondition({
                    attribute: '$$SearchTerms$$',
                    value: splittedTerm.searchTerm
                }));
            }

            // add suggestion term to condition
            rootCondition.addCondition(query.sina.createSimpleCondition({
                attribute: '$$SuggestionTerms$$',
                value: splittedTerm.suggestionTerm
            }));

            // assemble request
            ajaxTemplates.suggestionRequest.Suggestions2.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            ajaxTemplates.suggestionRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
            ajaxTemplates.suggestionRequest.Options = this.assembleSuggestionOptions(query);
            if (ajaxTemplates.suggestionRequest.Options.length === 0) {
                return this.sina._createSuggestionResultSet({
                    title: 'Suggestions',
                    query: query,
                    items: []
                });
            }
            ajaxTemplates.suggestionRequest.Suggestions2.Top = query.top;
            ajaxTemplates.suggestionRequest.Suggestions2.Skip = query.skip;
            this.addLanguagePreferences(ajaxTemplates.suggestionRequest);
            this.addSessionId(ajaxTemplates.suggestionRequest);

            // fire request
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.suggestionRequest).then(function (response) {
                var suggestions = suggestionParser.parse(this, query, response.data);
                suggestionTermSplitter.concatenate(this, splittedTerm, suggestions);
                return this.sina._createSuggestionResultSet({
                    title: 'Suggestions',
                    query: query,
                    items: suggestions
                });
            }.bind(this));

        },

        addSessionId: function (request) {
            if (!this.supports('Search', 'SessionHandling')) {
                delete request.SessionID;
                delete request.SessionTimestamp;
                return;
            }
            request.SessionID = this.sessionId;
            request.SessionTimestamp = parseInt(util.generateTimestamp(), 10);
        },

        addLanguagePreferences: function (request) {
            if (!this.supports('Search', 'LanguagePreferences')) {
                delete request.LanguagePreferences;
                return;
            }
            request.LanguagePreferences = lang.getLanguagePreferences();
        },

        assembleSuggestionOptions: function (query) {
            // conversion table
            var sina2InaConversion = {
                SearchTerm: {
                    Data: 'SuggestObjectData',
                    History: 'SuggestSearchHistory'
                },
                Object: {},
                DataSource: {
                    Data: 'SuggestDataSources'
                }
            };
            // based on capabilities -> remove from conversion table
            if (!this.supports('Suggestions2', 'ScopeTypes')) {
                delete sina2InaConversion.SearchTerm.History;
                delete sina2InaConversion.DataSource.Data;
            }
            // apply conversion table
            var options = [];
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2InaConversion[suggestionType][calculationMode];
                    if (!value) {
                        continue;
                    }
                    options.push(value);
                }
            }
            return options; //['SuggestObjectData'];
        },

        assembleRequestOptions: function (query) {
            var Options = ['SynchronousRun'];

            if (this.decideValueHelp(query)) {
                Options.push('ValueHelpMode');
            }
            return Options;
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

        getConfigurationAsync: function () {

            if (!this.supports('PersonalizedSearch', 'SetUserStatus')) {
                return core.Promise.resolve(this.sina._createConfiguration({
                    personalizedSearch: false,
                    personalizedSearchIsEditable: false
                }));
            }

            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.getConfigurationRequest).then(function (response) {
                var config = {
                    personalizedSearch: false,
                    personalizedSearchIsEditable: false
                };
                config.personalizedSearch = response.data.Data.PersonalizedSearch.SessionUserActive;
                switch (response.data.Data.PersonalizedSearch.PersonalizationPolicy) {
                case 'Opt-In':
                    config.isPersonalizedSearchEditable = true;
                    break;
                case 'Opt-Out':
                    config.isPersonalizedSearchEditable = true;
                    break;
                case 'Enforced':
                    config.isPersonalizedSearchEditable = false;
                    break;
                case 'Disabled':
                    config.isPersonalizedSearchEditable = false;
                    break;
                }
                return this.sina._createConfiguration(config);
            }.bind(this));

        },

        saveConfigurationAsync: function (configuration) {
            if (!this.supports('PersonalizedSearch', 'SetUserStatus')) {
                return core.Promise.resolve();
            }
            ajaxTemplates.saveConfigurationRequest.SearchConfiguration.Data.PersonalizedSearch.SessionUserActive = configuration.personalizedSearch;
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.saveConfigurationRequest);
        },

        resetPersonalizedSearchDataAsync: function () {
            if (!this.supports('PersonalizedSearch', 'ResetUserData')) {
                return core.Promise.resolve();
            }
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.resetPersonalizedSearchDataRequest);
        },

        logUserEvent: function (event) {
            return this.userEventLogger.logUserEvent(event);
        },

        getDebugInfo: function () {
            return 'Searchsystem: ' + this.serverInfo.ServerInfo.SystemId + ' Client: ' + this.serverInfo.ServerInfo.Client;
        }

    });

});
