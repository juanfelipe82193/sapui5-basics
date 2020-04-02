// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './ResultSetItem'], function (core, ResultSetItem) {
    "use strict";

    return ResultSetItem.derive({

        _meta: {
            properties: {
                dataSource: {
                    required: true
                },
                titleAttributes: {
                    required: true,
                    aggregation: true
                },
                titleDescriptionAttributes: {
                    required: false,
                    aggregation: true
                },
                detailAttributes: {
                    required: true,
                    aggregation: true
                },
                defaultNavigationTarget: {
                    required: false,
                    aggregation: true
                },
                navigationTargets: {
                    required: false,
                    aggregation: true
                },
                score: {
                    required: false,
                    default: 0
                }
            }
        },

        toString: function () {
            var i;
            var result = [];
            var title = [];
            for (i = 0; i < this.titleAttributes.length; ++i) {
                var titleAttribute = this.titleAttributes[i];
                title.push(titleAttribute.toString());
            }
            result.push('--' + title.join(' '));
            for (i = 0; i < this.detailAttributes.length; ++i) {
                var detailAttribute = this.detailAttributes[i];
                result.push(detailAttribute.toString());
            }
            return result.join('\n');
        }

    });

});
