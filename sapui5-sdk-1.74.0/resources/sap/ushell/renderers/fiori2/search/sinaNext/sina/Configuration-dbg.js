// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                personalizedSearch: {
                    required: true,
                    setter: true
                },
                isPersonalizedSearchEditable: {
                    required: true
                }
            }
        },

        resetPersonalizedSearchDataAsync: function () {
            return this.sina.provider.resetPersonalizedSearchDataAsync(this);
        },

        saveAsync: function () {
            return this.sina.provider.saveConfigurationAsync(this);
        }

    });

});
