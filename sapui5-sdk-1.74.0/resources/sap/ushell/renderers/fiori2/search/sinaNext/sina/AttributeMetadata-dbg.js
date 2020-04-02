// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject', './AttributeMetadataBase'], function (core, SinaObject, AttributeMetadataBase) {
    "use strict";

    return AttributeMetadataBase.derive({

        _meta: {
            properties: {
                type: {
                    required: true
                },
                label: {
                    required: true
                },
                isSortable: {
                    required: true
                },
                format: {
                    required: false
                    // TODO: multiple: true?
                },
                isKey: { // TODO: replace/amend with keyAttribute in SearchResultSetItem
                    required: true
                },
                semantics: {
                    required: false
                },
                matchingStrategy: {
                    required: true
                }
            }
        }

    });

});
