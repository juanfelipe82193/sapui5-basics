// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/// iteration 0 : Holger
/* global $ */

/* eslint complexity: 0 */
/* eslint space-in-parens: 0 */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/controls/SearchText',
    'sap/ushell/renderers/fiori2/search/controls/SearchLink',
    'sap/ushell/renderers/fiori2/search/controls/twitter/SearchTweet',
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/controls/SearchRelatedObjectsToolbar',
    'sap/ushell/renderers/fiori2/search/SearchModel'
], function (SearchText, SearchLink, SearchTweet, SearchHelper, SearchRelatedObjectsToolbar, SearchModel) {
    "use strict";

    var noValue = '\u2013'; // dash

    return sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListItem", {
        // the control API:
        metadata: {
            properties: {
                dataSource: "object", // sina data source
                itemId: "string",
                title: "string",
                titleDescription: "string",
                titleNavigation: "object",
                geoJson: "object",
                type: "string",
                imageUrl: "string",
                imageFormat: "string",
                imageNavigation: "object",
                attributes: {
                    type: "object",
                    multiple: true
                },
                navigationObjects: {
                    type: "object",
                    multiple: true
                },
                selected: "boolean",
                expanded: "boolean",
                parentListItem: "object",
                additionalParameters: "object",
                positionInList: "int",
                resultSetId: "string",
                layoutCache: "object",
                totalCountHiddenElement: "object"
            },
            aggregations: {
                _titleLink: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchLink",
                    multiple: false,
                    visibility: "hidden"
                },
                _titleLinkDescription: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchText",
                    multiple: false,
                    visibility: "hidden"
                },
                _titleDelimiter: {
                    type: "sap.m.Text",
                    multiple: false,
                    visibility: "hidden"
                },
                _typeText: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchText",
                    multiple: false,
                    visibility: "hidden"
                },
                _typeLink: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchLink",
                    multiple: false,
                    visibility: "hidden"
                },
                _typeLinkAriaDescription: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden"
                },
                _multiLineDescriptionText: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchText",
                    multiple: false,
                    visibility: "hidden"
                },
                _multiLineDescriptionTweet: {
                    type: "sap.ushell.renderers.fiori2.search.controls.twitter.SearchTweet",
                    multiple: false,
                    visibility: "hidden"
                },
                _selectionCheckBox: {
                    type: "sap.m.CheckBox",
                    multiple: false,
                    visibility: "hidden"
                },
                _expandButton: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                },
                _attributeLabels: {
                    type: "sap.m.Label",
                    multiple: true,
                    visibility: "hidden"
                },
                _attributeValues: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    visibility: "hidden"
                },
                _attributeValuesWithoutWhyfoundHiddenTexts: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: true,
                    visibility: "hidden"
                },
                _relatedObjectActionsToolbar: {
                    type: "sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar",
                    multiple: false,
                    visibility: "hidden"
                },
                _titleLabeledByText: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden"
                },
                _attributesLabeledByText: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden"
                },
                _expandStateLabeledByText: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },

        init: function () {
            var that = this;

            if (sap.ui.core.Control.prototype.init) { // check whether superclass implements the method
                sap.ui.core.Control.prototype.init.apply(this, arguments); // call the method with the original arguments
            }

            that.setAggregation("_titleLink", new SearchLink({})
                .addStyleClass("sapUshellSearchResultListItem-HeaderEntry")
                .addStyleClass("sapUshellSearchResultListItem-Title")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow")
                .attachPress(function (oEvent) {
                    var phoneSize = that._getPhoneSize();
                    var windowWidth = $(window).width();
                    if (windowWidth <= phoneSize) {
                        // On phone devices the whole item is clickable.
                        // See click-handler in onAfterRendering below.
                        oEvent.preventDefault();
                        oEvent.cancelBubble();
                        that._performTitleNavigation();
                    } else {
                        that._performTitleNavigation({
                            trackingOnly: true
                        });
                    }
                }));

            that.setAggregation("_titleLinkDescription", new SearchText({})
                .addStyleClass("sapUshellSearchResultListItem-HeaderEntry")
                .addStyleClass("sapUshellSearchResultListItem-TitleDescription")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow"));

            var titleDelimiter = new sap.m.Text({
                text: "|"
            });
            titleDelimiter.addEventDelegate({
                onAfterRendering: function (event) {
                    $(this.getDomRef()).attr("aria-hidden", "true");
                }.bind(titleDelimiter)
            });
            that.setAggregation("_titleDelimiter", titleDelimiter
                .addStyleClass("sapUshellSearchResultListItem-HeaderEntry")
                .addStyleClass("sapUshellSearchResultListItem-TitleDelimiter")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow"));

            that.setAggregation("_typeText", new SearchText()
                .addStyleClass("sapUshellSearchResultListItem-HeaderEntry")
                .addStyleClass("sapUshellSearchResultListItem-TitleCategory")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow"));

            that.setAggregation("_typeLinkAriaDescription", new sap.ui.core.InvisibleText({
                text: sap.ushell.resources.i18n.getText("result_list_item_type_link_description")
            }));
            that.setAggregation("_typeLink", new sap.ushell.renderers.fiori2.search.controls.SearchLink({
                    // press: function (oEvent) {
                    //     that.getModel().setDataSource(that.getDataSource());
                    // }
                }).addStyleClass("sapUshellSearchResultListItem-HeaderEntry")
                .addStyleClass("sapUshellSearchResultListItem-TitleCategoryLink")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow")
                .addAriaDescribedBy(that.getAggregation("_typeLinkAriaDescription")));

            that.setAggregation("_multiLineDescriptionText", new SearchText({
                    maxLines: 5
                }).addStyleClass("sapUshellSearchResultListItem-MultiLineDescription")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow")
                .data("islongtext", "true", true));

            that.setAggregation("_multiLineDescriptionTweet", new SearchTweet({
                    //maxLines: 5 // property not supported by SearchTweet control
                }).addStyleClass("sapUshellSearchResultListItem-MultiLineDescription")
                .addStyleClass("sapUshellSearchResultListItem-MightOverflow")
                .data("islongtext", "true", true));

            that.setAggregation("_selectionCheckBox", new sap.m.CheckBox({
                select: function (oEvent) {
                    that.setProperty("selected", oEvent.getParameters().selected, true /*no re-rendering needed, change originates in HTML*/ ); //see section Properties for explanation
                }
            }));

            that.setAggregation("_expandButton", new sap.m.Button({
                type: sap.m.ButtonType.Transparent,
                press: function (oEvent) {
                    that.toggleDetails();
                }
            }));

            that.setAggregation("_relatedObjectActionsToolbar", new SearchRelatedObjectsToolbar()
                .addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar"));

            that.setAggregation("_titleLabeledByText", new sap.ui.core.InvisibleText());

            that.setAggregation("_attributesLabeledByText", new sap.ui.core.InvisibleText());

            that.setAggregation("_expandStateLabeledByText", new sap.ui.core.InvisibleText());
        },

        renderer: function (oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            oControl._renderer(oRm);
        },

        // the part creating the HTML:
        _renderer: function (oRm) {

            this._registerItemPressHandler();

            this._resetPrecalculatedValues();
            this._renderContainer(oRm);
            this._renderAccessibilityInformation(oRm);
        },

        _renderContainer: function (oRm) {
            var that = this;

            oRm.write('<div');
            oRm.writeControlData(that); // writes the Control ID
            oRm.addClass("sapUshellSearchResultListItem-Container");
            if (that.getImageUrl()) {
                oRm.addClass("sapUshellSearchResultListItem-WithImage");
            }
            if (that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail") {
                oRm.addClass("sapUshellSearchResultListItem-Document");
            }
            oRm.writeClasses(); // this call writes the above class plus enables support for Square.addStyleClass(...)
            //             oRm.write(' tabindex="0"');
            oRm.write('>');

            that._renderContentContainer(oRm);
            that._renderExpandButtonContainer(oRm);

            oRm.write('</div>');
        },


        _renderContentContainer: function (oRm) {
            oRm.write('<div class="sapUshellSearchResultListItem-Content">');

            this._renderTitleContainer(oRm);
            this._renderAttributesContainer(oRm);

            oRm.write('</div>');
        },

        _renderExpandButtonContainer: function (oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-ExpandButtonContainer">');

            oRm.write('<div class="sapUshellSearchResultListItem-ExpandButton">');

            var icon, tooltip;
            var expanded = that.getProperty("expanded");
            if (expanded) {
                icon = sap.ui.core.IconPool.getIconURI("slim-arrow-up");
                tooltip = sap.ushell.resources.i18n.getText("hideDetailBtn_tooltip");
            } else {
                icon = sap.ui.core.IconPool.getIconURI("slim-arrow-down");
                tooltip = sap.ushell.resources.i18n.getText("showDetailBtn_tooltip");
            }

            var expandButton = that.getAggregation("_expandButton");
            expandButton.setIcon(icon);
            expandButton.setTooltip(tooltip);

            expandButton.addEventDelegate({
                onAfterRendering: function () {
                    that.setAriaExpandedState();
                }
            });

            oRm.renderControl(expandButton);

            oRm.write('</div>');
            oRm.write('</div>');
        },


        _renderTitleContainer: function (oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-TitleAndImageContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-TitleContainer">');

            that._renderCheckbox(oRm);

            /// /// Title
            var titleUrl = "";
            var target;

            var titleLink = that.getAggregation("_titleLink");

            var titleText = that.getTitle();
            if (!titleText || titleText.trim().length === 0) {
                titleText = noValue;
            } else {
                var titleNavigation = that.getTitleNavigation();
                if (titleNavigation) {
                    titleUrl = titleNavigation.getHref();
                    target = titleNavigation.getTarget();
                }
                titleLink.setHref(titleUrl);

                if (target) {
                    titleLink.setTarget(target);
                }
            }

            titleLink.setText(titleText);

            if (titleUrl.length === 0) {
                titleLink.setEnabled(false);
            }

            // if the title contains highlighted text, the forward ellipsis might have to be calculated correctly after rendering
            titleLink.addEventDelegate({
                onAfterRendering: function () {
                    that.forwardEllipsis($(titleLink.getDomRef()));
                }
            });

            oRm.renderControl(titleLink);

            /// /// Sub-Title aka Title Description
            var titleDescription = that.getTitleDescription();
            if (titleDescription && titleDescription.trim().length > 0) {
                var titleLinkDescription = that.getAggregation("_titleLinkDescription");
                titleLinkDescription.setText(titleDescription);
                oRm.renderControl(titleLinkDescription);
            }

            /// /// Delimiter between title and sub-title or object type
            var titleDelimiter = that.getAggregation("_titleDelimiter");
            oRm.renderControl(titleDelimiter);

            /// /// Object Type
            if (!that.getModel().config._eshClickableObjectType || that.getModel().getDataSource() === that.getDataSource()) {
                var typeText = that.getAggregation("_typeText");
                typeText.setText(that.getType());
                oRm.renderControl(typeText);
            } else {
                var uiFilterClone = this.getModel().getProperty('/uiFilter').clone();
                uiFilterClone.setDataSource(that.getDataSource());
                var href = that.getModel().searchUrlParser.renderFromParameters(this.getModel().boTopDefault, uiFilterClone, true);
                var typeLink = that.getAggregation("_typeLink");
                typeLink.setText(that.getType());
                typeLink.setHref(href);
                typeLink.setTooltip(sap.ushell.resources.i18n.getText("searchInDataSourceTooltip", [that.getDataSource().labelPlural]));
                oRm.renderControl(that.getAggregation("_typeLinkAriaDescription"));
                oRm.renderControl(typeLink);
            }

            oRm.write('</div>');

            that._renderImageForPhone(oRm);
            // that._renderImageForDocument(oRm);

            oRm.write('</div>');
        },

        _renderCheckbox: function (oRm) {
            var that = this;
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxExpandContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxAlignmentContainer">');

            var checkbox = that.getAggregation("_selectionCheckBox");
            var selected = that.getProperty("selected");
            checkbox.setSelected(selected);
            oRm.renderControl(checkbox);

            oRm.write('</div>');
            oRm.write('</div>');
            oRm.write('</div>');
        },


        _renderImageForPhone: function (oRm) {
            var that = this;
            if (that.getImageUrl()) {

                oRm.write('<div class="sapUshellSearchResultListItem-TitleImage');
                if (this.getImageFormat() === "round") {
                    oRm.write(" sapUshellSearchResultListItem-ImageContainerRound");
                }
                oRm.write('">');

                oRm.write('<div class="sapUshellSearchResultListItem-ImageContainerAlignmentHelper"></div>');

                oRm.write('<img class="sapUshellSearchResultListItem-Image" src="');
                oRm.write(that.getImageUrl());
                oRm.write('">');

                oRm.write('</div>');
            }
        },

        _renderImageForDocument: function (oRm) {
            var that = this;
            if (that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail") {

                var imageNavigation = this.getImageNavigation();
                var imageNavigationUrl = imageNavigation ? imageNavigation.getHref() : "";

                var divOrLinkStart, divOrLinkEnd;

                if (imageNavigationUrl && imageNavigationUrl.length > 0) {
                    divOrLinkStart = '<a href="' + imageNavigationUrl + '"';
                    divOrLinkEnd = '</a>';
                } else {
                    divOrLinkStart = '<div';
                    divOrLinkEnd = '</div>';
                }

                oRm.write('<div class="sapUshellSearchResultListItem-DocumentThumbnailContainer">');
                oRm.write(divOrLinkStart + ' class="sapUshellSearchResultListItem-DocumentThumbnailBorder">');

                oRm.write('<div class="sapUshellSearchResultListItem-DocumentThumbnail-DogEar"></div>');

                var oZoomIcon = new sap.ui.core.Icon({
                    src: sap.ui.core.IconPool.getIconURI("search"),
                    useIconTooltip: false
                });
                oZoomIcon.addStyleClass("sapUshellSearchResultListItem-DocumentThumbnailZoomIcon");
                oRm.renderControl(oZoomIcon);

                var imageUrl = that.getImageUrl();
                if (imageUrl && imageUrl.length > 0) {
                    oRm.write('<img class="sapUshellSearchResultListItem-DocumentThumbnail" src="');
                    oRm.write(that.getImageUrl());
                    oRm.write('">');
                } // else: is there a placeholder image that could be shown instead?

                oRm.write(divOrLinkEnd);
                oRm.write('</div>');
            }
        },

        _cutDescrAttributeOutOfAttributeList: function () {
            var attributes = this.getAttributes();
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                if (attribute.longtext) {
                    attributes.splice(i, 1);
                    this.setAttributes(attributes);
                    return attribute;
                }
            }
            return undefined;
        },

        _renderMultiLineDescription: function (oRm) {
            var that = this;
            if (that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail") { // for the time being, only render multiline attribute, if this is a document result item
                var description = this._cutDescrAttributeOutOfAttributeList();
                if (description && description.value && description.value.length > 0) {

                    // oRm.write('<div class="sapUshellSearchResultListItem-MultiLineDescription">');
                    var descriptionText;

                    if (this._isTweet(description)) {

                        descriptionText = that.getAggregation("_multiLineDescriptionTweet");
                    } else {
                        descriptionText = that.getAggregation("_multiLineDescriptionText");
                    }
                    descriptionText.setText(description.value);

                    if (description.whyfound) {
                        descriptionText.data("ishighlighted", "true", true);
                        //descriptionText.addStyleClass("sapUshellSearchResultListItem-AttributeValueHighlighted");
                    } else {
                        descriptionText.data("ishighlighted", "false", true);
                    }

                    if (description.valueWithoutWhyfound) {
                        // for attribute values with why-found information, use the raw value information (without why-found-tags) for tooltip and ARIA description
                        var hiddenValueText = new sap.ui.core.InvisibleText({});
                        hiddenValueText.setText(description.valueWithoutWhyfound);
                        descriptionText.data("tooltippedBy", hiddenValueText.getId(), true);
                        descriptionText.addEventDelegate({
                            onAfterRendering: function () {
                                var $descriptionText = $(descriptionText.getDomRef());
                                $descriptionText.attr("aria-describedby", $descriptionText.attr("data-tooltippedby"));
                            }
                        });
                        that.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts", hiddenValueText, true /* do not invalidate this object */ );
                        oRm.renderControl(hiddenValueText);
                    }
                    oRm.renderControl(descriptionText);

                    // oRm.write('</div>');
                } else {
                    oRm.write('<div class="sapUshellSearchResultListItem-MultiLineDescription"></div>');
                }
            }
        },

        _renderAttributesContainer: function (oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-AttributesExpandContainer');

            var expanded = that.getProperty("expanded");
            if (expanded) {
                oRm.write(" sapUshellSearchResultListItem-AttributesExpanded");
            }

            oRm.write('">');

            oRm.write('<div class="sapUshellSearchResultListItem-AttributesAndActions">');

            that._renderImageForDocument(oRm);
            that._renderMultiLineDescription(oRm);

            oRm.write('<ul class="sapUshellSearchResultListItem-Attributes">');

            var itemAttributes = that.getAttributes();

            that._renderImageAttribute(oRm, /* imageIsOnlyAttribute= */ (itemAttributes.length === 0));

            that._renderAllAttributes(oRm, itemAttributes);

            // This is just a dummie attribute to store additional space information for the expand and collapse JavaScript function
            oRm.write('<li class="sapUshellSearchResultListItem-ExpandSpacerAttribute" aria-hidden="true"></li>');

            oRm.write('</ul>');

            that._renderRelatedObjectsToolbar(oRm);


            oRm.write('</div>');
            oRm.write('</div>');
        },



        // render Attributes
        // ===================================================================
        _renderAllAttributes: function (oRm, itemAttributes) {
            var that = this;

            if (itemAttributes.length === 0) {
                oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-MainAttribute sapUshellSearchResultListItem-EmptyAttributePlaceholder" aria-hidden="true"></li>');
                return;
            }

            var itemAttribute;
            var labelText;
            var valueText;
            var valueWithoutWhyfound;
            var label, value, isLongText;
            var hiddenValueText;

            var layoutCache = this.getLayoutCache() || {};
            this.setLayoutCache(layoutCache, /* suppress rerender */ true);
            if (!layoutCache.attributes) {
                layoutCache.attributes = {};
            }

            var i = 0,
                k,
                numberOfRenderedAttributes = 0;

            var numberOfColumnsDesktop = 4;
            var numberOfColumnsTablet = 3;
            var distributionOfAttributesDesktop = [0, 0, 0]; // three rows for desktop resolution
            var distributionOfAttributesTablet = [0, 0, 0, 0]; // four rows for tablet resolution
            var additionalWhyFoundAttributesDesktop = 2;
            var additionalWhyFoundAttributesTablet = 2;
            var longTextColumnNumber;

            var isDocumentItem = that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail";
            var includeImageAttribute = that.getImageUrl() && !isDocumentItem;
            if (isDocumentItem) {
                numberOfColumnsDesktop = numberOfColumnsTablet = 2;
                distributionOfAttributesDesktop = distributionOfAttributesTablet = [0, 0];
                additionalWhyFoundAttributesDesktop = additionalWhyFoundAttributesTablet = 4;
            }

            var remainingSlotsForAttributesDesktop = numberOfColumnsDesktop * distributionOfAttributesDesktop.length;
            var remainingSlotsForAttributesTablet = numberOfColumnsTablet * distributionOfAttributesTablet.length;

            if (includeImageAttribute) {
                remainingSlotsForAttributesDesktop--;
                remainingSlotsForAttributesTablet--;
                distributionOfAttributesDesktop[0]++;
                distributionOfAttributesTablet[0]++;
            }

            that.destroyAggregation("_attributeLabels");
            that.destroyAggregation("_attributeValues");
            that.destroyAggregation("_attributeValuesWithoutWhyfoundHiddenTexts");

            var createAfterRenderingFunctionForAddingAriaDescribedBy = function (control) {
                return function () {
                    var $this = $(this.getDomRef());
                    $this.attr("aria-describedby", $this.attr("data-tooltippedby"));
                }.bind(control);
            };

            for (; !(additionalWhyFoundAttributesDesktop <= 0 && additionalWhyFoundAttributesTablet <= 0) && i < itemAttributes.length; i++) {
                itemAttribute = itemAttributes[i];

                if (isDocumentItem && numberOfRenderedAttributes >= 4) {
                    break;
                }

                if (itemAttribute.isTitle) {
                    continue;
                }

                if (remainingSlotsForAttributesDesktop <= 0 && remainingSlotsForAttributesTablet <= 0 && !itemAttribute.whyfound) {
                    continue;
                }

                labelText = itemAttribute.name;
                valueText = itemAttribute.value;
                if (labelText === undefined || valueText === undefined) {
                    continue;
                }
                if (!valueText || valueText.trim().length === 0) {
                    valueText = noValue;
                }

                if (itemAttribute.longtext === undefined || itemAttribute.longtext === null || itemAttribute.longtext === '') {
                    isLongText = false;
                } else {
                    isLongText = true;
                }

                valueWithoutWhyfound = itemAttribute.valueWithoutWhyfound;

                var _rowCountTablet = -1,
                    _rowCountDesktop = -1,
                    _attributeWeight = {
                        desktop: 1,
                        tablet: 1
                    };

                var attributeLayout = layoutCache.attributes[itemAttribute.key] || {};
                layoutCache.attributes[itemAttribute.key] = attributeLayout;

                oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-MainAttribute');
                if (isLongText) {
                    longTextColumnNumber = attributeLayout.longTextColumnNumber || that._howManyColumnsToUseForLongTextAttribute(valueWithoutWhyfound);
                    attributeLayout.longTextColumnNumber = longTextColumnNumber;
                    _attributeWeight = longTextColumnNumber;
                    oRm.write(' sapUshellSearchResultListItem-LongtextAttribute');
                }

                if (remainingSlotsForAttributesDesktop <= 0) {
                    if (itemAttribute.whyfound && additionalWhyFoundAttributesDesktop > 0) {
                        oRm.write(' sapUshellSearchResultListItem-WhyFoundAttribute-Desktop');
                        additionalWhyFoundAttributesDesktop--;
                    } else {
                        oRm.write(' sapUshellSearchResultListItem-DisplayNoneAttribute-Desktop');
                    }
                }

                if (remainingSlotsForAttributesTablet <= 0) {
                    if (itemAttribute.whyfound && additionalWhyFoundAttributesTablet > 0) {
                        oRm.write(' sapUshellSearchResultListItem-WhyFoundAttribute-Tablet');
                        additionalWhyFoundAttributesTablet--;
                    } else {
                        oRm.write(' sapUshellSearchResultListItem-DisplayNoneAttribute-Tablet');
                    }
                }

                if (isLongText && includeImageAttribute && distributionOfAttributesDesktop[0] === 1) {
                    _rowCountDesktop = 0;
                    longTextColumnNumber = attributeLayout.longTextColumnNumber.desktop < numberOfColumnsDesktop ? attributeLayout.longTextColumnNumber.desktop : numberOfColumnsDesktop - 1;
                    distributionOfAttributesDesktop[0] += longTextColumnNumber;
                    remainingSlotsForAttributesDesktop -= longTextColumnNumber;
                } else {
                    for (k = 0; k < distributionOfAttributesDesktop.length; k++) {
                        if (distributionOfAttributesDesktop[k] + _attributeWeight.desktop <= numberOfColumnsDesktop) {
                            distributionOfAttributesDesktop[k] += _attributeWeight.desktop;
                            remainingSlotsForAttributesDesktop -= _attributeWeight.desktop;
                            _rowCountDesktop = k;
                            break;
                        }
                    }
                }

                if (_rowCountDesktop < 0) {
                    _rowCountDesktop = distributionOfAttributesDesktop.length;
                }

                if (isLongText && includeImageAttribute && distributionOfAttributesTablet[0] === 1) {
                    _rowCountTablet = 0;
                    longTextColumnNumber = attributeLayout.longTextColumnNumber.tablet < numberOfColumnsTablet ? attributeLayout.longTextColumnNumber.tablet : numberOfColumnsTablet - 1;
                    distributionOfAttributesTablet[0] += longTextColumnNumber;
                    remainingSlotsForAttributesTablet -= longTextColumnNumber;
                } else {
                    for (k = 0; k < distributionOfAttributesTablet.length; k++) {
                        if (distributionOfAttributesTablet[k] + _attributeWeight.tablet <= numberOfColumnsTablet) {
                            distributionOfAttributesTablet[k] += _attributeWeight.tablet;
                            remainingSlotsForAttributesTablet -= _attributeWeight.tablet;
                            _rowCountTablet = k;
                            break;
                        }
                    }
                }

                if (_rowCountTablet < 0) {
                    _rowCountTablet = distributionOfAttributesTablet.length;
                }

                oRm.write(' sapUshellSearchResultListItem-OrderTablet-' + _rowCountTablet);
                oRm.write(' sapUshellSearchResultListItem-OrderDesktop-' + _rowCountDesktop);

                oRm.write('"');

                if (isLongText) {
                    oRm.write(' data-sap-searchresultitem-attributeweight-desktop="' + _attributeWeight.desktop + '"');
                    oRm.write(' data-sap-searchresultitem-attributeweight-tablet="' + _attributeWeight.tablet + '"');
                }

                oRm.write('>');

                label = new sap.m.Label({
                    displayOnly: true
                });
                label.setText(labelText);
                label.addStyleClass("sapUshellSearchResultListItem-AttributeKey");
                label.addStyleClass("sapUshellSearchResultListItem-MightOverflow");

                oRm.renderControl(label);

                oRm.write('<span class="sapUshellSearchResultListItem-AttributeValueContainer">');

                if (itemAttribute.defaultNavigationTarget) {
                    value = new SearchLink();
                    value.setHref(itemAttribute.defaultNavigationTarget.getHref());
                    value.setTarget(itemAttribute.defaultNavigationTarget.getTarget());
                    value.addStyleClass("sapUshellSearchResultListItem-AttributeLink");
                } else if (this._isTweet(itemAttribute)) {
                    value = new SearchTweet();
                } else {
                    value = new SearchText();
                }
                value.setText(valueText);
                value.addStyleClass("sapUshellSearchResultListItem-AttributeValue");
                value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                if (itemAttribute.whyfound) {
                    value.data("ishighlighted", "true", true);
                    value.addStyleClass("sapUshellSearchResultListItem-AttributeValueHighlighted");
                }
                if (isLongText) {
                    value.data("islongtext", "true", true);
                }
                if (valueWithoutWhyfound) {
                    // for attribute values with why-found information, use the raw value information (without why-found-tags) for tooltip and ARIA description
                    hiddenValueText = new sap.ui.core.InvisibleText({});
                    hiddenValueText.addStyleClass("sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");
                    hiddenValueText.setText(valueWithoutWhyfound);
                    value.data("tooltippedBy", hiddenValueText.getId(), true);
                    value.addEventDelegate({
                        onAfterRendering: createAfterRenderingFunctionForAddingAriaDescribedBy(value)
                    });
                    that.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts", hiddenValueText, true /* do not invalidate this object */ );
                    oRm.renderControl(hiddenValueText);
                }
                oRm.renderControl(value);

                oRm.write('</span>');
                oRm.write('</li>');

                that.addAggregation("_attributeLabels", label, true /* do not invalidate this object */ );
                that.addAggregation("_attributeValues", value, true /* do not invalidate this object */ );

                numberOfRenderedAttributes++;
            }

            if (includeImageAttribute) {
                var availableSpaceOnFirstLineDesktop = numberOfColumnsDesktop - distributionOfAttributesDesktop[0];
                var availableSpaceOnFirstLineTablet = numberOfColumnsTablet - distributionOfAttributesTablet[0];

                if (availableSpaceOnFirstLineDesktop > 0 || availableSpaceOnFirstLineTablet > 0) {
                    oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-MainAttribute');
                    oRm.write(' sapUshellSearchResultListItem-OrderTablet-0 sapUshellSearchResultListItem-OrderDesktop-0');
                    oRm.write('"');
                    oRm.write(' data-sap-searchresultitem-attributeweight-desktop="' + availableSpaceOnFirstLineDesktop + '"');
                    oRm.write(' data-sap-searchresultitem-attributeweight-tablet="' + availableSpaceOnFirstLineTablet + '"');
                    oRm.write('></li>');
                }
            }
        },

        _isTweet: function (itemAttribute) {
            var model = sap.ushell.renderers.fiori2.search.getModelSingleton();
            return model.config._tweetAttribute === itemAttribute.key;
        },

        _howManyColumnsToUseForLongTextAttribute: function (attributeValue) {
            if (attributeValue.length < 50) {
                return {
                    tablet: 1,
                    desktop: 1
                };
            }
            if (attributeValue.length < 85) {
                return {
                    tablet: 2,
                    desktop: 2
                };
            }
            if (attributeValue.length < 135) {
                return {
                    tablet: 3,
                    desktop: 3
                };
            }
            return {
                tablet: 3,
                desktop: 4
            };
        },

        // _getTextWidth: function(text, font) {
        //     // re-use canvas object for better performance
        //     font = font || "0.875rem Arial,Helvetica,sans-serif";
        //     var canvas = _getTextWidth.canvas || (_getTextWidth.canvas = document.createElement("canvas"));
        //     var context = canvas.getContext("2d");
        //     context.font = font;
        //     var metrics = context.measureText(text);
        //     return metrics.width;
        // },


        _renderImageAttribute: function (oRm, imageIsOnlyAttribute) {
            var that = this;

            if (!that.getImageUrl() || that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail") {
                return;
            }

            oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-ImageAttribute');
            if (imageIsOnlyAttribute) {
                oRm.write(' sapUshellSearchResultListItem-LonelyImageAttribute');
            }
            oRm.write('">');
            oRm.write('<div class="sapUshellSearchResultListItem-ImageContainer');
            if (this.getImageFormat() === "round") {
                oRm.write(" sapUshellSearchResultListItem-ImageContainerRound");
            }
            oRm.write('">');

            if (that.getImageUrl()) {
                oRm.write('<img class="sapUshellSearchResultListItem-Image');
                if (this.getImageFormat() === "round") {
                    // oRm.write(' sapUshellSearchResultListItem-ImageFormat-Round');
                }
                oRm.write('" src="');
                oRm.write(that.getImageUrl());
                oRm.write('">');
            }

            if (this.getImageFormat() !== "round") {
                oRm.write('<div class="sapUshellSearchResultListItem-ImageContainerAlignmentHelper"></div>');
            }
            oRm.write('</div>');
            oRm.write('</li>');
        },


        // render Related Objects Toolbar
        // ===================================================================
        _renderRelatedObjectsToolbar: function (oRm) {
            var that = this;

            var navigationObjects = that.getNavigationObjects();

            if (!navigationObjects || navigationObjects.length === 0) {
                return;
            }

            that._showExpandButton = true;

            var relatedObjectActionsToolbar = that.getAggregation("_relatedObjectActionsToolbar");
            relatedObjectActionsToolbar.setProperty("navigationObjects", navigationObjects);
            relatedObjectActionsToolbar.setProperty("positionInList", this.getPositionInList());

            oRm.renderControl(relatedObjectActionsToolbar);
        },


        _renderAccessibilityInformation: function (oRm) {
            var that = this;

            var parentListItem = that.getProperty("parentListItem");
            if (parentListItem) {

                that._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */ true, /* doRender= */ true);
                that._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */ true);
                that._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */ true);

                parentListItem.addEventDelegate({
                    onAfterRendering: function (event) {
                        var $parentListItem = $(parentListItem.getDomRef());

                        that._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */ true);

                        $parentListItem.on("focusin", function (event) {
                            var $relatedTarget = $(event.relatedTarget);
                            if ($relatedTarget.hasClass("sapUshellSearchResultListItem") || $relatedTarget.closest(".sapUshellSearchResultListItemApps").length > 0 && !$relatedTarget.hasClass("sapUshellResultListMoreFooter")) {
                                that._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */ false, /* doRender= */ false);
                                that._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */ false);
                                that._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */ false);
                                that._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */ false);
                            } else {
                                that._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */ true, /* doRender= */ false);
                                that._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */ false);
                                that._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */ false);
                                that._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */ true);
                            }
                        });
                    },
                    onsapspace: function (oEvent) {
                        if (oEvent.target === oEvent.currentTarget) {
                            that.toggleDetails();
                        }
                    },
                    onsapenter: function (oEvent) {
                        if (oEvent.target === oEvent.currentTarget) {
                            var titleNavigation = that.getTitleNavigation();
                            if (titleNavigation) {
                                titleNavigation.performNavigation();
                            }
                        }
                    }
                });
            }
        },

        getAccessibilityInfo: function () {
            var accInfo = {};
            if (sap.ui.core.Control.prototype.getAccessibilityInfo) {
                accInfo = sap.ui.core.Control.prototype.getAccessibilityInfo.apply(this, arguments) || accInfo;
            }
            accInfo.description = ""; // Description will be provided dynamically in _renderAccessibilityInformation
            return accInfo;
        },

        _renderAriaDescriptionElementForTitle: function (oRm, withPrefix, doRender) {
            var that = this;
            that._searchResultListPrefix = that._searchResultListPrefix || sap.ushell.resources.i18n.getText("result_list_announcement_screenreaders");
            var labelText = that.getTitle() + ", " + that.getType() + ".";
            if (withPrefix) {
                labelText = that._searchResultListPrefix + " " + labelText;
            }

            var titleLabeledByText = that.getAggregation("_titleLabeledByText");
            titleLabeledByText.setText(labelText);

            if (doRender && oRm) {
                oRm.renderControl(titleLabeledByText);
            }
        },

        _renderAriaDescriptionElementForAttributes: function (oRm, doRender) {
            var that = this;

            var attributesLabeledByText = that.getAggregation("_attributesLabeledByText");

            var $attributes = $(that.getDomRef()).find(".sapUshellSearchResultListItem-Attributes").find(".sapUshellSearchResultListItem-MainAttribute");

            var labelledByText;
            if ($attributes.length === 0) {
                labelledByText = sap.ushell.resources.i18n.getText("result_list_item_aria_no_attributes");
            } else {
                labelledByText = sap.ushell.resources.i18n.getText("result_list_item_aria_has_attributes");
                $attributes.each(function () {
                    var $this = $(this);
                    if ($this.is(":visible") && $this.attr("aria-hidden") !== "true") {
                        var attributeKey = $this.find(".sapUshellSearchResultListItem-AttributeKey").text();
                        var $attributeValueContainer = $this.find(".sapUshellSearchResultListItem-AttributeValueContainer");
                        var $attributeValue = $attributeValueContainer.find(".sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");
                        if ($attributeValue.length === 0) {
                            $attributeValue = $attributeValueContainer.find(".sapUshellSearchResultListItem-AttributeValue");
                        }
                        var attributeValue = $attributeValue.text();
                        labelledByText += sap.ushell.resources.i18n.getText("result_list_item_aria_attribute_and_value", [attributeKey, attributeValue]);
                    }
                });
            }

            attributesLabeledByText.setText(labelledByText);

            if (doRender && oRm) {
                oRm.renderControl(attributesLabeledByText);
            }
        },

        _renderAriaDescriptionElementForCollapsedOrExpandedState: function (oRm, doRender) {
            var that = this;

            var expandStateLabeledByText = that.getAggregation("_expandStateLabeledByText");
            var labelledByText;

            var expandButton = that.getAggregation("_expandButton");
            var $expandButton = $(expandButton.getDomRef());
            if ($expandButton.css("visibility") !== "hidden") {
                if (that.isShowingDetails()) {
                    labelledByText = sap.ushell.resources.i18n.getText("result_list_item_aria_expanded");
                    var navigationObjects = this.getNavigationObjects();
                    if (navigationObjects && navigationObjects.length > 0) {
                        labelledByText = sap.ushell.resources.i18n.getText("result_list_item_aria_has_links") + labelledByText;
                    }
                } else {
                    labelledByText = sap.ushell.resources.i18n.getText("result_list_item_aria_collapsed");
                }
            }
            expandStateLabeledByText.setText(labelledByText);

            if (doRender && oRm) {
                oRm.renderControl(expandStateLabeledByText);
            }
        },

        _addAriaDescriptionToParentListElement: function (parentListItem, includeTotalCountElement) {
            var titleLabeledByText = this.getAggregation("_titleLabeledByText");
            var itemAriaLabeledBy = titleLabeledByText.getId();
            if (includeTotalCountElement) {
                var totalCountHiddenElement = this.getTotalCountHiddenElement();
                if (totalCountHiddenElement) {
                    itemAriaLabeledBy += " " + totalCountHiddenElement.getId();
                }
            }

            var attributesLabeledByText = this.getAggregation("_attributesLabeledByText");
            itemAriaLabeledBy += " " + attributesLabeledByText.getId();

            var expandStateLabeledByText = this.getAggregation("_expandStateLabeledByText");
            itemAriaLabeledBy += " " + expandStateLabeledByText.getId();

            var $parentListItem = $(parentListItem.getDomRef());
            $parentListItem.attr("aria-labelledby", itemAriaLabeledBy);
        },


        _getExpandAreaObjectInfo: function () {
            var that = this;

            var resultListItem = $(that.getDomRef());

            resultListItem.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

            // var isDocumentItem = that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail";

            var attributesExpandContainer = resultListItem.find(".sapUshellSearchResultListItem-AttributesExpandContainer");
            var relatedObjectsToolbar = resultListItem.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");

            var relatedObjectsToolbarHidden = false;
            if (relatedObjectsToolbar.css("display") === "none") {
                relatedObjectsToolbar.css("display", "block");
                relatedObjectsToolbarHidden = true;
            }

            var currentHeight = attributesExpandContainer.height();
            var expandedHeight = resultListItem.find(".sapUshellSearchResultListItem-AttributesAndActions").height();

            resultListItem.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

            if (relatedObjectsToolbarHidden) {
                relatedObjectsToolbar.css("display", "");
            }

            var elementsToFadeInOrOut = this._getElementsInExpandArea();

            // var prevX = 0,
            //     passedFirstLine = false;
            // resultListItem.find(".sapUshellSearchResultListItem-GenericAttribute:not(.sapUshellSearchResultListItem-ImageAttribute)").each(function () {
            //     // skip elements on first line
            //     if (!passedFirstLine) {
            //         var boundingRect = this.getBoundingClientRect();
            //         var x = boundingRect.x;
            //         if (x === undefined) {
            //             // IE and Edge return a non-standard DOMRect that has no x and y properties, but top and left properties
            //             x = boundingRect.left;
            //         }
            //         if (x > prevX) {
            //             prevX = x;
            //             return;
            //         } else {
            //             passedFirstLine = true;
            //         }
            //     }
            //     elementsToFadeInOrOut.push(this);
            // });

            var expandAnimationDuration = 200;
            var fadeInOrOutAnimationDuration = expandAnimationDuration / 10;

            var expandAreaObjectInfo = {
                resultListItem: resultListItem,
                attributesExpandContainer: attributesExpandContainer,
                currentHeight: currentHeight,
                expandedHeight: expandedHeight,
                elementsToFadeInOrOut: elementsToFadeInOrOut,
                expandAnimationDuration: expandAnimationDuration,
                fadeInOrOutAnimationDuration: fadeInOrOutAnimationDuration,
                relatedObjectsToolbar: relatedObjectsToolbar
            };

            return expandAreaObjectInfo;
        },


        _getElementsInExpandArea: function () {
            var that = this;
            var $resultListItem = $(that.getDomRef());

            var elementsToFadeInOrOut = [];

            $resultListItem.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

            var attributeElements = $resultListItem.find(".sapUshellSearchResultListItem-GenericAttribute:not(.sapUshellSearchResultListItem-ImageAttribute)");
            if (attributeElements.length > 0) {
                var firstLineY = attributeElements.position().top;
                attributeElements.each(function () {
                    if ($(this).position().top > firstLineY) {
                        elementsToFadeInOrOut.push(this);
                    }
                });
            }

            $resultListItem.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

            return elementsToFadeInOrOut;
        },


        isShowingDetails: function () {
            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            /////////////////////////////
            // Expand Result List Item
            if (expandAreaObjectInfo.currentHeight < expandAreaObjectInfo.expandedHeight) {
                return false;
            }
            return true;
        },


        showDetails: function (animated) {
            var that = this;

            if (that.isShowingDetails()) {
                return;
            }

            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            expandAreaObjectInfo.relatedObjectsToolbar.css("opacity", 0);
            expandAreaObjectInfo.relatedObjectsToolbar.css("display", "block");

            var relatedObjectActionsToolbar = that.getAggregation("_relatedObjectActionsToolbar");
            if (relatedObjectActionsToolbar) {
                relatedObjectActionsToolbar._layoutToolbarElements();
            }

            that.forwardEllipsis($(that.getDomRef()).find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"));

            $(that.getDomRef()).addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

            var animation02, secondAnimationStarted = false;
            var animation01 = expandAreaObjectInfo.attributesExpandContainer.animate({
                "height": expandAreaObjectInfo.expandedHeight
            }, {
                "duration": expandAreaObjectInfo.expandAnimationDuration,
                "progress": function (animation, progress, remainingMs) {
                    if (!secondAnimationStarted && progress > 0.5) {
                        animation02 = expandAreaObjectInfo.relatedObjectsToolbar.animate({
                            "opacity": 1
                        }, remainingMs).promise();
                        secondAnimationStarted = true;

                        jQuery.when(animation01, animation02).done(function () {
                            that.setProperty("expanded", true, true);

                            //                     $(this).css("height", "auto");
                            $(this).addClass("sapUshellSearchResultListItem-AttributesExpanded");
                            $(this).css("height", "");
                            $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");
                            $(that.getDomRef()).removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");

                            var iconArrowUp = sap.ui.core.IconPool.getIconURI("slim-arrow-up");
                            var expandButton = that.getAggregation("_expandButton");
                            expandButton.setTooltip(sap.ushell.resources.i18n.getText("hideDetailBtn_tooltip"));
                            expandButton.setIcon(iconArrowUp);
                            expandButton.rerender();

                            expandAreaObjectInfo.relatedObjectsToolbar.css("display", "");
                            expandAreaObjectInfo.relatedObjectsToolbar.css("opacity", "");

                            that._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */ false);
                            that._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */ false);
                        }.bind(this));
                    }
                }
            }).promise();

            $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
                    "opacity": 1
                },
                expandAreaObjectInfo.fadeInOrOutAnimationDuration
            );
        },


        hideDetails: function (animated) {
            var that = this;
            var resultListItem = $(that.getDomRef());

            if (!that.isShowingDetails()) {
                return;
            }

            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            expandAreaObjectInfo.relatedObjectsToolbar.css("opacity", 1);
            expandAreaObjectInfo.relatedObjectsToolbar.animate({
                    "opacity": 0
                },
                expandAreaObjectInfo.expandAnimationDuration / 2);

            var attributeHeight = resultListItem.find(".sapUshellSearchResultListItem-MainAttribute").outerHeight(true) + resultListItem.find(".sapUshellSearchResultListItem-ExpandSpacerAttribute").outerHeight(true);
            var secondAnimationStarted = false;
            var deferredAnimation01 = expandAreaObjectInfo.attributesExpandContainer.animate({
                "height": attributeHeight
            }, {
                "duration": expandAreaObjectInfo.expandAnimationDuration,
                "progress": function (animation, progress, remainingMs) {
                    if (!secondAnimationStarted && remainingMs <= expandAreaObjectInfo.fadeInOrOutAnimationDuration) {
                        secondAnimationStarted = true;
                        var deferredAnimation02 = $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
                                "opacity": 0
                            },
                            expandAreaObjectInfo.fadeInOrOutAnimationDuration
                        ).promise();

                        jQuery.when(deferredAnimation01, deferredAnimation02).done(function () {
                            that.setProperty("expanded", false, true);

                            expandAreaObjectInfo.attributesExpandContainer.removeClass("sapUshellSearchResultListItem-AttributesExpanded");
                            $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");
                            expandAreaObjectInfo.relatedObjectsToolbar.css("opacity", "");

                            var iconArrowDown = sap.ui.core.IconPool.getIconURI("slim-arrow-down");
                            var expandButton = that.getAggregation("_expandButton");
                            expandButton.setTooltip(sap.ushell.resources.i18n.getText("showDetailBtn_tooltip"));
                            expandButton.setIcon(iconArrowDown);
                            expandButton.rerender();

                            that._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */ false);
                            that._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */ false);
                        });
                    }
                }
            }).promise();
        },


        toggleDetails: function (animated) {

            var eventType;
            var model = sap.ushell.renderers.fiori2.search.getModelSingleton();

            if (this.isShowingDetails()) {
                eventType = model.eventLogger.ITEM_HIDE_DETAILS;
                this.hideDetails(animated);
            } else {
                eventType = model.eventLogger.ITEM_SHOW_DETAILS;
                this.showDetails(animated);
            }

            model.eventLogger.logEvent({
                type: eventType,
                itemPosition: this.getPositionInList(),
                executionId: this.getResultSetId()
            });

        },

        isSelectionModeEnabled: function () {
            var that = this;
            var isSelectionModeEnabled = false;
            var selectionBoxContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");
            if (selectionBoxContainer) {
                isSelectionModeEnabled = selectionBoxContainer.css("opacity") > 0;
            }
            return isSelectionModeEnabled;
        },


        enableSelectionMode: function (animated) {
            var that = this;
            var selectionBoxOuterContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
            var selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");

            var duration = 200; // aka 'fast'
            var secondAnimationStarted = false;
            selectionBoxOuterContainer.animate({
                width: "2rem"
            }, {
                "duration": duration,
                "progress": function (animation, progress, remainingMs) {
                    if (!secondAnimationStarted && progress > 0.5) {
                        selectionBoxInnerContainer.css("display", "");
                        selectionBoxInnerContainer.animate({
                            opacity: "1.0"
                        }, duration / 2);
                        secondAnimationStarted = true;
                    }
                }
            });
        },


        disableSelectionMode: function (animated) {
            var that = this;
            var selectionBoxOuterContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
            var selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");

            var duration = 200; // aka 'fast'
            selectionBoxInnerContainer.animate({
                opacity: "0.0"
            }, duration / 2, function () {
                selectionBoxInnerContainer.css("display", "none");
            });
            selectionBoxOuterContainer.animate({
                width: "0"
            }, duration);
        },



        toggleSelectionMode: function (animated) {
            if (this.isSelectionModeEnabled()) {
                this.disableSelectionMode(animated);
            } else {
                this.enableSelectionMode(animated);
            }
        },

        // after rendering
        // ===================================================================
        onAfterRendering: function () {
            var that = this;
            var $that = $(that.getDomRef());

            that._showOrHideExpandButton();
            that._setListItemStatusBasedOnWindowSize();

            that._renderAriaDescriptionElementForTitle(undefined, /* withPrefix = */ /* doRender= */ false);
            that._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */ false);
            that._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */ false);

            // if (that.getModel().config.odataProvider || !that.getModel().config.isLaunchpad()) {
            //     // active the quick view for list item click
            //     that.getAggregation("_titleLink").setEnabled(true);
            //     $(that.getAggregation("_titleLink").getDomRef()).bind('click', function () {
            //         var titleUrl = "";
            //         var titleNavigation = that.getTitleNavigation();
            //         if (titleNavigation) {
            //             titleUrl = titleNavigation.getTargetUrl();
            //         }
            //         if (!titleUrl || titleUrl.length === 0) {
            //             var oQuickViewGroup = new sap.m.QuickViewGroup();
            //             var sBindingPath = that.getBindingContext().sPath + "/itemattributes";
            //             oQuickViewGroup.bindAggregation("elements", sBindingPath, function (sId, oContext) {
            //                 var oType = sap.m.QuickViewGroupElementType.text;
            //                 var oBinding = oContext.oModel.getProperty(oContext.sPath);
            //                 var sUrl;
            //                 if (oBinding.key.toLowerCase().indexOf("email") !== -1) {
            //                     oType = sap.m.QuickViewGroupElementType.email;
            //                 } else if (oBinding.key.toLowerCase().indexOf("url") !== -1) {
            //                     oType = sap.m.QuickViewGroupElementType.link;
            //                     sUrl = "http://" + oBinding.value;
            //                 } else if (oBinding.key.toLowerCase().indexOf("telefon") !== -1) {
            //                     oType = sap.m.QuickViewGroupElementType.phone;
            //                 }
            //                 var oQuickViewGroupElement = new sap.m.QuickViewGroupElement({
            //                     visible: !oBinding.isTitle && !oBinding.hidden,
            //                     label: "{name}",
            //                     value: "{value}",
            //                     type: oType,
            //                     url: sUrl
            //                 });
            //                 return oQuickViewGroupElement;
            //             });
            //             var oQuickViewPage = new sap.m.QuickViewPage({
            //                 //                        header: sap.ushell.resources.i18n.getText("resultsQuickViewHeader"),
            //                 header: that.getTitle(),
            //                 icon: that.getImageUrl(),
            //                 groups: [oQuickViewGroup]
            //             });
            //             var oQuickView = new sap.m.QuickView({
            //                 placement: sap.m.PlacementType.Auto,
            //                 width: $(window).width() / 3 + "px",
            //                 pages: [oQuickViewPage]
            //             });
            //             oQuickView.setModel(that.getModel());
            //             oQuickView.openBy(that.getAggregation("_titleLink"));
            //             oQuickView.addStyleClass("sapUshellSearchQuickView");
            //             sap.ushell.renderers.fiori2.search.SearchHelper.boldTagUnescaper(oQuickView.getDomRef());
            //         }
            //     });
            // }

            // use boldtagunescape like in highlighting for suggestions //TODO
            // allow <b> in title and attributes
            that.forwardEllipsis($that.find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"));

            SearchHelper.attachEventHandlersForTooltip(that.getDomRef());
        },


        resizeEventHappened: function () {
            var that = this;
            var $that = $(that.getDomRef());
            that._showOrHideExpandButton();
            that._setListItemStatusBasedOnWindowSize();
            that.getAggregation("_titleLink").rerender();
            that.forwardEllipsis($that.find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"));
        },


        // ===================================================================
        // Some Helper Functions
        // ===================================================================

        _getPhoneSize: function () {
            return 767;
        },

        _resetPrecalculatedValues: function () {
            this._visibleAttributes = undefined;
            this._detailsArea = undefined;
            this._showExpandButton = false;
        },

        _setListItemStatusBasedOnWindowSize: function () {
            var windowWidth = window.innerWidth;
            var parentListItem = this.getParentListItem();
            if (this.getTitleNavigation() && windowWidth <= this._getPhoneSize()) {
                parentListItem.setType(sap.m.ListType.Active);
            } else {
                parentListItem.setType(sap.m.ListType.Inactive);
            }
        },

        _showOrHideExpandButton: function () {
            var that = this;
            var element = $(that.getDomRef());

            var expandButtonContainer = element.find(".sapUshellSearchResultListItem-ExpandButtonContainer");
            var isVisible = expandButtonContainer.css("visibility") !== "hidden";

            var shouldBeVisible = false;

            var isDocumentItem = that.getImageFormat() && that.getImageFormat().toLowerCase() === "documentthumbnail";

            if (!isDocumentItem) {
                var actionBar = element.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
                shouldBeVisible = actionBar.length > 0; // && actionBar.css("display") !== "none";
            }

            if (!isDocumentItem && !shouldBeVisible) {
                var elementsInExpandArea = that._getElementsInExpandArea();
                if (elementsInExpandArea.length > 0) {
                    shouldBeVisible = true;
                }
            }

            if (isVisible && !shouldBeVisible) {
                expandButtonContainer.css("visibility", "hidden");
                expandButtonContainer.attr("aria-hidden", "true");
                that.setAriaExpandedState();
            } else if (!isVisible && shouldBeVisible) {
                expandButtonContainer.css("visibility", "");
                expandButtonContainer.removeAttr("aria-hidden");
                that.setAriaExpandedState();
            }
        },

        setAriaExpandedState: function () {
            var that = this;
            var expandButton = that.getAggregation("_expandButton");
            var $expandButton = $(expandButton.getDomRef());
            var $that = $(that.getDomRef());
            var $parentListItem = that.getParentListItem() ? $(that.getParentListItem().getDomRef()) : $that.closest("li");
            var $expandButtonContainer = $that.find(".sapUshellSearchResultListItem-ExpandButtonContainer");

            if ($expandButtonContainer.css("visibility") === "hidden") {
                $expandButton.removeAttr("aria-expanded");
                $parentListItem.removeAttr("aria-expanded");
            } else {
                var expanded = that.getProperty("expanded");
                if (expanded) {
                    $expandButton.attr("aria-expanded", "true");
                    $parentListItem.attr("aria-expanded", "true");
                } else {
                    $expandButton.attr("aria-expanded", "false");
                    $parentListItem.attr("aria-expanded", "false");
                }

            }
        },

        _registerItemPressHandler: function () {
            var that = this;
            var parentListItem = that.getParentListItem();
            if (parentListItem) {
                parentListItem.attachPress(function (event) {
                    that._performTitleNavigation();
                });
                that._registerItemPressHandler = function () {};
            }
        },

        _performTitleNavigation: function (params) {
            var trackingOnly = params && params.trackingOnly || false;
            var titleNavigation = this.getTitleNavigation();
            if (titleNavigation) {
                titleNavigation.performNavigation({
                    trackingOnly: trackingOnly
                });
            }
        },


        forwardEllipsis: function (objs) {
            var $this = $(this.getDomRef());
            $this.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
            objs.each(function (i, d) {
                // recover bold tag with the help of text() in a safe way
                SearchHelper.forwardEllipsis4Whyfound(d);
            });
            $this.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
        }

    });
});
