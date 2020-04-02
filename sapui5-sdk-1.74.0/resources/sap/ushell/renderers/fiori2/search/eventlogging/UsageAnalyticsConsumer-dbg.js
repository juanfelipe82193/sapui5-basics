// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer',
    'sap/ushell/renderers/fiori2/search/suggestions/SuggestionType'
], function (EventConsumer, SuggestionType) {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.eventlogging.UsageAnalyticsConsumer');

    // =======================================================================
    // Usage Analytics Event Consumer
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.eventlogging.UsageAnalyticsConsumer = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = jQuery.extend(new EventConsumer(), {

        init: function () {
            try {
                this.analytics = sap.ushell.Container.getService("UsageAnalytics");
            } catch (e) {
                /* empty */
            }
        },

        logEvent: function (event) {
            if (!this.analytics) {
                return;
            }
            switch (event.type) {
            case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE:
                this.analytics.logCustomEvent('FLP: Search', 'Launch Object', [event.targetUrl]);
                break;
            case this.eventLogger.SUGGESTION_SELECT:
                switch (event.suggestionType) {
                case SuggestionType.APPS:
                    this.analytics.logCustomEvent('FLP: Search', 'Suggestion Select App', [
                        event.suggestionTitle,
                        event.targetUrl,
                        event.searchTerm
                    ]);
                    this.analytics.logCustomEvent('FLP: Application Launch point', 'Search Suggestions', [
                        event.suggestionTitle,
                        event.targetUrl,
                        event.searchTerm
                    ]);
                    break;
                case SuggestionType.DATASOURCE:
                    this.analytics.logCustomEvent('FLP: Search', 'Suggestion Select Datasource', [
                        event.dataSourceKey,
                        event.searchTerm
                    ]);
                    break;
                case SuggestionType.OBJECTDATA:
                    this.analytics.logCustomEvent('FLP: Search', 'Suggestion Select Object Data', [
                        event.suggestionTerm,
                        event.dataSourceKey,
                        event.searchTerm
                    ]);
                    break;
                case SuggestionType.HISTORY:
                    this.analytics.logCustomEvent('FLP: Search', 'Suggestion Select Object Data', [
                        event.suggestionTerm,
                        event.dataSourceKey,
                        event.searchTerm
                    ]);
                    break;
                }
                break;
            case this.eventLogger.SEARCH_REQUEST:
                this.analytics.logCustomEvent('FLP: Search', 'Search', [
                    event.searchTerm,
                    event.dataSourceKey
                ]);
                break;
            case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE_CONTEXT:
                this.analytics.logCustomEvent('FLP: Search', 'Launch Related Object', [event.targetUrl]);
                break;
            case this.eventLogger.SUGGESTION_REQUEST:
                this.analytics.logCustomEvent('FLP: Search', 'Suggestion', [
                    event.suggestionTerm,
                    event.dataSourceKey
                ]);
                break;
            case this.eventLogger.TILE_NAVIGATE:
                this.analytics.logCustomEvent('FLP: Search', 'Launch App', [
                    event.tileTitle,
                    event.targetUrl
                ]);
                this.analytics.logCustomEvent('FLP: Application Launch point', 'Search Results', [
                    event.titleTitle,
                    event.targetUrl
                ]);
                break;
            }
        }
    });

    return module;
});
