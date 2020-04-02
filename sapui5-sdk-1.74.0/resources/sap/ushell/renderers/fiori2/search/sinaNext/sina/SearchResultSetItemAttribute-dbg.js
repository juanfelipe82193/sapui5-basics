// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */

sinaDefine(['../core/core', './SinaObject', './SearchResultSetItemAttributeBase'], function (core, SinaObject, SearchResultSetItemAttributeBase) {
    "use strict";

    return SearchResultSetItemAttributeBase.derive({

        _meta: {
            properties: {
                label: {
                    required: true
                },
                value: {
                    required: true
                },
                valueFormatted: {
                    required: false
                },
                valueHighlighted: {
                    required: false
                },
                isHighlighted: {
                    required: true
                },
                unitOfMeasure: {
                    required: false
                },
                description: {
                    required: false
                },
                defaultNavigationTarget: {
                    required: false,
                    aggregation: true
                },
                navigationTargets: {
                    required: false,
                    aggregation: true
                }
            }
        },

        toString: function () {
            return this.label + ':' + this.valueFormatted;
        }

    });

});
