// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/eventlogging/SinaLogConsumer',
    'sap/ushell/renderers/fiori2/search/eventlogging/UsageAnalyticsConsumer',
    'sap/ushell/renderers/fiori2/search/SearchHelper'
], function (SinaLogConsumer, UsageAnalyticsConsumer, SearchHelper) {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.eventlogging.EventLogger');

    // =======================================================================
    // EventLogger (main class for event logging)
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.eventlogging.EventLogger = function () {
        this.init.apply(this, arguments);
    };

    module.newInstance = function (properties) {
        var logger = new module(); // eslint-disable-line new-cap
        logger.addConsumer(new SinaLogConsumer(properties.sinaNext));
        logger.addConsumer(new UsageAnalyticsConsumer());
        return logger;
    };

    module.prototype = {

        ITEM_NAVIGATE: 'ITEM_NAVIGATE',
        SUGGESTION_SELECT: 'SUGGESTION_SELECT',
        SEARCH_REQUEST: 'SEARCH_REQUEST',
        RESULT_LIST_ITEM_NAVIGATE_CONTEXT: 'RESULT_LIST_ITEM_NAVIGATE_CONTEXT',
        SUGGESTION_REQUEST: 'SUGGESTION_REQUEST',
        TILE_NAVIGATE: 'TILE_NAVIGATE',
        SHOW_MORE: 'SHOW_MORE',
        BROWSER_CLOSE: 'BROWSER_CLOSE',
        LEAVE_PAGE: 'LEAVE_PAGE',
        SESSION_START: 'SESSION_START',
        RESULT_LIST_ITEM_NAVIGATE: 'RESULT_LIST_ITEM_NAVIGATE',
        OBJECT_SUGGESTION_NAVIGATE: 'OBJECT_SUGGESTION_NAVIGATE',
        DROPDOWN_SELECT_DS: 'DROPDOWN_SELECT_DS',
        DATASOURCE_CHANGE: 'DATASOURCE_CHANGE',
        FACET_FILTER_ADD: 'FACET_FILTER_ADD',
        FACET_FILTER_DEL: 'FACET_FILTER_DEL',
        ITEM_SHOW_DETAILS: 'ITEM_SHOW_DETAILS',
        ITEM_HIDE_DETAILS: 'ITEM_HIDE_DETAILS',
        CLEAR_ALL_FILTERS: 'CLEAR_ALL_FILTERS',
        FACET_SHOW_MORE: 'FACET_SHOW_MORE',
        FACET_SHOW_MORE_CLOSE: 'FACET_SHOW_MORE_CLOSE',

        eventMetadata: {

            SESSION_START: {},

            ITEM_NAVIGATE: {
                systemAndClient: 'string',
                sourceUrlArray: 'string',
                targetUrl: 'string'
            },

            RESULT_LIST_ITEM_NAVIGATE: {
                targetUrl: 'string',
                positionInList: 'integer',
                executionId: 'string'
            },

            SUGGESTION_SELECT: {
                suggestionType: 'string',
                suggestionTitle: 'string',
                suggestionTerm: 'string',
                searchTerm: 'string',
                targetUrl: 'string',
                dataSourceKey: 'string'
            },

            SEARCH_REQUEST: {
                searchTerm: 'string',
                dataSourceKey: 'string'
            },

            RESULT_LIST_ITEM_NAVIGATE_CONTEXT: {
                systemAndClient: 'string',
                sourceUrlArray: 'string',
                targetUrl: 'string'
            },

            SUGGESTION_REQUEST: {
                suggestionTerm: 'string',
                dataSourceKey: 'string'
            },

            TILE_NAVIGATE: {
                tileTitle: 'string',
                targetUrl: 'string'
            },

            SHOW_MORE: {},

            LEAVE_PAGE: {},

            BROWSER_CLOSE: {},

            DROPDOWN_SELECT_DS: {
                dataSourceId: 'string'
            },

            DATASOURCE_CHANGE: {
                dataSourceId: 'string'
            },

            FACET_FILTER_ADD: {
                referencedAttribute: 'string',
                clickedValue: 'string',
                clickedPosition: 'integer'
            },

            FACET_FILTER_DEL: {
                referencedAttribute: 'string',
                clickedValue: 'string',
                clickedPosition: 'integer'
            },

            FACET_SHOW_MORE: {
                referencedAttribute: 'string'
            },

            FACET_SHOW_MORE_CLOSE: {}

        },

        init: function () {
            this.consumers = [];
        },

        addConsumer: function (consumer) {
            this.consumers.push(consumer);
            consumer.eventLogger = this;
        },

        logEvent: function (event) {
            if (!SearchHelper.isLoggingEnabled()) {
                return;
            }

            for (var i = 0; i < this.consumers.length; ++i) {
                var consumer = this.consumers[i];
                try {
                    consumer.logEvent(event);
                } catch (e) {
                    // error in logging shall not break app
                }
            }
        }

    };

    return module;
});
