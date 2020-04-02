// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './typeConverter'], function (core, typeConverter) {
    "use strict";

    return core.defineClass({

        _init: function (provider, itemParser) {
            this.provider = provider;
            this.sina = provider.sina;
            this.itemParser = itemParser;
        },

        parseObjectSuggestions: function (query, data) {
            if (!data.d.ObjectSuggestions ||
                !data.d.ObjectSuggestions.SearchResults ||
                !data.d.ObjectSuggestions.SearchResults.results) {
                return [];
            }
            var suggestionPromises = [];
            var objectSuggestions = data.d.ObjectSuggestions.SearchResults.results;
            for (var i = 0; i < objectSuggestions.length; ++i) {
                var objectSuggestion = objectSuggestions[i];
                suggestionPromises.push(this.parseObjectSuggestion(objectSuggestion));
            }
            return core.Promise.all(suggestionPromises);
        },

        parseObjectSuggestion: function (objectSuggestion) {
            return this.itemParser.parseItem(objectSuggestion).then(function (object) {
                var title = core.map(object.titleAttributes, function (attribute) {
                    return attribute.valueFormatted;
                }).join(' ');
                return this.sina._createObjectSuggestion({
                    calculationMode: this.sina.SuggestionCalculationMode.Data,
                    label: title,
                    object: object
                });
            }.bind(this));
        },

        parseRegularSuggestions: function (query, data) {
            var suggestions = [];
            var suggestion;
            var parentSuggestion;
            var parentSuggestions = [];
            var cell;
            var parentCell;

            if (!data.d.Suggestions ||
                !data.d.Suggestions.results) {
                return [];
            }

            var results = data.d.Suggestions.results;
            for (var i = 0; i < results.length; i++) {
                suggestion = null;
                cell = results[i];

                switch (cell.Type) {
                case 'H':
                    suggestion = this.parseSearchTermSuggestion(query, cell);
                    break;
                case 'A':
                    suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                    // attach type and cell information
                    suggestion.type = 'A';
                    suggestion.cell = cell;
                    break;
                case 'M':
                    suggestion = this.parseDataSourceSuggestion(query, cell);
                    break;
                }

                if (suggestion) {
                    if (suggestion.type === 'A') {
                        // set parent sugestion
                        if (parentSuggestions[suggestion.searchTerm] === undefined) {
                            parentCell = this._getParentCell(suggestion.cell);
                            parentSuggestion = this.parseSearchTermSuggestion(query, parentCell);
                            parentSuggestions[suggestion.searchTerm] = parentSuggestion;
                        }
                        // remove type and cell information
                        delete suggestion.type;
                        delete suggestion.cell;
                        // attach children
                        parentSuggestions[suggestion.searchTerm].childSuggestions.push(suggestion);
                    } else {
                        // push non-attribute suggestion
                        suggestions.push(suggestion);
                    }
                }
            }

            // push attribute suggestion
            Object.keys(parentSuggestions).forEach(function (key) {
                suggestions.push(parentSuggestions[key]);
            });

            return suggestions;
        },

        parseDataSourceSuggestion: function (query, cell) {
            var calculationMode = this.sina.SuggestionCalculationMode.Data; // always data suggestion
            var dataSource = this.sina.getDataSource(cell.FromDataSource);
            if (!dataSource) {
                return null;
            }
            var filter = query.filter.clone();
            filter.setDataSource(dataSource);
            return this.sina._createDataSourceSuggestion({
                calculationMode: calculationMode,
                dataSource: dataSource,
                label: cell.SearchTermsHighlighted
            });
        },

        parseSearchTermSuggestion: function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.Type);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.SearchTerms);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.SearchTerms,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.SearchTermsHighlighted
            });
        },

        parseSearchTermAndDataSourceSuggestion: function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.Type);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.SearchTerms);
            var dataSource = this.sina.getDataSource(cell.FromDataSource);
            if (!dataSource) {
                return null;
            }
            filter.setDataSource(dataSource);
            return this.sina._createSearchTermAndDataSourceSuggestion({
                searchTerm: cell.SearchTerms,
                dataSource: dataSource,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.SearchTermsHighlighted
            });
        },

        parseCalculationMode: function (scope) {
            switch (scope) {
            case 'H':
                return this.sina.SuggestionCalculationMode.History;
            case 'A':
            case 'M':
                return this.sina.SuggestionCalculationMode.Data;
            }
        },

        _getParentCell: function (cell) {
            var parentCell = {};
            parentCell = cell;
            parentCell.FromDataSource = "<All>";
            parentCell.FromDataSourceAttribute = "";
            parentCell.Type = "A";
            return parentCell;
        }

    });

});
