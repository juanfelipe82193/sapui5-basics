// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, Promise */
sinaDefine(['../../core/core', '../../core/util', './pivotTableParser', './typeConverter', '../tools/fiori/FioriIntentsResolver', '../../sina/NavigationTarget'], function (core, util, pivotTableParser, typeConverter, IntentsResolver, NavigationTarget) {
    "use strict";


    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.intentsResolver = this.sina._createFioriIntentsResolver();
        },

        parse: function (searchQuery, data) {
            var totalCount = this.parseTotalCount(data);
            data = pivotTableParser.parse(data);
            if (data.axes.length === 0) {
                return Promise.resolve({
                    totalCount: 0,
                    items: []
                });
            }
            var itemsData = data.axes[0];
            var itemProms = [];
            for (var i = 0; i < itemsData.length; ++i) {
                var itemData = itemsData[i];
                this.provider.metadataParser.parseSearchRequestMetadata(itemData);
                var itemProm = this.parseItem(itemData);
                itemProms.push(itemProm);
            }
            return Promise.all(itemProms).then(function (items) {
                return {
                    totalCount: totalCount,
                    items: items
                };
            });
        },

        parseTotalCount: function (data) {
            if (data.ItemLists && data.ItemLists[0] && data.ItemLists[0].TotalCount) {
                return data.ItemLists[0].TotalCount.Value;
            }
            return 0;
        },
        parseItem: function (itemData) {

            var titleAttributes = [];
            var detailAttributes = [];
            var semanticObjectTypeAttributes = [];

            var dataSource = this.sina.getDataSource(itemData.$$DataSourceMetaData$$[0].ObjectName);

            for (var m = 0; m < itemData.$$ResultItemAttributes$$.length; ++m) {

                var attributeData = itemData.$$ResultItemAttributes$$[m];
                var metadata = dataSource.getAttributeMetadata(attributeData.Name);

                var attribute = this.sina._createSearchResultSetItemAttribute({
                    id: attributeData.Name,
                    label: dataSource.getAttributeMetadata(attributeData.Name).label,
                    value: typeConverter.ina2Sina(metadata.type, attributeData.Value),
                    valueFormatted: attributeData.ValueFormatted || attributeData.Value,
                    valueHighlighted: attributeData.ValueFormatted || attributeData.Value,
                    isHighlighted: false,
                    metadata: metadata
                });

                if (metadata.usage.Title) {
                    titleAttributes.push(attribute);
                }
                if (metadata.usage.Detail) {
                    detailAttributes.push(attribute);
                }

                // TO DO maybe get metadata out of metadata buffer?
                for (var i = 0; i < itemData.$$AttributeMetadata$$.length; i++) {
                    var attributeMetadata = itemData.$$AttributeMetadata$$[i];
                    if (attributeMetadata.Name == attributeData.Name) {
                        if (attributeMetadata.SemanticObjectType && attributeMetadata.SemanticObjectType.length > 0) {
                            semanticObjectTypeAttributes.push({
                                name: attributeMetadata.SemanticObjectType,
                                value: attribute.value,
                                type: attribute.metadata.type
                            });
                        }
                        break;
                    }
                }
            }

            titleAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
            });

            detailAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
            });

            this.parseWhyFound(dataSource, titleAttributes, detailAttributes, itemData);

            var fallbackDefaultNavigationTarget;
            for (var k = 0; k < itemData.$$RelatedActions$$.length; ++k) {
                var relatedAction = itemData.$$RelatedActions$$[k];

                if (relatedAction.Type === "GeneralUri" || relatedAction.Type === "SAPNavigation") {
                    var label = relatedAction.Description;
                    var targetUrl = encodeURI(relatedAction.Uri);
                    fallbackDefaultNavigationTarget = this.sina._createNavigationTarget({
                        label: label,
                        targetUrl: targetUrl
                    });
                }
            }

            var semanticObjectType = itemData.$$DataSourceMetaData$$[0].SemanticObjectType;
            var systemId = itemData.$$DataSourceMetaData$$[0].SystemId;
            var client = itemData.$$DataSourceMetaData$$[0].Client;

            return this.intentsResolver.resolveIntents({
                semanticObjectType: semanticObjectType,
                semanticObjectTypeAttributes: semanticObjectTypeAttributes,
                systemId: systemId,
                client: client,
                fallbackDefaultNavigationTarget: fallbackDefaultNavigationTarget
            }).then(function (intents) {
                var defaultNavigationTarget = intents && intents.defaultNavigationTarget;
                var navigationTargets = intents && intents.navigationTargets;
                var item = this.sina._createSearchResultSetItem({
                    dataSource: dataSource,
                    titleAttributes: titleAttributes,
                    titleDescriptionAttributes: [],
                    detailAttributes: detailAttributes,
                    defaultNavigationTarget: defaultNavigationTarget,
                    navigationTargets: navigationTargets
                });
                return item;
            }.bind(this));
        },

        parseWhyFound: function (dataSource, titleAttributes, detailAttributes, itemData) {

            // 1. move why found to title and detail attributes
            var i, whyFound, whyFoundAttributeId, j, attribute;
            for (i = 0; i < itemData.$$WhyFound$$.length; i++) {
                whyFound = itemData.$$WhyFound$$[i];
                whyFoundAttributeId = this.getResponseAttributeId(dataSource, whyFound.Name);
                for (j = 0; j < titleAttributes.length; ++j) {
                    attribute = titleAttributes[j];
                    if (whyFoundAttributeId === attribute.id) {
                        whyFound.matched = true;
                        attribute.valueHighlighted = whyFound.Value;
                        attribute.isHighlighted = true;
                        break;
                    }
                }
                for (j = 0; j < detailAttributes.length; ++j) {
                    attribute = detailAttributes[j];
                    if (whyFoundAttributeId === attribute.id) {
                        whyFound.matched = true;
                        attribute.valueHighlighted = whyFound.Value;
                        attribute.isHighlighted = true;
                        break;
                    }
                }
            }

            // 2. for why founds without title or detail attribute: create artifical attribute and append to detail attributes
            for (i = 0; i < itemData.$$WhyFound$$.length; i++) {
                whyFound = itemData.$$WhyFound$$[i];
                if (whyFound.matched) {
                    continue;
                }
                whyFoundAttributeId = this.getResponseAttributeId(dataSource, whyFound.Name);
                var metadata = dataSource.getAttributeMetadata(whyFoundAttributeId);
                if (!metadata) {
                    throw new core.Exception('metadata misssing for ' + whyFoundAttributeId);
                }
                attribute = this.sina._createSearchResultSetItemAttribute({
                    id: metadata.id,
                    label: metadata.label,
                    value: null,
                    valueFormatted: util.filterString(whyFound.Value, ['<b>', '</b>']),
                    valueHighlighted: whyFound.Value,
                    isHighlighted: true,
                    metadata: metadata
                });
                detailAttributes.push(attribute);
            }

        },

        getResponseAttributeId: function (dataSource, requestAttributeId) {
            var requestAttributeMetadata = this.provider.getInternalMetadataAttribute(dataSource, requestAttributeId);
            if (!requestAttributeMetadata) {
                return requestAttributeId;
            }
            var responseAttributeMetadata = this.provider.getInternalMetadataAttribute(dataSource, requestAttributeMetadata.correspondingSearchAttributeName);
            if (!responseAttributeMetadata) {
                return requestAttributeId;
            }
            return responseAttributeMetadata.Name;
        }

    });

});
