// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject', './AttributeType', './AttributeMetadataBase'], function (core, SinaObject, AttributeType, AttributeMetadataBase) {
    "use strict";

    return AttributeMetadataBase.derive({

        _meta: {
            properties: {
                type: { // overwrite
                    required: false,
                    default: AttributeType.Group
                },
                label: { // overwrite
                    required: false
                },
                isSortable: { // overwrite
                    required: false,
                    default: false
                },
                template: {
                    required: false
                },
                attributes: { // array of AttributeGroupMembership instances
                    required: true,
                    default: function () {
                        return [];
                    }
                }
            }
        }
    });
});
