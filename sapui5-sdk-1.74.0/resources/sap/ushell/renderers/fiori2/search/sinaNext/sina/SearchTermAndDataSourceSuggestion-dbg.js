// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SearchTermSuggestion', './SuggestionType'], function (core, SearchTermSuggestion, SuggestionType) {
    "use strict";

    return SearchTermSuggestion.derive({

        type: SuggestionType.SearchTermAndDataSource,

        _meta: {
            properties: {
                dataSource: {
                    required: true
                }
            }
        }

    });

});
