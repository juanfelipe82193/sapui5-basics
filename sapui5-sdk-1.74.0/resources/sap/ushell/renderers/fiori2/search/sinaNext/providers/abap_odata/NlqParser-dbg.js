// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/util'], function (core, util) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
        },

        getActiveResult: function (results) {
            for (var i = 0; i < results.length; ++i) {
                var result = results[i];
                if (result.IsCurrentQuery) {
                    return result;
                }
            }
            return null;
        },

        parse: function (data) {

            // default result
            var nlqResult = {
                success: false,
                description: ''
            };

            // check input parameters
            if (!data || !data.ResultList || !data.ResultList.NLQQueries || !data.ResultList.NLQQueries.results) {
                return nlqResult;
            }

            // get active result
            var results = data.ResultList.NLQQueries.results;
            var result = this.getActiveResult(results);
            if (!result) {
                return nlqResult;
            }

            // set return parameters
            nlqResult.success = true;
            nlqResult.description = result.Description;
            return nlqResult;

        }

    });

});
