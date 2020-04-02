// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', '../core/util', './Query', './SuggestionType', './SuggestionCalculationMode'], function (core, util, Query, SuggestionType, SuggestionCalculationMode) {
    "use strict";

    return Query.derive({

        _meta: {
            properties: {
                types: {
                    default: function () {
                        return [SuggestionType.DataSource, SuggestionType.Object, SuggestionType.SearchTerm];
                    },
                    setter: true
                },
                calculationModes: {
                    default: function () {
                        return [SuggestionCalculationMode.Data, SuggestionCalculationMode.History];
                    },
                    setter: true
                }
            }
        },

        requestTimeout: false,

        _initClone: function (other) {
            this.types = other.types.slice();
            this.calculationModes = other.calculationModes.slice();
        },

        _equals: function (other) {
            return core.equals(this.types, other.types, false) &&
                core.equals(this.calculationModes, other.calculationModes, false);
        },

        _execute: function (query) {
            return this.sina.provider.executeSuggestionQuery(query);
        }

    });



});
