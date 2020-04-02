// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './Suggestion', './SuggestionType'], function (core, Suggestion, SuggestionType) {
    "use strict";

    return Suggestion.derive({

        type: SuggestionType.Object,

        _meta: {
            properties: {
                object: {
                    required: true,
                    aggregation: true
                }
            }
        }

    });

});
