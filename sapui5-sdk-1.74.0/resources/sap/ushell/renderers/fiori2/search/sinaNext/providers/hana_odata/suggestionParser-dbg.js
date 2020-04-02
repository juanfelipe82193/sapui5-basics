// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './typeConverter'], function (core, typeConverter) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
        },

        parse: function (query, data) {
            var suggestions = [];
            var suggestion;
            // var parentSuggestion;
            // var parentSuggestions = [];
            // var suggestionSearchTerms = [];
            var cell;
            // var parentCell;
            // var calculationMode;

            for (var i = 0; i < data.length; i++) {
                suggestion = null;
                cell = data[i];
                // calculationMode = this.parseCalculationMode(cell.Type);
                //
                // switch (cell.Type) {
                // case 'H':
                //     suggestion = this.parseSearchTermSuggestion(query, cell);
                //     break;
                // case 'A':
                //     suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                //     // attach type and cell information
                //     suggestion.type = 'A';
                //     suggestion.cell = cell;
                //     break;
                // case 'M':
                //     suggestion = this.parseDataSourceSuggestion(query, cell);
                //     break;
                // }

                suggestion = this.parseSearchTermSuggestion(query, cell);

                // if (suggestion) {
                //     if (suggestion.type === 'A') {
                //         // set parent sugestion
                //         if (parentSuggestions[suggestion.searchTerm] === undefined) {
                //             parentCell = this._getParentCell(suggestion.cell);
                //             parentSuggestion = this.parseSearchTermSuggestion(query, parentCell);
                //             parentSuggestions[suggestion.searchTerm] = parentSuggestion;
                //         }
                //         // remove type and cell information
                //         delete suggestion.type;
                //         delete suggestion.cell;
                //         // attach children
                //         parentSuggestions[suggestion.searchTerm].childSuggestions.push(suggestion);
                //     } else {
                //         // push non-attribute suggestion
                //         suggestions.push(suggestion);
                //     }
                // }
                suggestions.push(suggestion);
            }

            // push attribute suggestion
            // Object.keys(parentSuggestions).forEach(function (key) {
            //     suggestions.push(parentSuggestions[key]);
            // });

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
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.term);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.term,
                calculationMode: this.sina.SuggestionCalculationMode.Data,
                filter: filter,
                label: cell.highlighted || cell.term
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
