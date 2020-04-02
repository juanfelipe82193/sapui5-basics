// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                attributeLabel: {
                    required: false
                },
                valueLabel: {
                    required: false
                },
                userDefined: {
                    required: false
                }
            }
        },

        _initClone: function (other) {
            this.attributeLabel = other.attributeLabel;
            this.valueLabel = other.valueLabel;
            this.userDefined = other.userDefined;
        },

        _equals: function (other) {
            // do not consider the optional attributeLabel and valueLabel
            return true;
        }


    });

});
