// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './pivotTableParser', './typeConverter'], function (core, pivotTableParser, typeConverter) {
    "use strict";

    var SuggestionParser = core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
        },

        parseSuggestions: function (query, data) {
            data = pivotTableParser.parse(data);
            var suggestions = [];
            var suggestion;
            var parentSuggestion;

            for (var i = 0; i < data.cells.length; i++) {
                suggestion = null;
                var cell = data.cells[i];
                if (cell.$$Attribute$$ !== '$$AllAttributes$$') {
                    continue;
                }
                switch (cell.$$Term$$.Scope) {
                case 'SearchHistory':
                    if (cell.$$DataSource$$ === '$$AllDataSources$$') {
                        suggestion = this.parseSearchTermSuggestion(query, cell);
                    }
                    break;
                case 'ObjectData':
                    if (cell.$$DataSource$$ === '$$AllDataSources$$') {
                        suggestion = this.parseSearchTermSuggestion(query, cell);
                        parentSuggestion = suggestion;
                    } else {
                        suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                        if (suggestion && suggestion.filter.dataSource !== parentSuggestion.filter.dataSource) {
                            parentSuggestion.childSuggestions.push(suggestion);
                        }
                        suggestion = null;
                    }
                    break;
                case 'DataSources':
                    if (cell.$$DataSource$$ === '$$AllDataSources$$') {
                        suggestion = this.parseDataSourceSuggestion(query, cell);
                    }
                    break;
                }
                if (suggestion) {
                    suggestions.push(suggestion);
                }
            }
            return suggestions;
        },

        parseDataSourceSuggestion: function (query, cell) {
            var dataSource = this.sina.getDataSource(cell.$$Term$$.Value);
            if (!dataSource) {
                return null;
            }
            var filter = query.filter.clone();
            filter.setDataSource(dataSource);
            return this.sina._createDataSourceSuggestion({
                calculationMode: this.sina.SuggestionCalculationMode.Data,
                dataSource: dataSource,
                label: cell.$$Term$$.ValueFormatted
            });
        },

        parseSearchTermSuggestion: function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.$$Term$$.Value);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.$$Term$$.Value,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.$$Term$$.ValueFormatted
            });
        },

        parseSearchTermAndDataSourceSuggestion: function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.$$Term$$.Value);
            var dataSource = this.sina.getDataSource(cell.$$DataSource$$);
            if (!dataSource) {
                return null;
            }
            filter.setDataSource(dataSource);
            return this.sina._createSearchTermAndDataSourceSuggestion({
                searchTerm: cell.$$Term$$.Value,
                dataSource: dataSource,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.$$Term$$.ValueFormatted
            });
        },

        parseCalculationMode: function (scope) {
            switch (scope) {
            case 'SearchHistory':
                return this.sina.SuggestionCalculationMode.History;
            case 'ObjectData':
                return this.sina.SuggestionCalculationMode.Data;
            }
        }

    });

    return {
        parse: function (provider, suggestionQuery, data) {
            var suggestionParser = new SuggestionParser(provider);
            return suggestionParser.parseSuggestions(suggestionQuery, data);
        }
    };

});
