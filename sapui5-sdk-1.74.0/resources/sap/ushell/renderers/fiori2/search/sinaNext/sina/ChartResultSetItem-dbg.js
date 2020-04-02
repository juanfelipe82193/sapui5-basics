// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './FacetResultSetItem'], function (core, FacetResultSetItem) {
    "use strict";

    return FacetResultSetItem.derive({
        _meta: {
            properties: {
                filterCondition: {
                    required: true
                }
            }
        }
    });

});
