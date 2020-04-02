// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './FacetResultSet', './FacetType'], function (core, FacetResultSet, FacetType) {
    "use strict";

    return FacetResultSet.derive({
        type: FacetType.Chart
    });

});
