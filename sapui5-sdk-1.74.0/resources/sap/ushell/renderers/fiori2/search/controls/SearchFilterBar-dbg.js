// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */
sap.ui.define([
    'sap/m/Toolbar'
], function () {
    "use strict";

    return sap.m.Toolbar.extend("sap.ushell.renderers.fiori2.search.controls.SearchFilterBar", {

        constructor: function (options) {
            var that = this;

            // blue bar
            options = jQuery.extend({}, {
                design: sap.m.ToolbarDesign.Info
            }, options);
            sap.m.Toolbar.prototype.constructor.apply(that, [options]);
            that.addStyleClass('sapUshellSearchFilterContextualBar');

            // bind file formatter
            that.filterFormatter = that.filterFormatter.bind(that);

            // filter text string
            that.filterText = new sap.m.Text({
                text: {
                    parts: [{
                        path: "/uiFilter/rootCondition"
                    }, {
                        path: "/facets"
                    }],
                    formatter: that.filterFormatter
                },
                tooltip: {
                    parts: [{
                        path: "/uiFilter/rootCondition"
                    }, {
                        path: "/facets"
                    }],
                    formatter: that.filterFormatter
                }
            }).addStyleClass("sapUshellSearchFilterText");
            that.filterText.setMaxLines(1);
            that.filterText.clampText();
            that.addContent(that.filterText);

            // filter middle space
            that.addContent(new sap.m.ToolbarSpacer());

            // filter reset button
            that.resetButton = new sap.ui.core.Icon({
                src: "sap-icon://clear-filter",
                tooltip: sap.ushell.resources.i18n.getText("resetFilterButton_tooltip")
            }).addStyleClass("sapUshellSearchFilterResetButton");
            that.addContent(that.resetButton);
        },

        filterFormatter: function (rootCondition, facets) {
            if (!rootCondition || !rootCondition.hasFilters()) {
                return '';
            }
            // sort filter values, use same order as in facets
            rootCondition = this.sortConditions(rootCondition, facets);
            // collect all filter values
            var labels = [];
            for (var i = 0; i < rootCondition.conditions.length; ++i) {
                var complexCondition = rootCondition.conditions[i];
                for (var j = 0; j < complexCondition.conditions.length; ++j) {
                    var filterCondition = complexCondition.conditions[j];
                    //                    labels.push(filterCondition.valueLabel);
                    labels.push(this._formatLabel(filterCondition.valueLabel, filterCondition.operator));
                }
            }
            return sap.ushell.resources.i18n.getText("filtered_by", labels.join(', '));
        },

        _formatLabel: function (label, operator) {
            var labelFormatted;
            switch (operator) {
            case 'Bw':
                labelFormatted = label + '*';
                break;
            case 'Ew':
                labelFormatted = '*' + label;
                break;
            case 'Co':
                labelFormatted = '*' + label + '*';
                break;
            default:
                labelFormatted = label;
                break;
            }
            return labelFormatted;
        },

        sortConditions: function (rootCondition, facets) {
            // cannot sort without facets
            if (facets.length === 0) {
                return rootCondition;
            }
            // helper: get attribute from a complex condition
            var getAttribute = function (complexCondition) {
                var firstFilter = complexCondition.conditions[0];
                if (firstFilter.attribute) {
                    return firstFilter.attribute;
                }
                return firstFilter.conditions[0].attribute;

            };
            // helper get list index
            var getIndex = function (list, attribute, value) {
                for (var i = 0; i < list.length; ++i) {
                    var element = list[i];
                    if (element[attribute] === value) {
                        return i;
                    }
                }
            };
            // clone: we don't want to modify the original filter
            rootCondition = rootCondition.clone();
            // 1) sort complexConditons (each complexCondition holds the filters for a certain attribute)
            rootCondition.conditions.sort(function (complexCondition1, complexCondition2) {
                var attribute1 = getAttribute(complexCondition1);
                var index1 = getIndex(facets, 'dimension', attribute1);
                var attribute2 = getAttribute(complexCondition2);
                var index2 = getIndex(facets, 'dimension', attribute2);
                return index1 - index2;
            });
            // 2) sort filters within a complexConditon
            var sortValues = function (complexCondition) {
                var attribute = getAttribute(complexCondition);
                var index = getIndex(facets, 'dimension', attribute);
                if (!index) {
                    return;
                }
                var facet = facets[index];
                var valueSortFunction = function (filter1, filter2) {
                    return getIndex(facet.items, 'label', filter1.valueLabel) - getIndex(facet.items, 'label', filter2.valueLabel);
                };
                complexCondition.conditions.sort(valueSortFunction);
            };
            for (var i = 0; i < rootCondition.conditions.length; ++i) {
                var complexCondition = rootCondition.conditions[i];
                sortValues(complexCondition);
            }
            return rootCondition;
        },

        renderer: 'sap.m.ToolbarRenderer',

        onAfterRendering: function () {
            var that = this;

            // don't have model until after rendering
            // attach press action
            that.resetButton.attachPress(function () {
                var model = that.getModel();
                model.eventLogger.logEvent({
                    type: model.eventLogger.CLEAR_ALL_FILTERS
                });
                model.resetFilterConditions(true);
            });

            // add aria label
            var $filterText = jQuery('.sapUshellSearchFilterText');
            $filterText.attr('aria-label', sap.ushell.resources.i18n.getText("filtered_by_aria_label"));
        }
    });
});
