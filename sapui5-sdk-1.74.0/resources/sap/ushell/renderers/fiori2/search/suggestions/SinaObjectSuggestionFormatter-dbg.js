// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */

sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchNavigationObjectForSinaNavTarget'], function (SearchNavigationObjectForSinaNavTarget) {
    "use strict";

    var Formatter = function () {
        this.init.apply(this, arguments);
    };

    Formatter.prototype = {

        init: function () {},

        assembleLabel1: function (sinaSuggestion) {
            var title = [];
            var isHighlighted = false;
            var attribute;
            var titleAttributes = sinaSuggestion.object.titleAttributes;
            for (var i = 0; i < titleAttributes.length; ++i) {
                attribute = titleAttributes[i];
                title.push(attribute.valueHighlighted);
                if (attribute.isHighlighted) {
                    isHighlighted = true;
                }
            }
            return {
                label: title.join(' '),
                isHighlighted: isHighlighted
            };
        },

        assembleLabel2: function (label1IsHighlighted, sinaSuggestion) {

            var detailAttributes = sinaSuggestion.object.detailAttributes;
            var attribute;

            if (detailAttributes.length === 0) {
                return '';
            }

            if (!label1IsHighlighted) {
                attribute = this.getFirstHighlightedAttribute(detailAttributes);
                if (attribute) {
                    return attribute.valueHighlighted;
                }
            }

            attribute = this.getFirstStringAttribute(detailAttributes);
            if (attribute) {
                return attribute.label + ': ' + attribute.valueHighlighted;
            }

            return '';

        },

        getFirstHighlightedAttribute: function (attributes) {
            for (var i = 0; i < attributes.length; ++i) {
                var attribute = attributes[i];
                if (attribute.isHighlighted) {
                    return attribute;
                }
            }
        },

        getFirstStringAttribute: function (attributes) {
            var sortOrder = {
                "Date": 40,
                "Double": 70,
                "GeoJson": 130,
                "ImageBlob": 120,
                "ImageUrl": 110,
                "Integer": 60,
                "String": 10,
                "Time": 50,
                "Timestamp": 30
            };
            if (attributes.length === 0) {
                return null;
            }
            attributes = attributes.slice();
            attributes.sort(function (a1, a2) {
                return sortOrder[a1.metadata.type] - sortOrder[a2.metadata.type];
            });
            var attribute = attributes[0];
            if (sortOrder[attribute.metadata.type] > 100) {
                return null;
            }
            return attribute;
        },

        assembleNavigation: function (sinaSuggestion) {
            if (!sinaSuggestion.object.defaultNavigationTarget) {
                return null;
            }
            var navigationTarget = new SearchNavigationObjectForSinaNavTarget(sinaSuggestion.object.defaultNavigationTarget);
            navigationTarget.setLoggingType('OBJECT_SUGGESTION_NAVIGATE');
            return navigationTarget;
        },

        assembleImageUrl: function (sinaSuggestion) {
            var detailAttributes = sinaSuggestion.object.detailAttributes;
            for (var i = 0; i < detailAttributes.length; ++i) {
                var attribute = detailAttributes[i];
                if (attribute.metadata.type === attribute.sina.AttributeType.ImageUrl) {
                    return {
                        imageUrl: attribute.value,
                        imageExists: true,
                        imageIsCircular: attribute.metadata.format && attribute.metadata.format === sinaSuggestion.sina.AttributeFormatType.Round
                    };
                }
            }
            return {
                exists: false
            };
        },

        format: function (suggestionProvider, sinaSuggestion) {

            // create suggestion
            var suggestion = {
                key: sinaSuggestion.key,
                uiSuggestionType: sinaSuggestion.uiSuggestionType,
                dataSource: sinaSuggestion.object.dataSource
            };

            // assemble label
            var label1 = this.assembleLabel1(sinaSuggestion);
            suggestion.label1 = label1.label;

            // assemble second label (second line in UI)
            suggestion.label2 = this.assembleLabel2(label1.isHighlighted, sinaSuggestion);

            // assemble navigation target
            suggestion.titleNavigation = this.assembleNavigation(sinaSuggestion);

            // assemble image url
            var imageUrl = this.assembleImageUrl(sinaSuggestion);
            sinaSuggestion.sina.core.extend(suggestion, imageUrl);

            // position
            suggestion.position = sinaSuggestion.position;

            // add
            suggestionProvider.addSuggestion(suggestion);

        }

    };

    return Formatter;
});
