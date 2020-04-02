// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './FacetQuery'], function (core, FacetQuery) {
    "use strict";

    return FacetQuery.derive({

        _meta: {
            properties: {
                top: {
                    default: 5 // top is defined in base class query, this just overwrites the default value
                },
                dimension: {
                    required: true
                }
            }
        },

        _initClone: function (other) {
            this.dimension = other.dimension;
        },

        _equals: function (other) {
            return this.dimension === other.dimension;
        },

        _execute: function (query) {
            return this.sina.provider.executeChartQuery(query);
        }

    });

});
