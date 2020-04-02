// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject', './SearchResultSetItemAttributeBase'], function (core, SinaObject, SearchResultSetItemAttributeBase) {
    "use strict";

    return SearchResultSetItemAttributeBase.derive({

        _meta: {
            properties: {
                label: {
                    required: false
                },
                template: {
                    required: false
                },
                attributes: {
                    required: true,
                    default: function () {
                        return [];
                    }
                }
            }
        },

        toString: function () {
            var valueFormatted = "",
                pos = 0;
            var match, regex = RegExp("{[a-z]+}", "gi");
            while ((match = regex.exec(this.template)) !== null) {
                valueFormatted += this.template.substring(pos, match.index);
                var attributeName = match[0].slice(1, -1);
                valueFormatted += this.attributes[attributeName] && this.attributes[attributeName].valueFormatted || "";
                pos = regex.lastIndex;
            }
            valueFormatted += this.template.substring(pos);
            return this.label + ':' + valueFormatted;
        }

    });

});
