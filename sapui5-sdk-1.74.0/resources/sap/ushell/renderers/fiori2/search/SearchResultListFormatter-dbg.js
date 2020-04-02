// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */
// iteration 0 ok

/* eslint no-fallthrough: 0 */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchConfiguration',
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/SearchNavigationObject',
    'sap/ushell/renderers/fiori2/search/SearchNavigationObjectForSinaNavTarget'
], function (SearchConfiguration, SearchHelper, SearchNavigationObject, SearchNavigationObjectForSinaNavTarget) {
    "use strict";

    var module = sap.ushell.renderers.fiori2.search.SearchResultListFormatter = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = {
        init: function () {},

        format: function (searchResultSet, terms, options) {
            options = options || {};
            options.suppressHighlightedValues = options.suppressHighlightedValues || false;

            var sina = searchResultSet.sina;

            var layoutCache = {};
            var formattedResultItems = [];

            var resultItems = searchResultSet.items;

            var i, z;

            for (i = 0; i < resultItems.length; i++) {
                var resultItem = resultItems[i];

                var formattedResultItem = {};
                var aItemAttributes = [];

                for (z = 0; z < resultItem.detailAttributes.length; z++) {
                    var detailAttribute = resultItem.detailAttributes[z];
                    var attributeValue = detailAttribute.value;

                    switch (detailAttribute.metadata.type) {
                    case sina.AttributeType.ImageBlob:
                        if (attributeValue && attributeValue.trim().length > 0) {
                            attributeValue = "data:;base64," + attributeValue;
                        }
                    case sina.AttributeType.ImageUrl:
                        formattedResultItem.imageUrl = attributeValue;
                        formattedResultItem.imageFormat = detailAttribute.metadata.format ? detailAttribute.metadata.format.toLowerCase() : undefined;
                        if (detailAttribute.defaultNavigationTarget) {
                            formattedResultItem.imageNavigation = new SearchNavigationObjectForSinaNavTarget(detailAttribute.defaultNavigationTarget);
                        }
                        break;
                    case sina.AttributeType.GeoJson:
                        formattedResultItem.geoJson = {
                            value: attributeValue,
                            label: (resultItem.title || detailAttribute.label)
                        };
                        break;
                    case sina.AttributeType.Group:
                        var attributeGroupAsAttribute = this._formatAttributeGroup(detailAttribute, options, /*index*/ z);
                        aItemAttributes.push(attributeGroupAsAttribute);
                        break;
                    case sina.AttributeType.Double:
                    case sina.AttributeType.Integer:
                    case sina.AttributeType.String:
                    case sina.AttributeType.Date:
                    case sina.AttributeType.Time:
                    case sina.AttributeType.Timestamp:
                        var oItemAttribute = this._formatSingleAttribute(detailAttribute, options, /*index*/ z);
                        aItemAttributes.push(oItemAttribute);
                        break;
                    }
                }

                formattedResultItem.key = resultItem.key;
                formattedResultItem.keystatus = resultItem.keystatus;

                formattedResultItem.dataSource = resultItem.dataSource;
                formattedResultItem.dataSourceName = resultItem.dataSource.label;


                if (resultItem.titleAttributes) {
                    var titleAttribute, formattedTitleAttribute, formattedTitle;
                    var title = [];
                    for (z = 0; z < resultItem.titleAttributes.length; z++) {
                        titleAttribute = resultItem.titleAttributes[z];
                        if (titleAttribute.metadata.type === sina.AttributeType.Group) {
                            formattedTitleAttribute = this._formatAttributeGroup(titleAttribute, options, /*index*/ z);
                        } else {
                            formattedTitleAttribute = this._formatSingleAttribute(titleAttribute, options, /*index*/ z);
                        }
                        formattedTitle = formattedTitleAttribute.value;
                        title.push(formattedTitle);
                    }
                    formattedResultItem.title = title.join(' ');
                } else {
                    formattedResultItem.title = options.suppressHighlightedValues ? resultItem.title : resultItem.titleHighlighted;
                }


                if (resultItem.titleDescriptionAttributes) {
                    var titleDescriptionAttribute, formattedTitleDescriptionAttribute, formattedTitleDescription;
                    var titleDescription = [];
                    var titleDescriptionLabel = [];
                    for (z = 0; z < resultItem.titleDescriptionAttributes.length; z++) {
                        titleDescriptionAttribute = resultItem.titleDescriptionAttributes[z];
                        if (titleDescriptionAttribute.metadata.type === sina.AttributeType.Group) {
                            formattedTitleDescriptionAttribute = this._formatAttributeGroup(titleDescriptionAttribute, options, /*index*/ z);
                        } else {
                            formattedTitleDescriptionAttribute = this._formatSingleAttribute(titleDescriptionAttribute, options, /*index*/ z);
                        }
                        formattedTitleDescription = formattedTitleDescriptionAttribute.value;
                        titleDescription.push(formattedTitleDescription);
                        titleDescriptionLabel.push(formattedTitleDescriptionAttribute.name);
                    }
                    formattedResultItem.titleDescription = titleDescription.join(' ');
                    formattedResultItem.titleDescriptionLabel = titleDescriptionLabel.join(' ');
                }


                formattedResultItem.itemattributes = aItemAttributes;

                if (resultItem.defaultNavigationTarget) {
                    formattedResultItem.titleNavigation = new SearchNavigationObjectForSinaNavTarget(resultItem.defaultNavigationTarget);
                    if (!formattedResultItem.title || formattedResultItem.title.length === 0) {
                        formattedResultItem.title = resultItem.defaultNavigationTarget.label;
                    }
                }

                if (resultItem.navigationTargets && resultItem.navigationTargets.length > 0) {
                    formattedResultItem.navigationObjects = [];
                    for (var j = 0; j < resultItem.navigationTargets.length; j++) {
                        var navigationTarget = new SearchNavigationObjectForSinaNavTarget(resultItem.navigationTargets[j]);
                        navigationTarget.setLoggingType('RESULT_LIST_ITEM_NAVIGATE_CONTEXT');
                        formattedResultItem.navigationObjects.push(navigationTarget);
                    }
                }

                var layoutCacheForItemType = layoutCache[resultItem.dataSource.id] || {};
                layoutCache[resultItem.dataSource.id] = layoutCacheForItemType;
                formattedResultItem.layoutCache = layoutCacheForItemType;

                formattedResultItem.selected = formattedResultItem.selected || false;
                formattedResultItem.expanded = formattedResultItem.expanded || false;

                var additionalParameters = {};
                this._formatResultForDocuments(resultItem, additionalParameters);
                this._formatResultForNotes(resultItem, additionalParameters);
                formattedResultItem.additionalParameters = additionalParameters;

                formattedResultItem.positionInList = i;
                formattedResultItem.resultSetId = searchResultSet.id;

                formattedResultItems.push(formattedResultItem);
            }

            return formattedResultItems;
        },

        _formatAttributeGroup: function (attributeGroup, options, index) {
            var attributeGroupAsAttribute = {};
            var attributes = {};
            attributeGroupAsAttribute.name = attributeGroup.label;
            var isWhyFound = false;
            var isLongtext = false;

            var privateGroupMetadata = attributeGroup.metadata._private;
            var parentAttribute, childAttribute;

            // for (var attributeName in attributeGroup.attributes) {
            for (var i = 0; i < attributeGroup.attributes.length; i++) {

                // var _attribute = attributeGroup.attributes[attributeName].attribute;

                var attributeGroupMembership = attributeGroup.attributes[i];
                var _attribute = attributeGroupMembership.attribute;
                var attributeNameInGroup = attributeGroupMembership.metadata.nameInGroup;

                var _formattedAttribute;
                if (_attribute.metadata.type === _attribute.sina.AttributeType.Group) {
                    _formattedAttribute = this._formatAttributeGroup(_attribute, options, index);
                } else {
                    _formattedAttribute = this._formatSingleAttribute(_attribute, options, index);
                }

                if (privateGroupMetadata) {
                    if (privateGroupMetadata.parentAttribute === _attribute.metadata) {
                        parentAttribute = _formattedAttribute;
                    } else if (privateGroupMetadata.childAttribute === _attribute.metadata) {
                        childAttribute = _formattedAttribute;
                    }
                }

                // attributes[attributeGroup.attributes[attributeName].attribute.nameInGroup] = _formattedAttribute;
                if (_formattedAttribute.value !== undefined && _formattedAttribute.value.length > 0) {
                    attributes[attributeNameInGroup] = _formattedAttribute;
                    isWhyFound = isWhyFound || _formattedAttribute.whyfound;
                    isLongtext = isLongtext || _formattedAttribute.longtext !== undefined;
                }
            }

            attributeGroupAsAttribute.value = "";
            attributeGroupAsAttribute.valueRaw = undefined;
            attributeGroupAsAttribute.valueWithoutWhyfound = "";
            attributeGroupAsAttribute.whyfound = false;

            if (Object.keys(attributes).length > 0) {

                var regularFormatting = true;

                if (privateGroupMetadata && parentAttribute && childAttribute && (privateGroupMetadata.isUnitOfMeasure || privateGroupMetadata.isCurrency || privateGroupMetadata.isDescription)) {

                    var parentAttributeValue = parentAttribute.value;
                    var childAttributeValue = childAttribute.value;

                    parentAttributeValue = parentAttributeValue !== undefined && parentAttributeValue.trim().length > 0 ? parentAttributeValue : undefined;
                    childAttributeValue = childAttributeValue !== undefined && childAttributeValue.trim().length > 0 ? childAttributeValue : undefined;

                    if (!(parentAttributeValue && childAttributeValue)) {
                        if (privateGroupMetadata.isUnitOfMeasure || privateGroupMetadata.isCurrency) {
                            if (parentAttributeValue && !childAttributeValue) {
                                attributeGroupAsAttribute.value = parentAttribute.value;
                                attributeGroupAsAttribute.valueRaw = parentAttribute.valueRaw;
                                attributeGroupAsAttribute.valueWithoutWhyfound = parentAttribute.valueWithoutWhyfound;
                                regularFormatting = false;
                            }
                        } else if (privateGroupMetadata.isDescription) {
                            var textArrangement = privateGroupMetadata.textArrangement;
                            var sina = attributeGroup.sina;

                            if (textArrangement === sina.AttributeGroupTextArrangement.TextFirst) {
                                if (!parentAttributeValue && childAttributeValue) {
                                    attributeGroupAsAttribute.value = childAttribute.value;
                                    attributeGroupAsAttribute.valueRaw = childAttribute.valueRaw;
                                    attributeGroupAsAttribute.valueWithoutWhyfound = childAttribute.valueWithoutWhyfound;
                                    regularFormatting = false;
                                }
                            } else if (textArrangement === sina.AttributeGroupTextArrangement.TextLast) {
                                if (parentAttributeValue && !childAttributeValue) {
                                    attributeGroupAsAttribute.value = parentAttribute.value;
                                    attributeGroupAsAttribute.valueRaw = parentAttribute.valueRaw;
                                    attributeGroupAsAttribute.valueWithoutWhyfound = parentAttribute.valueWithoutWhyfound;
                                    regularFormatting = false;
                                }
                            } else if (textArrangement === sina.AttributeGroupTextArrangement.TextOnly) {
                                if (!childAttributeValue) {
                                    regularFormatting = false;
                                }
                            }
                        }
                    }
                }

                if (regularFormatting) {
                    attributeGroupAsAttribute.value = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "value");
                    attributeGroupAsAttribute.valueRaw = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "valueRaw");
                    attributeGroupAsAttribute.valueWithoutWhyfound = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "valueWithoutWhyfound");
                }

                attributeGroupAsAttribute.whyfound = isWhyFound;
            }

            attributeGroupAsAttribute.key = attributeGroup.id;
            attributeGroupAsAttribute.isTitle = false; // used in table view
            attributeGroupAsAttribute.isSortable = attributeGroup.metadata.isSortable; // used in table view
            attributeGroupAsAttribute.attributeIndex = index; // used in table view
            attributeGroupAsAttribute.displayOrder = attributeGroup.metadata.usage.Detail && attributeGroup.metadata.usage.Detail.displayOrder;


            if (isLongtext) {
                attributeGroupAsAttribute.longtext = attributeGroupAsAttribute.value;
            }

            return attributeGroupAsAttribute;
        },

        _formatSingleAttribute: function (detailAttribute, options, index) {
            var oItemAttribute = {};
            var sina = detailAttribute.sina;

            oItemAttribute.name = detailAttribute.label;
            oItemAttribute.valueRaw = detailAttribute.value;
            oItemAttribute.value = options.suppressHighlightedValues ? detailAttribute.valueFormatted : detailAttribute.valueHighlighted;
            oItemAttribute.valueWithoutWhyfound = detailAttribute.valueFormatted; //result[propDisplay].valueWithoutWhyfound;

            // if (detailAttribute.isHighlighted && detailAttribute.metadata.type.toLowerCase() === "longtext") {
            //     // mix snippet into longtext values
            //     var valueHighlighted = detailAttribute.valueHighlighted;
            //     valueHighlighted = valueHighlighted.replace(/(^[.][.][.])|([.][.][.]$)/, "").trim();
            //     var valueUnHighlighted = valueHighlighted.replace(/[<]([/])?b[>]/g, "");
            //     oItemAttribute.value = detailAttribute.valueFormatted.replace(valueUnHighlighted, valueHighlighted);
            // }

            oItemAttribute.key = detailAttribute.id;
            oItemAttribute.isTitle = false; // used in table view
            oItemAttribute.isSortable = detailAttribute.metadata.isSortable; // used in table view
            oItemAttribute.attributeIndex = index; // used in table view
            oItemAttribute.displayOrder = detailAttribute.metadata.usage.Detail && detailAttribute.metadata.usage.Detail.displayOrder;
            oItemAttribute.whyfound = detailAttribute.isHighlighted;
            if (detailAttribute.defaultNavigationTarget) {
                oItemAttribute.defaultNavigationTarget = new SearchNavigationObjectForSinaNavTarget(detailAttribute.defaultNavigationTarget);
            }
            // oItemAttribute.hidden = detailAttribute.metadata.hidden;

            if (detailAttribute.metadata.format && (detailAttribute.metadata.format === sina.AttributeFormatType.MultilineText || detailAttribute.metadata.format === sina.AttributeFormatType.Longtext)) {
                oItemAttribute.longtext = detailAttribute.value;
            }

            return oItemAttribute;
        },

        _formatBasedOnGroupTemplate: function (template, attributes, valuePropertyName) {
            if (!(template && attributes && valuePropertyName)) {
                return "";
            }
            var value = "",
                pos = 0;
            var match, regex = /{\w+}/gi;
            while ((match = regex.exec(template)) !== null) {
                value += template.substring(pos, match.index);
                var attributeName = match[0].slice(1, -1);
                value += attributes[attributeName] && attributes[attributeName][valuePropertyName] || "";
                pos = regex.lastIndex;
            }
            value += template.substring(pos);
            return value;
        },

        _formatResultForDocuments: function (resultItem, additionalParameters) {
            var keyFields = '';
            additionalParameters.isDocumentConnector = false;

            var j, detailAttribute;
            for (j = 0; j < resultItem.detailAttributes.length; j++) {
                detailAttribute = resultItem.detailAttributes[j];

                if (detailAttribute.metadata.id === 'FILE_PROPERTY') {
                    additionalParameters.isDocumentConnector = true;
                }

                if (detailAttribute.metadata.isKey === true) {
                    if (keyFields.length > 0) {
                        keyFields += ';';
                    }
                    keyFields = keyFields + detailAttribute.metadata.id + '=' + detailAttribute.value; //encodeURIComponent(result[prop].valueRaw);
                }
            }

            //fileloader
            if (additionalParameters.isDocumentConnector === true) {
                var sidClient = ';o=sid(' + resultItem.dataSource.system + '.' + resultItem.dataSource.client + ')';

                var connectorName = resultItem.dataSource.id;
                additionalParameters.imageUrl = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='ThumbNail',SelectionParameters='" + keyFields + "')/$value";
                additionalParameters.titleUrl = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='BinaryContent',SelectionParameters='" + keyFields + "')/$value";
                // var suvlink = "/sap/opu/odata/SAP/ESH_SEARCH_SRV/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='SUVFile',SelectionParameters='PHIO_ID=" + resultItem.PHIO_ID.valueRaw + "')/$value?sap-client=" + client;
                // var suvlink = '/sap-pdfjs/web/viewer.html?file=' + encodeURIComponent(suvlink);
                var suvlink = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='SUVFile',SelectionParameters='" + keyFields + "')/$value";
                additionalParameters.suvlink = '/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file=' + encodeURIComponent(suvlink);

                if (!resultItem.navigationObjects) {
                    resultItem.navigationObjects = [];
                }
                var navigationTarget = new SearchNavigationObject({
                    text: "Show Document",
                    href: additionalParameters.suvlink,
                    target: "_blank"
                });
                resultItem.navigationObjects.push(navigationTarget);

                for (j = 0; j < resultItem.detailAttributes.length; j++) {
                    detailAttribute = resultItem.detailAttributes[j];
                    if (detailAttribute.id === "PHIO_ID_THUMBNAIL" && detailAttribute.value) {
                        additionalParameters.containsThumbnail = true;
                    }
                    if (detailAttribute.id === "PHIO_ID_SUV" && detailAttribute.value) {
                        additionalParameters.containsSuvFile = true;
                    }
                }
            }
        },

        _formatResultForNotes: function (resultItem, additionalParameters) {

        }
    };

    return module;
});
