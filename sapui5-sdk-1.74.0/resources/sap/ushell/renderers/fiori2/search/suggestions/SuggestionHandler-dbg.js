// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap, clearTimeout, setTimeout  */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/suggestions/SinaSuggestionProvider',
    'sap/ushell/renderers/fiori2/search/suggestions/AppSuggestionProvider',
    'sap/ushell/renderers/fiori2/search/suggestions/TimeMerger',
    'sap/ushell/renderers/fiori2/search/suggestions/SuggestionType'
], function (SearchHelper, SinaSuggestionProvider, AppSuggestionProvider, TimeMerger, SuggestionType) {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SuggestionHandler');
    var suggestions = sap.ushell.renderers.fiori2.search.suggestions;

    // =======================================================================
    // suggestions handler
    // =======================================================================
    suggestions.SuggestionHandler = function () {
        this.init.apply(this, arguments);
    };

    suggestions.SuggestionHandler.prototype = {

        // init
        // ===================================================================
        init: function (params) {

            // members
            var that = this;
            that.model = params.model;
            that.suggestionProviders = [];

            // times
            that.keyboardRelaxationTime = that.model.config.suggestionKeyboardRelaxationTime;
            that.uiUpdateInterval = 500;
            that.uiClearOldSuggestionsTimeOut = 1000;

            // apps suggestion provider
            that.appSuggestionProvider = new AppSuggestionProvider({
                model: that.model,
                suggestionHandler: this
            });

            // decorator for delayed suggestion execution, make delayed by default 400ms
            that.doSuggestionInternal = SearchHelper.delayedExecution(that.doSuggestionInternal, that.keyboardRelaxationTime);

            // time merger for merging returning suggestions callbacks
            that.timeMerger = new TimeMerger();

        },

        // abort suggestions
        // ===================================================================
        abortSuggestions: function (clearSuggestions) {
            if (clearSuggestions === undefined || clearSuggestions === true) {
                this.model.setProperty("/suggestions", []);
            }
            if (this.clearSuggestionTimer) {
                clearTimeout(this.clearSuggestionTimer);
                this.clearSuggestionTimer = null;
            }
            this.doSuggestionInternal.abort(); // abort time delayed calls
            this.getSuggestionProviders().done(function (suggestionProviders) {
                for (var i = 0; i < suggestionProviders.length; ++i) {
                    var suggestionProvider = suggestionProviders[i];
                    suggestionProvider.abortSuggestions();
                }
            });
            this.timeMerger.abort();
        },

        // get suggestion providers dependend on server capabilities
        // ===================================================================
        getSuggestionProviders: function () {

            // check cache
            var that = this;
            if (that.suggestionProvidersDeferred) {
                return that.suggestionProvidersDeferred;
            }

            that.suggestionProvidersDeferred = that.model.initBusinessObjSearch().then(function () {

                // link to sina
                that.sinaNext = that.model.sinaNext;

                // init list of suggestion providers (app suggestions are always available)
                var suggestionProviders = [that.appSuggestionProvider];

                // if no business obj search configured -> just use app suggestion provider
                if (!that.model.config.searchBusinessObjects) {
                    return jQuery.when(suggestionProviders);
                }

                // create sina suggestion providers
                suggestionProviders.push.apply(suggestionProviders, that.createSinaSuggestionProviders());
                return jQuery.when(suggestionProviders);
            });

            return that.suggestionProvidersDeferred;
        },

        // create sina suggestion providers
        // ===================================================================
        createSinaSuggestionProviders: function () {

            // provider configuration
            var providerConfigurations = [{
                suggestionTypes: [SuggestionType.SearchTermHistory]
            }, {
                suggestionTypes: [SuggestionType.SearchTermData]
            }, {
                suggestionTypes: [SuggestionType.DataSource]
            }];
            if (this.model.config.boSuggestions) {
                providerConfigurations.push({
                    suggestionTypes: [SuggestionType.Object]
                });
            }

            // create suggestion providers
            var suggestionProviders = [];
            for (var k = 0; k < providerConfigurations.length; ++k) {
                var providerConfiguration = providerConfigurations[k];
                suggestionProviders.push(new SinaSuggestionProvider({
                    model: this.model,
                    sinaNext: this.sinaNext,
                    suggestionTypes: providerConfiguration.suggestionTypes,
                    suggestionHandler: this
                }));
            }

            return suggestionProviders;
        },

        // check if suggestions are visible
        // ===================================================================
        isSuggestionPopupVisible: function () {
            return jQuery('.searchSuggestion').filter(':visible').length > 0;
        },

        // do suggestions
        // ===================================================================
        doSuggestion: function (filter) {
            this.abortSuggestions(false);
            this.doSuggestionInternal(filter); // time delayed
        },

        // auto select app suggestion
        // ===================================================================
        autoSelectAppSuggestion: function (filter) {
            return this.appSuggestionProvider.getSuggestions(filter).then(function (suggestions) {
                return suggestions[0];
            });
        },

        // do suggestion internal
        // ===================================================================
        doSuggestionInternal: function (filter) {
            /* eslint no-loop-func:0 */

            // don't suggest if there is no search term
            var that = this;
            that.firstInsertion = true;
            that.busyIndicator = false;
            var suggestionTerm = that.model.getProperty("/uiFilter/searchTerm");
            if (suggestionTerm.length === 0) {
                that.insertSuggestions([], 0);
                return;
            }

            // no suggestions for *
            if (suggestionTerm.trim() === '*') {
                that.insertSuggestions([], 0);
                return;
            }

            // log suggestion request
            that.model.eventLogger.logEvent({
                type: that.model.eventLogger.SUGGESTION_REQUEST,
                suggestionTerm: that.model.getProperty('/uiFilter/searchTerm'),
                dataSourceKey: that.model.getProperty('/uiFilter/dataSource').id
            });

            // get suggestion providers
            that.getSuggestionProviders().done(function (suggestionProviders) {

                // get suggestion promises from all providers
                var promises = [];
                var pending = suggestionProviders.length;
                for (var i = 0; i < suggestionProviders.length; ++i) {
                    var suggestionProvider = suggestionProviders[i];
                    promises.push(suggestionProvider.getSuggestions(filter));
                }

                // display empty suggestions list just with busy indicator
                if (that.isSuggestionPopupVisible()) {
                    // do this time delayed in order to avoid flickering
                    // otherwise we would have: old suggestions/busy indicator/new suggestions                    
                    if (that.clearSuggestionTimer) {
                        clearTimeout(that.clearSuggestionTimer);
                    }
                    that.clearSuggestionTimer = setTimeout(function () {
                        that.clearSuggestionTimer = null;
                        that.insertSuggestions([], pending);
                    }, that.uiClearOldSuggestionsTimeOut);
                } else {
                    // immediately display busy indicator
                    that.insertSuggestions([], pending);
                }

                // process suggestions using time merger
                // (merge returning suggestion callbacks happening within a time slot
                // in order to reduce number of UI updates)
                that.timeMerger.abort();
                that.timeMerger = new TimeMerger(promises, that.uiUpdateInterval);
                that.timeMerger.process(function (results) {
                    pending -= results.length;
                    var suggestions = [];
                    for (var j = 0; j < results.length; ++j) {
                        var result = results[j];
                        suggestions.push.apply(suggestions, result);
                    }
                    if (pending > 0 && suggestions.length === 0) {
                        return; // empty result -> return and don't update (flicker) suggestions on UI
                    }
                    if (that.clearSuggestionTimer) {
                        clearTimeout(that.clearSuggestionTimer);
                        that.clearSuggestionTimer = null;
                    }
                    that.insertSuggestions(suggestions, pending);
                });

            });

        },

        // generate suggestion header
        // ===================================================================
        generateSuggestionHeader: function (insertSuggestion) {
            var header = {};
            switch (insertSuggestion.uiSuggestionType) {
            case SuggestionType.App:
                header.label = sap.ushell.resources.i18n.getText('label_apps');
                break;
            case SuggestionType.DataSource:
                header.label = sap.ushell.resources.i18n.getText('searchIn');
                break;
            case SuggestionType.SearchTermData:
            case SuggestionType.SearchTermHistory:
                header.label = sap.ushell.resources.i18n.getText('searchFor');
                break;
            case SuggestionType.Object:
                header.label = insertSuggestion.dataSource.labelPlural;
                header.dataSource = insertSuggestion.dataSource;
                break;
            }
            header.position = SuggestionType.properties[insertSuggestion.uiSuggestionType].position;
            header.suggestionResultSetCounter = this.suggestionResultSetCounter;
            header.uiSuggestionType = SuggestionType.Header;
            return header;
        },

        // enable busy indicator suggestion (waiting for suggestions)
        // ===================================================================
        enableBusyIndicator: function (suggestions, enabled) {
            if (enabled) {
                // enable -> add busy indicator suggestions
                suggestions.push({
                    position: SuggestionType.properties[SuggestionType.BusyIndicator].position,
                    uiSuggestionType: SuggestionType.BusyIndicator
                });
                return;
            }
            // disable -> remove busy indicator suggestion
            for (var i = 0; i < suggestions.length; ++i) {
                var suggestion = suggestions[i];
                if (suggestion.uiSuggestionType === SuggestionType.BusyIndicator) {
                    suggestions.splice(i, 1);
                    return;
                }
            }

        },

        // check for duplicate suggestion
        // ===================================================================
        checkDuplicate: function (suggestions, insertSuggestion) {

            var checkRelevancy = function (suggestion) {
                return insertSuggestion.uiSuggestionType === SuggestionType.SearchTermHistory ||
                    (insertSuggestion.uiSuggestionType === SuggestionType.SearchTermData && !insertSuggestion.dataSource);
            };

            if (!checkRelevancy(insertSuggestion)) {
                return {
                    action: 'append'
                };
            }

            for (var i = 0; i < suggestions.length; ++i) {
                var suggestion = suggestions[i];
                if (!checkRelevancy(suggestion)) {
                    continue;
                }
                if (insertSuggestion.searchTerm === suggestion.searchTerm) {
                    if (insertSuggestion.grouped &&
                        insertSuggestion.uiSuggestionType === SuggestionType.SearchTermData &&
                        suggestion.uiSuggestionType === SuggestionType.SearchTermHistory) {
                        // for the top grouped suggestions: prefer data based suggestion
                        // over history based suggestions because
                        // - upper lower case of history and data based suggestions may differ
                        // - upper lower case should be identical for all grouped suggestions
                        return {
                            action: 'replace',
                            index: i
                        };
                    }
                    return {
                        action: 'skip'
                    };

                }
            }
            return {
                action: 'append'
            };
        },

        // insert suggestions
        // ===================================================================
        insertSuggestions: function (insertSuggestions, pending) {

            // get suggestions from model
            var suggestions = this.model.getProperty('/suggestions').slice(); // copy list (updateSuggestions needs to access old list via data binding)

            // unsorted insert of suggestions
            suggestions = this.insertIntoSuggestionList(insertSuggestions, suggestions);

            // adjust busy indicator
            if (!this.busyIndicator && pending > 0) {
                this.enableBusyIndicator(suggestions, true);
                this.busyIndicator = true;
            }
            if (this.busyIndicator && pending === 0) {
                this.enableBusyIndicator(suggestions, false);
                this.busyIndicator = false;
            }

            // sort 
            this.sortSuggestions(suggestions);

            // remove suggestions if over limit 
            // (limit needs to be done here because history and search term suggestions are merged)
            this.limitSuggestions(suggestions);

            // set suggestions in model
            this.updateSuggestions(suggestions);
            //this.model.setProperty('/suggestions', suggestions);
        },

        // insert into suggestion list
        // ===================================================================
        insertIntoSuggestionList: function (insertSuggestions, suggestions) {

            // do we need to replace?
            var flagReplace = false;
            if (this.firstInsertion) {
                this.firstInsertion = false;
                flagReplace = true;
            }

            // reset global fields
            if (flagReplace) {
                suggestions = [];
                this.suggestionHeaders = {};
                this.suggestionResultSetCounter = 0;
                this.generatedPositions = {
                    maxPosition: SuggestionType.properties[SuggestionType.Object].position,
                    position: {}
                };
            }

            // increase result set counter (used for sorting)
            this.suggestionResultSetCounter += 1;

            // add sorting information to the suggestions
            for (var i = 0; i < insertSuggestions.length; ++i) {
                var insertSuggestion = insertSuggestions[i];

                // for object suggestions: overwrite position by a generated position 
                // object suggestion with identical datasource are grouped by position
                if (insertSuggestion.uiSuggestionType === SuggestionType.Object) {
                    var position = this.generatedPositions.position[insertSuggestion.dataSource.id];
                    if (!position) {
                        this.generatedPositions.maxPosition += 1;
                        position = this.generatedPositions.maxPosition;
                        this.generatedPositions.position[insertSuggestion.dataSource.id] = position;
                    }
                    insertSuggestion.position = position;
                }

                // set fields used in sorting
                insertSuggestion.suggestionResultSetCounter = this.suggestionResultSetCounter;
                insertSuggestion.resultSetPosition = i;

                // additional duplicate check for search term suggestions
                var duplicateCheckResult = this.checkDuplicate(suggestions, insertSuggestion);
                switch (duplicateCheckResult.action) {
                case 'append':
                    suggestions.push(insertSuggestion);
                    break;
                case 'skip':
                    continue;
                case 'replace':
                    //var toBeReplacedSuggestion = suggestions[duplicateCheckResult.index];
                    suggestions.splice(duplicateCheckResult.index, 1, insertSuggestion);
                    //insertSuggestion.suggestionResultSetCounter = toBeReplacedSuggestion.suggestionResultSetCounter;
                    //insertSuggestion.resultSetPosition = toBeReplacedSuggestion.resultSetPosition;
                    break;
                }

                // if no header for this position -> generate header
                if (this.isHeaderGenerationEnabled() && !this.suggestionHeaders[insertSuggestion.position]) {
                    suggestions.push(this.generateSuggestionHeader(insertSuggestion));
                    this.suggestionHeaders[insertSuggestion.position] = true;
                }
            }

            return suggestions;

        },

        // check whether we need to generate headers
        // ===================================================================
        isHeaderGenerationEnabled: function () {

            // no headings for app datsource
            if (this.model.getDataSource() === this.model.appDataSource) {
                return false;
            }

            // no headings if bo suggestions are deactivated datasource is businessobject (connector)
            if (!this.model.config.boSuggestions && this.model.getDataSource().type === this.sinaNext.DataSourceType.BusinessObject) {
                return false;
            }

            return true;
        },

        // sort suggestions
        // ===================================================================
        sortSuggestions: function (suggestions) {
            suggestions.sort(function (s1, s2) {

                // position is main sort field
                var cmp = s1.position - s2.position;
                if (cmp !== 0) {
                    return cmp;
                }

                // headers are always on top of each section
                if (s1.uiSuggestionType === SuggestionType.Header) {
                    return -1;
                }
                if (s2.uiSuggestionType === SuggestionType.Header) {
                    return 1;
                }

                // special: grouped search term suggestions on top
                // grouped: the first search term suggestion with sub suggestions by datasource
                // for instance: sally in All
                //               sally in Employees
                //               sally in Customers
                if (s1.grouped && !s2.grouped) {
                    return -1;
                }
                if (!s1.grouped && s2.grouped) {
                    return 1;
                }

                // sort by result set
                cmp = s1.suggestionResultSetCounter - s2.suggestionResultSetCounter;
                if (cmp !== 0) {
                    return cmp;
                }

                // sort by position in result set
                cmp = s1.resultSetPosition - s2.resultSetPosition;
                return cmp;
            });
        },

        // get suggestion limit
        // ===================================================================
        getSuggestionLimit: function (uiSuggestionType) {
            var suggestionTypeData = SuggestionType.properties[uiSuggestionType];
            if (typeof suggestionTypeData === 'undefined') {
                return Infinity;
            }
            var limit;
            if (this.model.getDataSource() === this.model.sinaNext.allDataSource) {
                limit = suggestionTypeData.limitDsAll;
            } else {
                limit = suggestionTypeData.limit;
            }
            return limit;
        },

        // limit suggestions
        // ===================================================================
        limitSuggestions: function (suggestions) {

            var numberSuggestions = {};

            for (var i = 0; i < suggestions.length; ++i) {
                var suggestion = suggestions[i];
                var suggestionType = suggestion.uiSuggestionType;
                if (suggestionType === SuggestionType.SearchTermHistory) {
                    suggestionType = SuggestionType.SearchTermData; // history and data suggestions are merged
                }
                var limit = this.getSuggestionLimit(suggestionType);
                var number = numberSuggestions[suggestionType];
                if (typeof number === 'undefined') {
                    number = 0;
                    numberSuggestions[suggestionType] = number;
                }
                if (number >= limit) {
                    suggestions.splice(i, 1);
                    --i;
                    continue;
                }
                numberSuggestions[suggestionType] = number + 1;
            }

        },

        // update suggestions with restore old selected suggestion
        // ===================================================================
        updateSuggestions: function (suggestions) {

            var input = sap.ui.getCore().byId('searchFieldInShell-input');

            // get selected entry in old suggestion list
            var suggestionRows = input.getSuggestionRows();
            var suggestionKey;
            for (var i = 0; i < suggestionRows.length; ++i) {
                var suggestionRow = suggestionRows[i];
                var suggestion = suggestionRow.getBindingContext().getObject();
                if (suggestionRow.getSelected()) {
                    suggestionKey = suggestion.key;
                }
            }

            // update suggestions
            this.model.setProperty('/suggestions', suggestions);

            // restore selected entry (ugly time delayed logic)
            if (!suggestionKey) {
                return;
            }
            window.setTimeout(function () {
                var suggestionRows = input.getSuggestionRows();
                for (var j = 0; j < suggestionRows.length; ++j) {
                    var suggestionRow = suggestionRows[j];
                    var suggestion = suggestionRow.getBindingContext().getObject();
                    if (suggestion.key === suggestionKey) {
                        input._oSuggPopover._iPopupListSelectedIndex = j; // ugly
                        suggestionRow.setSelected(true);
                        suggestionRow.rerender();
                    }
                }
            }, 100);

        }

    };

    return suggestions.SuggestionHandler;
});
