// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                group: {
                    required: true
                },
                attribute: {
                    required: true
                },
                nameInGroup: {
                    required: true
                }
            }
        }
    });
});
