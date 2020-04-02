// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './ConfigFormatter'], function (core, ConfigFormatter) {
    "use strict";

    // =======================================================================
    // metadata description of metadata
    // =======================================================================

    var metadataType = {
        type: 'object',
        typeName: 'DataSources',
        properties: [{
            name: 'dataSources',
            multiple: true,
            getElementId: function (dataSource) {
                return dataSource.id;
            },
            type: {
                type: 'object',
                typeName: 'DataSource',
                properties: [{
                    name: 'label',
                    type: 'string'
                }, {
                    name: 'labelPlural',
                    type: 'string'
                }, {
                    name: 'attributesMetadata',
                    multiple: true,
                    getElementId: function (attributeMetadata) {
                        return attributeMetadata.id;
                    },
                    type: {
                        type: 'object',
                        typeName: 'AttributeMetadata',
                        properties: [{
                            name: 'label',
                            type: 'string'
                        }, {
                            name: 'format',
                            type: 'string'
                        }]
                    }
                }]
            }
        }]
    };

    // =======================================================================
    // formatter
    // =======================================================================
    return ConfigFormatter.derive({
        _init: function (configuration) {
            return ConfigFormatter.prototype._init.apply(this, [metadataType, configuration]);
        }
    });

});
