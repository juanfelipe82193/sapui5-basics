// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, Promise */
sinaDefine(['../../core/core', '../../core/util', './typeConverter', '../../sina/AttributeType'], function (core, util, TypeConverter, AttributeType) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.intentsResolver = this.sina._createFioriIntentsResolver();
            this.suvNavTargetResolver = this.sina._createSuvNavTargetResolver();
            this.Exception = core.Exception.derive({
                _init: function (properties) {
                    core.Exception.prototype._init.apply(this, [properties]);
                }
            });
        },

        parse: function (searchQuery, data, log) {
            if (data.error && !data.value) {
                return core.Promise.reject(new this.Exception({
                    message: data.error.message,
                    description: 'Server-side Error',
                    previous: data.error
                }));
            }

            if (!data.value) {
                return Promise.resolve([]);
            }

            if (data.error) {
                log.addMessage(log.WARNING, 'Server-side Warning: ' + data.error.message);
            }

            var itemsData = data.value;
            var itemProms = [];
            for (var i = 0; i < itemsData.length; ++i) {
                var itemData = itemsData[i];
                var itemProm;
                try {
                    itemProm = this.parseItem(itemData);
                    itemProms.push(itemProm);
                } catch (e) {
                    log.addMessage(log.WARNING, 'Error occurred by parsing result item number ' + i + ': ' + e.message);
                }
            }
            return Promise.all(itemProms);
        },
        parseItem: function (itemData) {
            var titleAttributes = [];
            var detailAttributes = [];
            var titleDescriptionAttributes = [];
            var attribute;
            var allAttributes = {};
            //var whyFoundAttributes = [];
            var semanticObjectTypeAttributes = {};

            var entitySetName = itemData['@odata.context'];
            var posOfSeparator = entitySetName.lastIndexOf('#');
            if (posOfSeparator > -1) {
                entitySetName = entitySetName.slice(posOfSeparator + 1);
            }
            var dataSource = this.sina.getDataSource(entitySetName);

            var whyFounds = itemData['@com.sap.vocabularies.Search.v1.WhyFound'] || {};
            var metadata = {};
            var semanticObjectType = '';

            var suvAttributes = {};
            var suvAttribute, suvAttributeName, suvUrlAttribute, suvMimeTypeAttribute;
            var suvHighlightTerms = [];

            var fallbackDefaultNavigationTarget;
            var rankingScore = itemData["@com.sap.vocabularies.Search.v1.Ranking"];


            // parse attributes
            var itemDataStructured = this.preParseItem(itemData);

            for (var attributeName in itemDataStructured) {

                var structuredAttribute = itemDataStructured[attributeName];
                metadata = dataSource.getAttributeMetadata(attributeName);

                if (!metadata) {
                    throw 'unknown attribute ' + attributeName;
                }

                if (metadata.id == "LOC_4326") { //required to get maps to frontend // TODO move to metadata parser
                    metadata.usage = {
                        Detail: {
                            displayOrder: -1
                        }
                    };
                }

                // Input:
                // value
                // highlighted
                // snippets

                // Output:
                // value            = input.value 
                // valueFormatted   = TypeConverter(input.value)
                // valueHiglighted  =  
                // multiline: true => input.highlighted | input.snippet | why found
                // multiline: false => input.snippet | input.highlighted | why found

                var attrValue = TypeConverter.odata2Sina(metadata.type, structuredAttribute.value);

                var attrWhyFound;
                attrWhyFound = undefined;

                //processing for whyfound
                for (var attributeNameWhyfound in whyFounds) {
                    if (attributeNameWhyfound === attributeName && whyFounds[attributeNameWhyfound][0]) {
                        // replace attribue value with whyfound value
                        attrWhyFound = whyFounds[attributeNameWhyfound][0];
                        delete whyFounds[attributeNameWhyfound];
                    }
                }

                attrWhyFound = this.calculateValueHighlighted(structuredAttribute, metadata, attrWhyFound);

                var _calIsHighlighted = function (attrWhyFound) {
                    if (typeof attrWhyFound === 'string' && attrWhyFound.length > 0) {
                        return true;
                    }

                    if (Array.isArray(attrWhyFound) && attrWhyFound.length > 0) {
                        return true;
                    }

                    return false;
                };

                var valueString = typeof (attrValue) === "string" ? attrValue : JSON.stringify(attrValue);
                var valueStringHighlighted = attrWhyFound;

                attribute = this.sina._createSearchResultSetItemAttribute({
                    id: metadata.id,
                    label: metadata.label,
                    value: attrValue,
                    valueFormatted: valueString,
                    valueHighlighted: valueStringHighlighted,
                    isHighlighted: _calIsHighlighted(attrWhyFound),
                    metadata: metadata,
                    groups: []
                });

                util.appendRemovingDuplicates(suvHighlightTerms, util.extractHighlightedTerms(attribute.valueHighlighted));

                if (metadata.suvUrlAttribute && metadata.suvMimeTypeAttribute) {
                    suvUrlAttribute = allAttributes[metadata.suvUrlAttribute] || metadata.suvUrlAttribute.id;
                    suvMimeTypeAttribute = allAttributes[metadata.suvMimeTypeAttribute] || metadata.suvMimeTypeAttribute.id;
                    suvAttributes[metadata.id] = {
                        suvThumbnailAttribute: attribute,
                        suvTargetUrlAttribute: suvUrlAttribute,
                        suvTargetMimeTypeAttribute: suvMimeTypeAttribute
                    };
                }

                if (metadata.usage.Title) {
                    titleAttributes.push(attribute);
                }

                if (metadata.usage.TitleDescription) {
                    titleDescriptionAttributes.push(attribute);
                }


                if (metadata.usage.Detail) {
                    detailAttributes.push(attribute);
                }
                // if (!metadata.usage.Title && !metadata.usage.Detail && attribute.isHighlighted) {
                //     whyFoundAttributes.push(attribute);
                // }


                if (metadata.usage.Navigation) {
                    if (metadata.usage.Navigation.mainNavigation) {
                        fallbackDefaultNavigationTarget = this.sina._createNavigationTarget({
                            label: attribute.value,
                            targetUrl: attribute.value,
                            target: "_blank"
                        });
                    }
                }

                allAttributes[attribute.id] = attribute;

                semanticObjectType = dataSource.attributeMetadataMap[metadata.id]._private.semanticObjectType || '';
                if (semanticObjectType.length > 0) {
                    semanticObjectTypeAttributes[semanticObjectType] = attrValue;
                }
            }

            for (suvAttributeName in suvAttributes) {
                suvAttribute = suvAttributes[suvAttributeName];
                if (typeof suvAttribute.suvTargetUrlAttribute === "string") {
                    suvAttribute.suvTargetUrlAttribute = allAttributes[suvAttribute.suvTargetUrlAttribute];
                }
                if (typeof suvAttribute.suvTargetMimeTypeAttribute === "string") {
                    suvAttribute.suvTargetMimeTypeAttribute = allAttributes[suvAttribute.suvTargetMimeTypeAttribute];
                }
                if (!(suvAttribute.suvTargetUrlAttribute || suvAttribute.suvTargetMimeTypeAttribute)) {
                    delete suvAttributes[suvAttributeName];
                }
            }

            titleAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
            });

            detailAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
            });

            // Check whether there is still whyfoundattr remaining
            // If yes, it means hits in request attributes
            // Convert it to attribute and concat it to detailAttributes 
            // No display order normally, candidates for the additional line for whyfounds
            for (var restWhyfoundAttribute in whyFounds) {
                if (whyFounds[restWhyfoundAttribute][0]) {
                    metadata = dataSource.getAttributeMetadata(restWhyfoundAttribute);
                    var valueTemp = whyFounds[restWhyfoundAttribute][0];
                    var valueFormattedTemp = typeof (valueTemp) === "string" ? valueTemp : JSON.stringify(valueTemp);
                    attribute = this.sina._createSearchResultSetItemAttribute({
                        id: metadata.id || restWhyfoundAttribute,
                        label: metadata.label || restWhyfoundAttribute,
                        value: null,
                        valueFormatted: valueFormattedTemp,
                        valueHighlighted: valueFormattedTemp,
                        isHighlighted: true,
                        metadata: metadata
                    });
                    detailAttributes.push(attribute);
                    delete whyFounds[restWhyfoundAttribute];
                }
            }

            this.suvNavTargetResolver.resolveSuvNavTargets(dataSource, suvAttributes, suvHighlightTerms);


            var searchResultSetItem = this.sina._createSearchResultSetItem({
                dataSource: dataSource,
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: titleDescriptionAttributes,
                detailAttributes: detailAttributes,
                defaultNavigationTarget: fallbackDefaultNavigationTarget,
                navigationTargets: [],
                score: rankingScore
            });
            searchResultSetItem._private.allAttributesMap = allAttributes;
            searchResultSetItem._private.semanticObjectTypeAttributes = semanticObjectTypeAttributes;

            var itemPostParser = this.sina._createItemPostParser({
                searchResultSetItem: searchResultSetItem
            });
            return itemPostParser.postParseResultSetItem();
        },

        preParseItem: function (itemData) {
            var itemDataStructured = {};
            for (var originalPropertyName in itemData) {
                if (originalPropertyName[0] === '@' || originalPropertyName[0] === '_') {
                    continue;
                }
                var value = itemData[originalPropertyName];
                var propertyName;
                var splitted = originalPropertyName.split('@');
                propertyName = splitted[0];
                var substructure = itemDataStructured[propertyName];
                if (!substructure) {
                    substructure = {};
                    itemDataStructured[propertyName] = substructure;
                }
                if (splitted.length === 1) {
                    substructure.value = value;
                    continue;
                }
                if (splitted.length === 2) {
                    substructure[splitted[1]] = value;
                    continue;
                }
                throw 'more than two @ in property name';
            }
            return itemDataStructured;
        },

        _getFirstItemIfArray: function (value) {
            if (Array.isArray(value)) {
                value = value[0];
            }
            return value;
        },

        // valueHiglighted  =  
        // multiline: true => input.highlighted | input.snippet | why found
        // multiline: false => input.snippet | input.highlighted | why found
        calculateValueHighlighted: function (structuredAttribute, metadata, attrWhyFound) {
            var identifierHighlight = 'com.sap.vocabularies.Search.v1.Highlighted';
            var identifierSnippet = 'com.sap.vocabularies.Search.v1.Snippets';
            var value = '';
            if (metadata.format === 'MultilineText') {
                value = structuredAttribute[identifierHighlight];
                if (value) {
                    return this._getFirstItemIfArray(value);
                }
                value = structuredAttribute[identifierSnippet];
                if (value) {
                    return this._getFirstItemIfArray(value);
                }
                return attrWhyFound;
            }
            value = structuredAttribute[identifierSnippet];
            if (value) {
                return this._getFirstItemIfArray(value);
            }
            value = structuredAttribute[identifierHighlight];
            if (value) {
                return this._getFirstItemIfArray(value);
            }
            return this._getFirstItemIfArray(attrWhyFound);

        }


    });

});
