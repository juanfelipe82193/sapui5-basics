// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                id: {
                    required: true
                },
                usage: {
                    required: true
                },
                displayOrder: {
                    required: false
                },
                groups: { // array of AttributeGroupMembership instances
                    required: false,
                    default: function () {
                        return [];
                    }
                }
            }
        }
    });
});
