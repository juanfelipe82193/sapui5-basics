// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './Query'], function (core, Query) {
    "use strict";

    return Query.derive({

        _meta: {
            properties: {
                calculateFacets: {
                    required: false,
                    default: false,
                    setter: true
                },
                multiSelectFacets: {
                    required: false,
                    default: false,
                    setter: true
                },
                nlq: {
                    required: false,
                    default: false,
                    setter: true
                },
                facetTop: {
                    required: false,
                    default: 5,
                    setter: true
                }
            }
        },

        _initClone: function (other) {
            this.calculateFacets = other.calculateFacets;
            this.multiSelectFacets = other.multiSelectFacets;
            this.nlq = other.nlq;
            this.facetTop = other.facetTop;
        },

        _equals: function (other, mode) {
            // check nlq
            if (this.nlq !== other.nlq) {
                return false;
            }
            // check multiSelectFacets
            if (this.multiSelectFacets !== other.multiSelectFacets) {
                return false;
            }
            // check facetTop
            if (this.facetTop !== other.facetTop) {
                return false;
            }
            // special check for calculate Facets
            switch (mode) {
            case this.sina.EqualsMode.CheckFireQuery:
                if (other.calculateFacets && !this.calculateFacets) {
                    // if old query (other) was with facets and new is without
                    // -> we do not need to fire new query -> return true
                    return true;
                }
                return this.calculateFacets === other.calculateFacets;
            default:
                return this.calculateFacets === other.calculateFacets;
            }
        },

        _execute: function (query) {

            var filterAttributes;
            var chartQueries = [];

            // multi select facets: assemble chart queries for all facets with set filters
            // (The main search request typically does not inlcude facets if a filter is set for a facet,
            //  because the facet then is trivial. For multi select we need to display also facets with set
            // filters therefore a special chart query is assembled)
            if (this.multiSelectFacets) {
                // collect attribute for which filters are set
                filterAttributes = this._collectAttributesWithFilter(query);
                // create chart queries for filterAttribute
                chartQueries = this._createChartQueries(query, filterAttributes);
            }

            // fire all requests
            var requests = [];
            requests.push(this.sina.provider.executeSearchQuery(query));
            for (var i = 0; i < chartQueries.length; ++i) {
                var chartQuery = chartQueries[i];
                var dataSourceMetadata = query.filter.dataSource.getAttributeMetadata(chartQuery.dimension);
                if (dataSourceMetadata.usage.Facet) {
                    requests.push(chartQuery.getResultSetAsync());
                }
            }

            // wait for all resultsets
            return Promise.all(requests).then(function (results) {
                var searchResult = results[0];
                var chartResultSets = results.slice(1);
                this._mergeFacetsToSearchResultSet(searchResult, chartResultSets);
                return searchResult;
            }.bind(this));

        },

        _formatResultSetAsync: function (resultSet) {
            return core.executeSequentialAsync(this.sina.searchResultSetFormatters, function (formatter) {
                return formatter.formatAsync(resultSet);
            });
        },

        _collectAttributesWithFilter: function (query) {
            var attributeMap = {};
            this._doCollectAttributes(attributeMap, query.filter.rootCondition);
            return Object.keys(attributeMap);
        },

        _doCollectAttributes: function (attributeMap, condition) {
            switch (condition.type) {
            case this.sina.ConditionType.Simple:
                attributeMap[condition.attribute] = true;
                break;
            case this.sina.ConditionType.Complex:
                for (var i = 0; i < condition.conditions.length; ++i) {
                    var subCondition = condition.conditions[i];
                    this._doCollectAttributes(attributeMap, subCondition);
                }
                break;
            }
        },

        _createChartQuery: function (query, filterAttribute) {
            var chartQuery = this.sina.createChartQuery({
                dimension: filterAttribute,
                top: this.facetTop
            });
            chartQuery.setFilter(query.filter.clone());
            chartQuery.filter.rootCondition.removeAttributeConditions(filterAttribute);
            return chartQuery;
        },

        _createChartQueries: function (query, filterAttributes) {
            var chartQueries = [];
            for (var i = 0; i < filterAttributes.length; ++i) {
                var filterAttribute = filterAttributes[i];
                var chartQuery = this._createChartQuery(query, filterAttribute);
                chartQueries.push(chartQuery);
            }
            return chartQueries;
        },

        _mergeFacetsToSearchResultSet: function (searchResultSet, chartResultSets) {
            //////////////////////////////////////////////////////////////////////////////////
            // selected filters
            // main request
            // chart request
            // total count

            // 1. selected filters -> facets (no count info)
            // 2. facets (no count info) + total count -> facets (facets with one facet item, count info)
            // 3. facets (facets with one facet item, count info) + main request (count info) -> facets (partial count info)
            // 4. facets (partial count info) + chart request -> facets
            //////////////////////////////////////////////////////////////////////////////////

            this._addSelectedFiltersToSearchResultSet(searchResultSet);
            for (var i = 0; i < chartResultSets.length; ++i) {
                var chartResultSet = chartResultSets[i];
                this._addChartResultSetToSearchResultSet(searchResultSet, chartResultSet);
            }
        },

        _calculateFacetTitle: function (condition, dataSource) {
            // if (condition.attributeLabel) {
            //     return condition.attributeLabel;
            // }
            var attribute = condition._getAttribute();
            var attributeMetadata = dataSource.getAttributeMetadata(attribute);
            return attributeMetadata.label;
        },

        _addSelectedFiltersToSearchResultSet: function (searchResultSet) {
            for (var j = 0; j < searchResultSet.query.filter.rootCondition.conditions.length; j++) {
                var conditions = searchResultSet.query.filter.rootCondition.conditions[j].conditions;
                var conditionAttributeLabel = this._calculateFacetTitle(conditions[0], searchResultSet.query.filter.dataSource);
                var conditionAttribute;
                switch (conditions[0].type) {
                case this.sina.ConditionType.Simple:
                    conditionAttribute = conditions[0].attribute;
                    break;
                case this.sina.ConditionType.Complex:
                    conditionAttribute = conditions[0].conditions[0].attribute;
                    break;
                }
                var matchFacetIndex = this._findMatchFacet(conditionAttribute, searchResultSet.facets);
                var matchFacet = searchResultSet.facets[matchFacetIndex];
                if (!matchFacet) {
                    var chartquery = this._createChartQuery(searchResultSet.query, conditionAttribute);
                    matchFacet = this.sina._createChartResultSet({
                        title: conditionAttributeLabel,
                        items: [],
                        query: chartquery
                    });
                    searchResultSet.facets.splice(matchFacetIndex, 1, matchFacet);
                }
                var countValue = null;
                if (conditions.length === 1) {
                    countValue = searchResultSet.totalCount;
                }
                var selectedFacetItemList = [];
                for (var k = 0; k < conditions.length; k++) {
                    var matchFacetItemIndex;
                    // check in searchResultSet facets
                    if (this._findFilterConditionInFacetItemList(conditions[k], matchFacet.items) >= 0) {
                        matchFacetItemIndex = this._findFilterConditionInFacetItemList(conditions[k], matchFacet.items);
                        selectedFacetItemList.push(matchFacet.items[matchFacetItemIndex]);
                    } else {
                        selectedFacetItemList.push(this.sina._createChartResultSetItem({
                            filterCondition: conditions[k],
                            dimensionValueFormatted: conditions[k].valueLabel || conditions[k].value,
                            measureValue: countValue,
                            measureValueFormatted: conditions[k].valueLabel || conditions[k].value
                        }));
                    }
                }
                matchFacet.items = selectedFacetItemList;
            }
        },

        _addChartResultSetToSearchResultSet: function (searchResultSet, chartResultSet) {

            if (chartResultSet.items.length === 0) {
                return;
            }

            // check for matching facet in searchResultSet
            var dimension = chartResultSet.query.dimension;
            var matchFacetIndex = this._findMatchFacet(dimension, searchResultSet.facets);
            var matchFacet = searchResultSet.facets[matchFacetIndex];

            // selected facet items for this dimension
            var selectedFacetItemList = matchFacet.items;

            // merge selected facet items to chartResultSet
            var facetItemSelectionOutsideRange = false;
            var appendFacetItemList = [];
            for (var m = 0; m < selectedFacetItemList.length; m++) {
                var matchIndex = this._findFilterConditionInFacetItemList(selectedFacetItemList[m].filterCondition, chartResultSet.items);
                if (matchIndex >= 0) {
                    // if find, insert matching facet item to append list for range facet, because it has count info
                    if (this._isRangeFacet(chartResultSet.query)) {
                        appendFacetItemList.push(chartResultSet.items[matchIndex]);
                    }
                } else {
                    // not find, insert selected facet item to append list
                    // for range facet, set boolean as true
                    if (this._isRangeFacet(chartResultSet.query)) {
                        facetItemSelectionOutsideRange = true;
                    }
                    appendFacetItemList.push(selectedFacetItemList[m]);
                }
            }
            appendFacetItemList.sort(function (a, b) {
                return b.measureValue - a.measureValue;
            });
            if (this._isRangeFacet(chartResultSet.query)) {
                if (facetItemSelectionOutsideRange) {
                    chartResultSet.items = appendFacetItemList;
                }
            } else {
                chartResultSet.items = chartResultSet.items.concat(appendFacetItemList);
            }

            // merged list as search result facet
            searchResultSet.facets.splice(matchFacetIndex, 1, chartResultSet);
        },

        _findMatchFacet: function (dimension, facets) {
            var i = 0;
            for (; i < facets.length; i++) {
                var facet = facets[i];
                if (facet.query.dimension === dimension) {
                    break;
                }
            }
            return i;
        },

        _findFilterConditionInFacetItemList: function (filterCondition, facetItems) {
            var index = -1;
            for (var i = 0; i < facetItems.length; i++) {
                var chartFacetitem = facetItems[i];
                if (filterCondition.equals(chartFacetitem.filterCondition)) {
                    index = i;
                    break;
                }
            }
            return index;
        },

        _isRangeFacet: function (query) {
            var dataSourceMetadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
            if (dataSourceMetadata.type === query.sina.AttributeType.Double) {
                return true;
            }
            return false;

        }

    });



});
