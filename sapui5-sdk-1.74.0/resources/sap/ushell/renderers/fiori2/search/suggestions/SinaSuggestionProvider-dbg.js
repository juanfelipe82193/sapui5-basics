// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/suggestions/SinaBaseSuggestionProvider',
    'sap/ushell/renderers/fiori2/search/suggestions/SuggestionType',
    'sap/ushell/renderers/fiori2/search/suggestions/SinaObjectSuggestionFormatter',
    'sap/ushell/renderers/fiori2/search/SearchConfiguration'
], function (SearchHelper, SinaBaseSuggestionProvider, SuggestionType, SinaObjectSuggestionFormatter, SearchConfiguration) {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider');

    // =======================================================================
    // ina based suggestion provider - version 2 (new)
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = jQuery.extend(new SinaBaseSuggestionProvider(), {

        suggestionLimit: jQuery.device.is.phone ? 5 : 7,
        suggestionStartingCharacters: SearchConfiguration.getInstance().suggestionStartingCharacters,

        // init
        // ===================================================================
        init: function (params) {
            // call super constructor
            SinaBaseSuggestionProvider.prototype.init.apply(this, arguments);
            this.dataSourceDeferred = null;
            this.suggestionQuery = this.sinaNext.createSuggestionQuery();
            this.sinaObjectSuggestionFormatter = new SinaObjectSuggestionFormatter(this);
        },

        // abort suggestions
        // ===================================================================
        abortSuggestions: function () {
            this.suggestionQuery.abort();
        },

        // get suggestions
        // ===================================================================
        getSuggestions: function (filter) {

            var that = this;

            // reset global fields
            this.suggestions = [];
            this.firstObjectDataSuggestion = true;
            this.numberSuggestionsByType = {};
            for (var i = 0; i < SuggestionType.types.length; ++i) {
                var suggestionType = SuggestionType.types[i];
                this.numberSuggestionsByType[suggestionType] = 0;
            }

            // data based search term suggestions only starting by default from 3. character
            var suggestionTerm = filter.searchTerm;
            if (this.suggestionTypes.length === 1 &&
                this.suggestionTypes.indexOf(SuggestionType.SearchTermData) >= 0 &&
                suggestionTerm.length < this.suggestionStartingCharacters) {
                return jQuery.when(this.suggestions);
            }

            // object suggestions only starting by default from 3. character
            if (this.suggestionTypes.length === 1 &&
                this.suggestionTypes.indexOf(SuggestionType.Object) >= 0 &&
                suggestionTerm.length < this.suggestionStartingCharacters) {
                return jQuery.when(this.suggestions);
            }

            // data source suggestions only for ds=all
            if (this.suggestionTypes.length === 1 &&
                this.suggestionTypes.indexOf(SuggestionType.DataSource) >= 0 &&
                that.model.getDataSource() !== that.model.sinaNext.allDataSource) {
                return jQuery.when(this.suggestions);
            }

            // handle client side datasource-suggestions for all and apps
            that.createAllAndAppDsSuggestions();

            // check that BO search is enabled
            if (!that.model.config.searchBusinessObjects) {
                return jQuery.when(this.suggestions);
            }

            // no server request for ds = apps
            if (that.model.getDataSource() === that.model.appDataSource) {
                return jQuery.when(this.suggestions);
            }

            // prepare sina suggestion query
            that.prepareSuggestionQuery(filter);

            // fire sina suggestion query
            return that.suggestionQuery.getResultSetAsync().then(function (resultSet) {

                // concatenate searchterm + suggestion term
                var sinaSuggestions = resultSet.items;

                // assemble items from result set
                that.formatSinaSuggestions(sinaSuggestions);

                return that.suggestions;
            });

        },

        // client side datasource suggestions for all and apps
        // ===================================================================
        createAllAndAppDsSuggestions: function () {

            if (this.suggestionTypes.indexOf(SuggestionType.DataSource) < 0) {
                return;
            }

            if (this.model.getDataSource() !== this.model.allDataSource) {
                return;
            }

            var dataSources = [];
            dataSources.unshift(this.model.appDataSource);
            dataSources.unshift(this.model.allDataSource);

            var suggestionTerms = this.model.getProperty('/uiFilter/searchTerm');
            var suggestionTermsIgnoreStar = suggestionTerms.replace(/\*/g, '');
            var oTester = new SearchHelper.Tester(suggestionTermsIgnoreStar);

            for (var i = 0; i < dataSources.length; ++i) {
                var dataSource = dataSources[i];
                if (dataSource.id === this.model.getDataSource().id) {
                    continue;
                }
                var oTestResult = oTester.test(dataSource.label);
                if (oTestResult.bMatch === true) {

                    // limit number of suggestions
                    if (this.isSuggestionLimitReached(SuggestionType.DataSource)) {
                        return;
                    }

                    // create suggestion
                    var suggestion = {};
                    suggestion.label = '<i>' + sap.ushell.resources.i18n.getText("searchInPlaceholder", [""]) + '</i> ' + oTestResult.sHighlightedText;
                    suggestion.dataSource = dataSource;
                    suggestion.position = SuggestionType.properties.DataSource.position;
                    suggestion.type = this.sinaNext.SuggestionType.DataSource;
                    suggestion.calculationMode = this.sinaNext.SuggestionCalculationMode.Data;
                    suggestion.uiSuggestionType = SuggestionType.DataSource;
                    suggestion.uiSuggestionType = SuggestionType.DataSource;
                    this.addSuggestion(suggestion);
                }
            }
        },

        // check suggestion limit
        // ===================================================================
        isSuggestionLimitReached: function (suggestionType) {
            var limit = this.suggestionHandler.getSuggestionLimit(suggestionType);
            var numberSuggestions = this.numberSuggestionsByType[suggestionType];
            if (numberSuggestions >= limit) {
                return true;
            }
            return false;
        },

        // preformat of suggestions: add ui position and ui suggestion type
        // ===================================================================
        preFormatSuggestions: function (sinaSuggestions) {
            for (var i = 0; i < sinaSuggestions.length; ++i) {
                var sinaSuggestion = sinaSuggestions[i];
                // suggestion type
                sinaSuggestion.uiSuggestionType = this.getSuggestionType(sinaSuggestion);
                // set position
                sinaSuggestion.position = SuggestionType.properties[sinaSuggestion.uiSuggestionType].position;
                // key
                this.assembleKey(sinaSuggestion);
                // process children
                if (sinaSuggestion.childSuggestions) {
                    this.preFormatSuggestions(sinaSuggestion.childSuggestions);
                }
            }
        },

        // assemble key
        // ===================================================================
        assembleKey: function (sinaSuggestion) {
            switch (sinaSuggestion.uiSuggestionType) {
            case SuggestionType.DataSource:
                sinaSuggestion.key = SuggestionType.DataSource + sinaSuggestion.dataSource.id;
                break;
            case SuggestionType.SearchTermData:
                sinaSuggestion.key = SuggestionType.SearchTermData + sinaSuggestion.searchTerm;
                if (sinaSuggestion.dataSource) {
                    sinaSuggestion.key += sinaSuggestion.dataSource.id;
                }
                break;
            case SuggestionType.SearchTermHistory:
                sinaSuggestion.key = SuggestionType.SearchTermData + sinaSuggestion.searchTerm; // use type SearchTermData : in ui history and data based suggestions are identical
                if (sinaSuggestion.dataSource) {
                    sinaSuggestion.key += sinaSuggestion.dataSource.id;
                }
                break;
            case SuggestionType.Object:
                sinaSuggestion.key = SuggestionType.Object + sinaSuggestion.object.title;
                break;
            }
        },

        // add sina suggestions
        // ===================================================================
        formatSinaSuggestions: function (sinaSuggestions) {

            // preprocess add ui position and key to all suggestions
            this.preFormatSuggestions(sinaSuggestions);

            // process suggestions
            for (var i = 0; i < sinaSuggestions.length; ++i) {
                var sinaSuggestion = sinaSuggestions[i];

                // limit number of suggestions
                if (this.isSuggestionLimitReached(sinaSuggestion.uiSuggestionType)) {
                    continue;
                }

                // format according to type
                switch (sinaSuggestion.uiSuggestionType) {
                case SuggestionType.DataSource:
                    if (this.model.getDataSource() !== this.model.allDataSource) {
                        continue;
                    }
                    //sinaSuggestion.label = /*<i>' + sap.ushell.resources.i18n.getText("searchInPlaceholder", [""]) + '</i> ' +*/ sinaSuggestion.label;
                    this.addSuggestion(sinaSuggestion);
                    break;
                case SuggestionType.SearchTermData:
                    this.formatSearchTermDataSuggestion(sinaSuggestion);
                    break;
                case SuggestionType.SearchTermHistory:
                    this.addSuggestion(sinaSuggestion);
                    break;
                case SuggestionType.Object:
                    this.sinaObjectSuggestionFormatter.format(this, sinaSuggestion);
                    break;
                default:
                    break;
                }

            }

            return this.suggestions;
        },

        // add suggestion
        // ===================================================================
        addSuggestion: function (suggestion) {
            this.suggestions.push(suggestion);
            this.numberSuggestionsByType[suggestion.uiSuggestionType] += 1;
        },

        // format search term suggestion
        // ===================================================================
        formatSearchTermDataSuggestion: function (sinaSuggestion) {
            if (this.model.getDataSource() === this.model.allDataSource) {
                // 1. model datasource is all
                if (this.firstObjectDataSuggestion) {
                    // 1.1 first suggestion (display also child suggestions)
                    this.firstObjectDataSuggestion = false;
                    if (sinaSuggestion.childSuggestions.length > 0) {
                        sinaSuggestion.label = this.assembleSearchInSuggestionLabel(sinaSuggestion);
                        sinaSuggestion.grouped = true;
                        this.addSuggestion(sinaSuggestion);
                        this.addChildSuggestions(sinaSuggestion);
                    } else {
                        this.addSuggestion(sinaSuggestion);
                    }
                } else {
                    // 1.2 subsequent suggestions (ignore child suggestions)
                    this.addSuggestion(sinaSuggestion);
                }
            } else {
                // 2. model datasource is a connector
                this.addSuggestion(sinaSuggestion);
            }
        },

        // add child suggestions
        // ===================================================================
        addChildSuggestions: function (sinaSuggestion) {
            // max 2 child suggestions
            for (var i = 0; i < Math.min(2, sinaSuggestion.childSuggestions.length); ++i) {

                // check limit
                if (this.isSuggestionLimitReached(SuggestionType.SearchTermData)) {
                    return;
                }

                // add suggestion
                var sinaChildSuggestion = sinaSuggestion.childSuggestions[i];
                sinaChildSuggestion.label = this.assembleSearchInSuggestionLabel(sinaChildSuggestion);
                sinaChildSuggestion.grouped = true;
                this.addSuggestion(sinaChildSuggestion);
            }
        },

        // assemble search in suggestion label
        // ===================================================================
        assembleSearchInSuggestionLabel: function (sinaSuggestion) {
            return sap.ushell.resources.i18n.getText("resultsIn", [
                '<span>' + sinaSuggestion.label + '</span>',
                sinaSuggestion.filter.dataSource.labelPlural
            ]);
        },

        // get type of sina suggestion
        // ===================================================================
        getSuggestionType: function (sinaSuggestion) {
            switch (sinaSuggestion.type) {
            case this.sinaNext.SuggestionType.SearchTerm:
                if (sinaSuggestion.calculationMode === this.sinaNext.SuggestionCalculationMode.History) {
                    return SuggestionType.SearchTermHistory;
                }
                return SuggestionType.SearchTermData;
            case this.sinaNext.SuggestionType.SearchTermAndDataSource:
                if (sinaSuggestion.calculationMode === this.sinaNext.SuggestionCalculationMode.History) {
                    return SuggestionType.SearchTermHistory;
                }
                return SuggestionType.SearchTermData;
            case this.sinaNext.SuggestionType.DataSource:
                return SuggestionType.DataSource;
            case this.sinaNext.SuggestionType.Object:
                return SuggestionType.Object;
            }
        }

    });

    return module;
});
