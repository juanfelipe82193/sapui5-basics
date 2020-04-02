// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine([
        '../core/core',
        '../core/util',
        './SearchQuery',
        './ChartQuery',
        './DataSourceQuery',
        './SuggestionQuery',
        './Filter',
        './DataSource',
        './ComplexCondition',
        './SimpleCondition',
        './AttributeMetadata',
        './AttributeGroupMetadata',
        './AttributeGroupMembership',
        './SearchResultSetItemAttribute',
        './SearchResultSetItemAttributeGroup',
        './SearchResultSetItemAttributeGroupMembership',
        './SearchResultSetItem',
        './SearchResultSet',
        './AttributeType',
        './AttributeFormatType',
        './AttributeSemanticsType',
        './AttributeGroupTextArrangement',
        './DataSourceType',
        './SuggestionType',
        './SuggestionCalculationMode',
        './FacetType',
        './MatchingStrategy',
        './LogicalOperator',
        './ComparisonOperator',
        './AttributeUsageType',
        './FacetResultSet',
        './FacetResultSetItem',
        './SearchTermSuggestion',
        './SearchTermAndDataSourceSuggestion',
        './DataSourceSuggestion',
        './ObjectSuggestion',
        './SuggestionResultSet',
        './ChartResultSet',
        './DataSourceResultSet',
        './ChartResultSetItem',
        './DataSourceResultSetItem',
        './EqualsMode',
        './SortOrder',
        './Capabilities',
        './ConditionType',
        './Configuration',
        '../providers/inav2/typeConverter',
        './NavigationTarget',
        '../providers/tools/fiori/FioriIntentsResolver',
        '../providers/tools/fiori/NavigationTargetForIntent',
        '../providers/tools/cds/CDSAnnotationsParser',
        '../providers/tools/ItemPostParser',
        '../providers/tools/fiori/SuvNavTargetResolver',
        '../providers/tools/sors/NavigationTargetGenerator',
        './formatters/ConfigSearchResultSetFormatter',
        './formatters/ConfigMetadataFormatter',
        './formatters/Formatter',
        './formatters/NavtargetsInResultSetFormatter',
        './formatters/RemovePureAdvancedSearchFacetsFormatter',
        './formatters/ResultValueFormatter'
    ],
    function (
        core,
        util,
        SearchQuery,
        ChartQuery,
        DataSourceQuery,
        SuggestionQuery,
        Filter,
        DataSource,
        ComplexCondition,
        SimpleCondition,
        AttributeMetadata,
        AttributeGroupMetadata,
        AttributeGroupMembership,
        SearchResultSetItemAttribute,
        SearchResultSetItemAttributeGroup,
        SearchResultSetItemAttributeGroupMembership,
        SearchResultSetItem,
        SearchResultSet,
        AttributeType,
        AttributeFormatType,
        AttributeSemanticsType,
        AttributeGroupTextArrangement,
        DataSourceType,
        SuggestionType,
        SuggestionCalculationMode,
        FacetType,
        MatchingStrategy,
        LogicalOperator,
        ComparisonOperator,
        AttributeUsageType,
        FacetResultSet,
        FacetResultSetItem,
        SearchTermSuggestion,
        SearchTermAndDataSourceSuggestion,
        DataSourceSuggestion,
        ObjectSuggestion,
        SuggestionResultSet,
        ChartResultSet,
        DataSourceResultSet,
        ChartResultSetItem,
        DataSourceResultSetItem,
        EqualsMode,
        SortOrder,
        Capabilities,
        ConditionType,
        Configuration,
        inav2TypeConverter,
        NavigationTarget,
        FioriIntentsResolver,
        NavigationTargetForIntent,
        CDSAnnotationsParser,
        ItemPostParser,
        SuvNavTargetResolver,
        SorsNavigationTargetGenerator,
        ConfigSearchResultSetFormatter,
        ConfigMetadataFormatter,
        Formatter,
        NavtargetsInResultSetFormatter,
        RemovePureAdvancedSearchFacetsFormatter,
        ResultValueFormatter
    ) {
        "use strict";

        return core.defineClass({

            AttributeType: AttributeType,
            AttributeFormatType: AttributeFormatType,
            AttributeSemanticsType: AttributeSemanticsType,
            AttributeGroupTextArrangement: AttributeGroupTextArrangement,
            DataSourceType: DataSourceType,
            AttributeUsageType: AttributeUsageType,
            MatchingStrategy: MatchingStrategy,
            LogicalOperator: LogicalOperator,
            ComparisonOperator: ComparisonOperator,
            FacetType: FacetType,
            SuggestionCalculationMode: SuggestionCalculationMode,
            SuggestionType: SuggestionType,
            EqualsMode: EqualsMode,
            SortOrder: SortOrder,
            ConditionType: ConditionType,

            SearchResultSet: SearchResultSet,
            SearchResultSetItem: SearchResultSetItem,
            SearchResultSetItemAttribute: SearchResultSetItemAttribute,
            ObjectSuggestion: ObjectSuggestion,

            _init: function (provider) {
                this.core = core; // convenience: expose core lib
                this.util = util; // convenience: expose util lib
                this.inav2TypeConverter = inav2TypeConverter; // do not use, only for inav2 compatability
                this.provider = provider;
                this.createSearchQuery = this.generateFactoryMethod(SearchQuery);
                this.createChartQuery = this.generateFactoryMethod(ChartQuery);
                this.createSuggestionQuery = this.generateFactoryMethod(SuggestionQuery);
                this.createDataSourceQuery = this.generateFactoryMethod(DataSourceQuery);
                this.createFilter = this.generateFactoryMethod(Filter);
                this.createComplexCondition = this.generateFactoryMethod(ComplexCondition);
                this.createSimpleCondition = this.generateFactoryMethod(SimpleCondition);
                // this._createDataSource = this.generateFactoryMethod(DataSource); implemented
                this._createAttributeMetadata = this.generateFactoryMethod(AttributeMetadata);
                this._createAttributeGroupMetadata = this.generateFactoryMethod(AttributeGroupMetadata);
                this._createAttributeGroupMembership = this.generateFactoryMethod(AttributeGroupMembership);
                this._createSearchResultSetItemAttribute = this.generateFactoryMethod(SearchResultSetItemAttribute);
                this._createSearchResultSetItemAttributeGroup = this.generateFactoryMethod(SearchResultSetItemAttributeGroup);
                this._createSearchResultSetItemAttributeGroupMembership = this.generateFactoryMethod(SearchResultSetItemAttributeGroupMembership);
                this._createSearchResultSetItem = this.generateFactoryMethod(SearchResultSetItem);
                this._createSearchResultSet = this.generateFactoryMethod(SearchResultSet);
                this._createSearchTermSuggestion = this.generateFactoryMethod(SearchTermSuggestion);
                this._createSearchTermAndDataSourceSuggestion = this.generateFactoryMethod(SearchTermAndDataSourceSuggestion);
                this._createDataSourceSuggestion = this.generateFactoryMethod(DataSourceSuggestion);
                this._createObjectSuggestion = this.generateFactoryMethod(ObjectSuggestion);
                this._createSuggestionResultSet = this.generateFactoryMethod(SuggestionResultSet);
                this._createChartResultSet = this.generateFactoryMethod(ChartResultSet);
                this._createDataSourceResultSet = this.generateFactoryMethod(DataSourceResultSet);
                this._createChartResultSetItem = this.generateFactoryMethod(ChartResultSetItem);
                this._createDataSourceResultSetItem = this.generateFactoryMethod(DataSourceResultSetItem);
                this._createCapabilities = this.generateFactoryMethod(Capabilities);
                this._createConfiguration = this.generateFactoryMethod(Configuration);
                this._createNavigationTarget = this.generateFactoryMethod(NavigationTarget);
                this._createSorsNavigationTargetGenerator = this.generateFactoryMethod(SorsNavigationTargetGenerator);
                this._createFioriIntentsResolver = this.generateFactoryMethod(FioriIntentsResolver);
                this._createNavigationTargetForIntent = this.generateFactoryMethod(NavigationTargetForIntent);
                this._createCDSAnnotationsParser = this.generateFactoryMethod(CDSAnnotationsParser);
                this._createItemPostParser = this.generateFactoryMethod(ItemPostParser);
                this._createSuvNavTargetResolver = this.generateFactoryMethod(SuvNavTargetResolver);
                this.searchResultSetFormatters = [];
                this.metadataFormatters = [];
                this.dataSources = [];
                this.dataSourceMap = {};
                this.allDataSource = this._createDataSource({
                    id: 'All',
                    label: 'All',
                    type: this.DataSourceType.Category
                });
                this.searchResultSetFormatters.push(new NavtargetsInResultSetFormatter());
                // this.searchResultSetFormatters.push(new RemovePureAdvancedSearchFacetsFormatter());
                this.searchResultSetFormatters.push(new ResultValueFormatter());

            },

            _initAsync: function (configuration) {
                configuration = configuration || {};
                this.isDummyProvider = configuration.provider.indexOf("dummy") > -1;
                this.provider.label = configuration.label;
                return core.Promise.resolve().then(function () {
                    return this._evaluateConfigurationAsync(configuration);
                }.bind(this)).then(function () {
                    configuration.sina = this; // provider needs sina
                    return this.provider._initAsync.apply(this.provider, [configuration]);
                }.bind(this)).then(function (initializationResult) {
                    initializationResult = initializationResult || {};
                    this.capabilities = initializationResult.capabilities || this._createCapabilities();
                    return this._formatMetadataAsync();
                }.bind(this)).then(function () {
                    if (this.getBusinessObjectDataSources().length === 0 && !this.isDummyProvider) {
                        return Promise.reject(new core.Exception('Not active - no datasources'));
                    }
                }.bind(this));
            },

            _formatMetadataAsync: function () {
                return core.executeSequentialAsync(this.metadataFormatters, function (formatter) {
                    return formatter.formatAsync({
                        dataSources: this.dataSources
                    });
                }.bind(this));
            },

            _evaluateConfigurationAsync: function (configuration) {
                var promises = [];
                if (configuration.searchResultSetFormatters) {
                    for (var i = 0; i < configuration.searchResultSetFormatters.length; ++i) {
                        var searchResultSetFormatter = configuration.searchResultSetFormatters[i];
                        if (!(searchResultSetFormatter instanceof Formatter)) {
                            searchResultSetFormatter = new ConfigSearchResultSetFormatter(searchResultSetFormatter);
                        }
                        this.searchResultSetFormatters.push(searchResultSetFormatter);
                        promises.push(searchResultSetFormatter.initAsync());
                    }
                }
                if (configuration.metadataFormatters) {
                    for (var j = 0; j < configuration.metadataFormatters.length; ++j) {
                        var metadataFormatter = configuration.metadataFormatters[j];
                        if (!(metadataFormatter instanceof Formatter)) {
                            metadataFormatter = new ConfigMetadataFormatter(metadataFormatter);
                        }
                        this.metadataFormatters.push(metadataFormatter);
                        promises.push(metadataFormatter.initAsync());
                    }
                }
                return core.Promise.all(promises);
            },

            loadMetadata: function (dataSource) {
                // do not use
                // only for compatability inav2
                if (this.provider.loadMetadata) {
                    return this.provider.loadMetadata(dataSource);
                }
                return core.Promise.resolve();
            },

            createDataSourceMap: function (dataSources) {
                var map = {};
                for (var i = 0; i < dataSources.length; ++i) {
                    var dataSource = dataSources[i];
                    map[dataSource.id] = dataSource;
                }
                return map;
            },

            generateFactoryMethod: function (Clazz) {
                return function (properties) {
                    properties = properties || {};
                    properties.sina = this;
                    return new Clazz(properties);
                };
            },

            _createDataSource: function (properties) {
                properties = properties || {};
                properties.sina = this;
                var dataSource = new DataSource(properties);
                if (this.dataSourceMap[dataSource.id] === dataSource) {
                    throw new core.Exception('cannot create an already existing datasource: "' + dataSource.id + '"');
                }
                this.dataSources.push(dataSource);
                this.dataSourceMap[dataSource.id] = dataSource;
                return dataSource;
            },

            getAllDataSource: function () {
                return this.allDataSource;
            },

            getBusinessObjectDataSources: function () {
                var result = [];
                for (var i = 0; i < this.dataSources.length; ++i) {
                    var dataSource = this.dataSources[i];
                    if (!dataSource.hidden && dataSource.type === this.DataSourceType.BusinessObject) {
                        result.push(dataSource);
                    }
                }
                return result;
            },

            getDataSource: function (id) {
                return this.dataSourceMap[id];
            },

            getConfigurationAsync: function (properties) {
                if (!this.provider.getConfigurationAsync) {
                    return core.Promise.resolve(this._createConfiguration({
                        personalizedSearch: false,
                        isPersonalizedSearchEditable: false
                    }));
                }
                properties = properties || {};
                if (this.configurationPromise && !properties.forceReload) {
                    return this.configurationPromise;
                }
                this.configurationPromise = this.provider.getConfigurationAsync();
                return this.configurationPromise;
            },

            logUserEvent: function (event) {
                if (!this.provider.logUserEvent) {
                    return;
                }
                this.provider.logUserEvent(event);
            },

            getDebugInfo: function () {
                var text = ['Sina Provider:' + this.provider.id];
                if (this.provider.getDebugInfo) {
                    var info = this.provider.getDebugInfo();
                    if (info) {
                        text.push(info);
                    }
                }
                return text.join('\n');
            },

            parseDataSourceFromJson: function (json) {
                var dataSource = this.getDataSource(json.id);
                if (dataSource) {
                    return dataSource;
                }
                if (json.type !== this.DataSourceType.Category) {
                    throw new core.Exception('Datasource in URL does not exist ' + json.id);
                }
                dataSource = this._createDataSource(json);
                return dataSource;
            },

            parseSimpleConditionFromJson: function (json) {
                var value;
                if (core.isObject(json.value)) {
                    value = util.dateFromJson(json.value);
                } else {
                    value = json.value;
                }
                // Following should satisfy no-unneeded-ternary eslint rule:
                var userDefined;
                if (json.userDefined) {
                    userDefined = true;
                } else {
                    userDefined = false;
                }
                return this.createSimpleCondition({
                    operator: json.operator,
                    attribute: json.attribute,
                    value: value,
                    attributeLabel: json.attributeLabel,
                    valueLabel: json.valueLabel,
                    userDefined: userDefined
                });
            },

            parseComplexConditionFromJson: function (json) {
                var conditions = [];
                for (var i = 0; i < json.conditions.length; ++i) {
                    var conditionJson = json.conditions[i];
                    conditions.push(this.parseConditionFromJson(conditionJson));
                }
                // Following should satisfy no-unneeded-ternary eslint rule:
                var userDefined;
                if (json.userDefined) {
                    userDefined = true;
                } else {
                    userDefined = false;
                }
                return this.createComplexCondition({
                    operator: json.operator,
                    conditions: conditions,
                    attributeLabel: json.attributeLabel,
                    valueLabel: json.valueLabel,
                    userDefined: userDefined
                });
            },

            parseConditionFromJson: function (json) {
                switch (json.type) {
                case 'Simple':
                    return this.parseSimpleConditionFromJson(json);
                case 'Complex':
                    return this.parseComplexConditionFromJson(json);
                default:
                    throw new core.Exception('unknown condition type "' + json.type + '"');
                }
            },

            parseFilterFromJson: function (json) {
                return this.createFilter({
                    searchTerm: json.searchTerm,
                    rootCondition: this.parseConditionFromJson(json.rootCondition),
                    dataSource: this.parseDataSourceFromJson(json.dataSource)
                });
            }

        });

    });
