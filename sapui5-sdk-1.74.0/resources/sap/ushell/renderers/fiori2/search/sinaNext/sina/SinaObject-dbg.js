// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core'], function (core) {
    "use strict";

    return core.defineClass({

        _meta: {
            properties: {
                sina: {
                    required: false,
                    getter: true
                },
                _private: {
                    required: false,
                    default: function () {
                        return {};
                    }
                }
            }
        },

        _initClone: function (other) {
            this.sina = other.sina;
        },

        _equals: function (other) {
            return this.sina === other.sina;
        }

    });

});
