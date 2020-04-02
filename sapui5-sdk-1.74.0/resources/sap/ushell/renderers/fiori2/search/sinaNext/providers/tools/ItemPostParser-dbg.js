// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */

/* eslint no-fallthrough: 0 */
/* eslint default-case: 0 */
/* eslint complexity: 0 */

sinaDefine([
    '../../sina/SinaObject'
], function (SinaObject) {
    "use strict";

    return SinaObject.derive({

        _init: function (properties) {
            this._searchResultSetItem = properties.searchResultSetItem;
            this._dataSource = properties.searchResultSetItem.dataSource;
            this._allAttributesMap = properties.allAttributesMap || properties.searchResultSetItem._private.allAttributesMap;

            this._intentsResolver = this.sina._createFioriIntentsResolver();
        },

        postParseResultSetItem: function () {
            var prom = this.enhanceResultSetItemWithNavigationTargets();
            this.enhanceResultSetItemWithGroups(); // can be done in parallel, if parallelization is possible
            return prom;
        },

        enhanceResultSetItemWithNavigationTargets: function () {
            var that = this;
            var semanticObjectType = that._dataSource._private.semanticObjectType;
            var semanticObjectTypeAttributes = that._searchResultSetItem._private.semanticObjectTypeAttributes;
            var systemId = that._dataSource._private.system;
            var client = that._dataSource._private.client;
            return that._intentsResolver.resolveIntents({
                semanticObjectType: semanticObjectType,
                semanticObjectTypeAttributes: semanticObjectTypeAttributes,
                systemId: systemId,
                client: client,
                fallbackDefaultNavigationTarget: that._searchResultSetItem.defaultNavigationTarget
            }).then(function (intents) {
                var defaultNavigationTarget = intents && intents.defaultNavigationTarget;
                var navigationTargets = intents && intents.navigationTargets;
                if (defaultNavigationTarget) {
                    that._searchResultSetItem.defaultNavigationTarget = defaultNavigationTarget;
                    defaultNavigationTarget.parent = that._searchResultSetItem;
                }
                if (navigationTargets) {
                    that._searchResultSetItem.navigationTargets = navigationTargets;
                    for (var i = 0; i < navigationTargets.length; i++) {
                        navigationTargets[i].parent = that._searchResultSetItem;
                    }
                }
                return that._searchResultSetItem;
            });
        },

        enhanceResultSetItemWithGroups: function () {
            var attributesMetadata = this._searchResultSetItem.dataSource.attributesMetadata;
            for (var i = 0; i < attributesMetadata.length; i++) {
                var attributeMetadata = attributesMetadata[i];
                if (attributeMetadata.type === this.sina.AttributeType.Group) {
                    var group = this._addAttributeGroup(attributeMetadata);
                    if (attributeMetadata.usage.Detail) {
                        this._searchResultSetItem.detailAttributes.push(group);
                    }
                    if (attributeMetadata.usage.Title) {
                        this._searchResultSetItem.titleAttributes.push(group);
                    }
                    if (attributeMetadata.usage.TitleDescription) {
                        this._searchResultSetItem.titleDescriptionAttributes.push(group);
                    }
                }
            }
            this.sortAttributes();
        },

        sortAttributes: function () {
            var createSortFunction = function (attributeName) {
                return function (a1, a2) {
                    // be careful to handle displayOrder === 0 correctly!
                    var displayOrder1 = a1.metadata.usage && a1.metadata.usage[attributeName] ? a1.metadata.usage[attributeName].displayOrder : undefined;
                    var displayOrder2 = a2.metadata.usage && a2.metadata.usage[attributeName] ? a2.metadata.usage[attributeName].displayOrder : undefined;
                    if (displayOrder1 === undefined || displayOrder2 === undefined) {
                        if (displayOrder2 !== undefined) {
                            return 1;
                        }
                        return -1;

                    }
                    return displayOrder1 - displayOrder2;
                };
            };
            this._searchResultSetItem.titleAttributes.sort(createSortFunction("Title"));
            this._searchResultSetItem.titleDescriptionAttributes.sort(createSortFunction("TitleDescription"));
            this._searchResultSetItem.detailAttributes.sort(createSortFunction("Detail"));
        },

        _addAttributeGroup: function (attributeGroupMetadata) {

            var group = this.sina._createSearchResultSetItemAttributeGroup({
                id: attributeGroupMetadata.id,
                metadata: attributeGroupMetadata,
                label: attributeGroupMetadata.label,
                template: attributeGroupMetadata.template,
                attributes: [],
                groups: []
            });

            var parentAttributeMetadata, childAttributeMetadata;
            if (attributeGroupMetadata._private) {
                parentAttributeMetadata = attributeGroupMetadata._private.parentAttribute;
                childAttributeMetadata = attributeGroupMetadata._private.childAttribute;
            }

            for (var k = 0; k < attributeGroupMetadata.attributes.length; k++) {
                var attributeMembershipMetadata = attributeGroupMetadata.attributes[k];
                var attributeMetadata = attributeMembershipMetadata.attribute;
                var attributeOrGroup;
                if (attributeMetadata.type === this.sina.AttributeType.Group) {
                    attributeOrGroup = this._addAttributeGroup(attributeMetadata, this._allAttributesMap);
                } else {
                    attributeOrGroup = this._allAttributesMap[attributeMetadata.id];
                }
                if (attributeOrGroup) {
                    var attributeGroupMembership = this.sina._createSearchResultSetItemAttributeGroupMembership({
                        group: group,
                        attribute: attributeOrGroup,
                        metadata: attributeMembershipMetadata
                    });
                    group.attributes.push(attributeGroupMembership);
                    attributeOrGroup.groups.push(attributeGroupMembership);
                }
                if (attributeMetadata == parentAttributeMetadata) {
                    group._private.parentAttribute = attributeOrGroup;
                } else if (attributeMetadata == childAttributeMetadata) {
                    group._private.childAttribute = attributeOrGroup;
                }


            }

            return group;
        }
    });
});
