// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                type: {
                    required: true
                },
                id: {
                    required: true
                },
                label: {
                    required: true
                },
                labelPlural: {
                    required: false
                },
                hidden: {
                    required: false,
                    default: false
                },
                usage: {
                    required: false,
                    default: {}
                },
                attributesMetadata: {
                    required: false,
                    default: function () {
                        return [];
                    }
                },
                attributeMetadataMap: {
                    required: false,
                    default: function () {
                        return {};
                    }
                },
                attributeGroupsMetadata: {
                    required: false,
                    default: function () {
                        return [];
                    }
                },
                attributeGroupMetadataMap: {
                    required: false,
                    default: function () {
                        return {};
                    }
                }
            }
        },

        equals: function () {
            throw new core.Exception('use === operator for comparison of datasources');
        },

        _afterInitProperties: function () {
            if (!this.labelPlural || this.labelPlural.length === 0) {
                this.labelPlural = this.label;
            }
            if (this.type === this.sina.DataSourceType.BusinessObject && this.attributesMetadata.length === 0) {
                throw 'attributes of datasource are missing';
            }
            this.attributeMetadataMap = this.createAttributeMetadataMap(this.attributesMetadata);
        },

        _configure: function () {
            // do not use
            // legacy: only called from inav2 provider
            var formatters = this.sina.metadataFormatters;
            if (!formatters) {
                return;
            }
            for (var i = 0; i < formatters.length; ++i) {
                var formatter = formatters[i];
                formatter.format({
                    dataSources: [this]
                });
            }
        },

        createAttributeMetadataMap: function (attributesMetadata) {
            var map = {};
            for (var i = 0; i < attributesMetadata.length; ++i) {
                var attributeMetadata = attributesMetadata[i];
                map[attributeMetadata.id] = attributeMetadata;
            }
            return map;
        },

        getAttributeMetadata: function (id) {
            return this.attributeMetadataMap[id];
        },

        toJson: function () {
            return {
                type: this.type,
                id: this.id,
                label: this.label,
                labelPlural: this.labelPlural
            };
        }

    });

});
