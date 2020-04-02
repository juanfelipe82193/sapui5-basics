// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './ConfigFormatter', '../../core/util'], function (core, ConfigFormatter, util) {
    "use strict";

    // =======================================================================
    // helper
    // =======================================================================

    var createAttributeMap = function (item) {
        if (item.__templateAttributeMapCache) {
            return item.__templateAttributeMapCache;
        }
        var map = item.__templateAttributeMapCache = {};
        var attribute;
        for (var i = 0; i < item.detailAttributes.length; ++i) {
            attribute = item.detailAttributes[i];
            map[attribute.id] = attribute.value;
        }
        for (var j = 0; j < item.titleAttributes.length; ++j) {
            attribute = item.titleAttributes[j];
            map[attribute.id] = attribute.value;
        }
        return map;
    };

    // =======================================================================
    // metadata decription of search result set
    // =======================================================================

    var attributeType = {
        type: 'object',
        typeName: 'SearchResultSetItemAttribute',
        properties: [{
            name: 'label',
            type: 'string'
        }, {
            name: 'value',
            type: 'string'
        }, {
            name: 'valueFormatted',
            type: 'string'
        }, {
            name: 'valueHighlighted',
            type: 'string'
        }]
    };

    var detailAttributesProperty = {
        name: 'detailAttributes',
        multiple: true,
        getElementId: function (attribute) {
            return attribute.id;
        },
        createElement: function (attribute, ctx) {
            var sina = ctx.objectStack[0].sina;
            var attributeMetadata = sina._createAttributeMetadata({
                type: sina.AttributeType.String,
                id: attribute.id,
                label: '',
                isSortable: false,
                isKey: false,
                matchingStrategy: sina.MatchingStrategy.Exact,
                usage: {
                    Detail: {}
                }
            });
            var newAttribute = sina._createSearchResultSetItemAttribute({
                id: attribute.id,
                label: '',
                value: '',
                valueFormatted: '',
                valueHighlighted: '',
                isHighlighted: false,
                metadata: attributeMetadata
            });
            newAttribute.parent = ctx.objectStack[2];
            return newAttribute;
        },
        postProcessCreatedElement: function (attribute) {
            attribute.valueFormatted = attribute.valueFormatted || attribute.value;
            attribute.valueHighlighted = attribute.valueHighlighted || attribute.valueFormatted;
        },
        type: attributeType
    };

    var titleAttributesProperty = core.extend({}, detailAttributesProperty);
    titleAttributesProperty.name = 'titleAttributes';

    var searchResultSetType = {
        type: 'object',
        typeName: 'SearchResultSet',
        properties: [{
            name: 'items',
            multiple: true,
            getElementId: function (item) {
                return item.dataSource.id;
            },
            type: {
                type: 'object',
                typeName: 'SearchResultResultSetItem',
                evaluateTemplate: function (template, item) {
                    var itemMap = createAttributeMap(item);
                    return util.evaluateTemplate(template, itemMap);
                },
                properties: [{
                        name: 'title',
                        type: 'string'
                    },
                    titleAttributesProperty,
                    detailAttributesProperty,
                    {
                        name: 'navigationTargets',
                        multiple: true,
                        getElementId: function (navigationTarget) {
                            return navigationTarget.label;
                        },
                        createElement: function (navigationTarget, ctx) {
                            var sina = ctx.objectStack[0].sina;
                            var newNavigationTarget = sina._createNavigationTarget({
                                label: '',
                                targetUrl: ''
                            });
                            newNavigationTarget.parent = ctx.objectStack[2];
                            return newNavigationTarget;
                        },
                        type: {
                            type: 'object',
                            typeName: 'NavigationTarget',
                            properties: [{
                                name: 'label',
                                type: 'string'
                            }, {
                                name: 'targetUrl',
                                type: 'string'
                            }]
                        }
                    }
                ]
            }
        }]
    };

    // =======================================================================
    // formatter
    // =======================================================================
    return ConfigFormatter.derive({
        _init: function (configuration) {
            return ConfigFormatter.prototype._init.apply(this, [searchResultSetType, configuration]);
        }
    });

});
