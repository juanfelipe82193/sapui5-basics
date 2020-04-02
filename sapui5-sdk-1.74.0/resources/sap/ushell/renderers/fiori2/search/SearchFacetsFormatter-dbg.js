// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap, $ */

sap.ui.define([], function () {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchFacetsFormatter');
    var module = sap.ushell.renderers.fiori2.search.SearchFacetsFormatter = function () {
        this.init.apply(this, arguments);
    };

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.Facet');
    var Facet = sap.ushell.renderers.fiori2.search.Facet = function () {
        this.init.apply(this, arguments);
    };

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.FacetItem');
    var FacetItem = sap.ushell.renderers.fiori2.search.FacetItem = function () {
        this.init.apply(this, arguments);
    };

    // =======================================================================
    // Facet
    // =======================================================================
    Facet.prototype = {

        init: function (properties) {
            this.title = properties.title;
            this.facetType = properties.facetType; //datasource or attribute
            this.dimension = properties.dimension;
            this.dataType = properties.dataType;
            this.matchingStrategy = properties.matchingStrategy;
            this.items = properties.items || [];
            this.totalCount = properties.totalCount;
        },

        /**
         * Checks if the facet has the given filter condition
         * @param   {object}  filterCondition the condition to check for in this facet
         * @returns {Boolean} true if the filtercondition was found in this facet
         */
        hasFilterCondition: function (filterCondition) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var fc = this.items[i].filterCondition || this.items[i];
                if (fc.equals && fc.equals(filterCondition)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Checks if this facet has at least one filter condition
         * @returns {Boolean} true if it has at least one filter condition, false otherwise
         */
        hasFilterConditions: function () {
            for (var i = 0, len = this.items.length; i < len; i++) {
                if (this.items[i].filterCondition) {
                    return true;
                }
            }
            return false;
        },

        removeItem: function (facetItem) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var fc = this.items[i].filterCondition || this.items[i];
                if (fc.equals && facetItem.filterCondition && fc.equals(facetItem.filterCondition)) {
                    return this.items.splice(i, 1);
                }
            }
        }

    };

    /* A FacetItem is an entry inside the facet. It can be a data source or an attribute.
     */
    FacetItem.prototype = {

        init: function (properties) {
            properties = properties || {};
            this.selected = properties.selected || false;
            this.level = properties.level || 0;
            this.filterCondition = properties.filterCondition;
            this.value = properties.value || ""; //value here means count
            this.label = properties.label || "";
            this.facetTitle = properties.facetTitle || "";
            this.facetAttribute = properties.facetAttribute || "";
            this.valueLabel = this.value;
            this.advanced = properties.advanced || false;
            this.listed = properties.listed || false;
        },

        equals: function (otherFacetItem) {
            return (this.facetTitle === otherFacetItem.facetTitle &&
                this.label === otherFacetItem.label &&
                this.value === otherFacetItem.value &&
                this.filterCondition.equals(otherFacetItem.filterCondition));
        },

        clone: function () {
            var newFacetItem = new sap.ushell.renderers.fiori2.search.FacetItem();
            newFacetItem.facetTitle = this.facetTitle;
            newFacetItem.selected = this.selected;
            newFacetItem.label = this.label;
            newFacetItem.level = this.level;
            newFacetItem.value = this.value;
            newFacetItem.valueLabel = this.valueLabel;
            newFacetItem.filterCondition = this.filterCondition.clone();
            return newFacetItem;
        }

    };

    module.prototype = {
        init: function (model) {
            this.model = model;
        },

        _getAncestorDataSources: function (oSearchModel) {
            var aRecentDataSources = [];
            var aAncestorNodes = oSearchModel.dataSourceTree.findNode(oSearchModel.getProperty("/uiFilter/dataSource")).getAncestors().reverse();
            for (var i = 0; i < aAncestorNodes.length; i++) {
                var ds = aAncestorNodes[i].dataSource;
                var dsFacetItem = new FacetItem({
                    label: ds.labelPlural,
                    filterCondition: ds,
                    level: 0,
                    value: aAncestorNodes[i].count
                });
                aRecentDataSources.push(dsFacetItem);
            }
            return aRecentDataSources;
        },

        _getSiblingDataSources: function (oSearchModel, level) {
            var aSiblingFacetItems = [];
            var currentDS = oSearchModel.getProperty("/uiFilter/dataSource");
            var currentNode = oSearchModel.dataSourceTree.findNode(currentDS);
            var aSiblingNodes;
            if (currentNode.parent && !currentNode.unsureWhetherNodeisBelowRoot) {
                aSiblingNodes = currentNode.parent.getChildren();
            } else {
                aSiblingNodes = [];
            }
            if (aSiblingNodes.length === 0) {
                aSiblingNodes.push(currentNode);
            }
            for (var j = 0, lenJ = aSiblingNodes.length; j < lenJ; j++) {
                var ds = aSiblingNodes[j].dataSource;
                var fi = new FacetItem({
                    label: ds.labelPlural,
                    value: aSiblingNodes[j].count,
                    filterCondition: ds,
                    selected: currentDS === ds,
                    level: level
                });
                aSiblingFacetItems.push(fi);
                if (fi.selected) {
                    aSiblingFacetItems.push.apply(aSiblingFacetItems, this._getChildrenDataSources(oSearchModel, level + 1));
                }
            }
            return aSiblingFacetItems;
        },

        _getChildrenDataSources: function (oSearchModel, level) {
            //add children with data from the tree
            var aChildFacetItems = [];
            var currentDS = oSearchModel.getProperty("/uiFilter/dataSource");
            var aChildNodes = oSearchModel.dataSourceTree.findNode(currentDS).getChildren();
            for (var j = 0, lenJ = aChildNodes.length; j < lenJ; j++) {
                var ds = aChildNodes[j].dataSource;
                var fi = new FacetItem({
                    label: ds.labelPlural,
                    value: aChildNodes[j].count,
                    filterCondition: ds,
                    selected: false,
                    level: level
                });
                aChildFacetItems.push(fi);
            }
            return aChildFacetItems;
        },

        getDataSourceFacetFromTree: function (oSearchModel) {
            var oDataSourceFacet = new Facet({
                facetType: "datasource",
                title: "Search In"
            });
            var currentDS = oSearchModel.getProperty("/uiFilter/dataSource");
            var aAncestors = this._getAncestorDataSources(oSearchModel);
            oDataSourceFacet.items.push.apply(oDataSourceFacet.items, aAncestors);
            var aSiblings = this._getSiblingDataSources(oSearchModel, oSearchModel.allDataSource === currentDS ? 0 : 1);
            oDataSourceFacet.items.push.apply(oDataSourceFacet.items, aSiblings);
            return oDataSourceFacet;
        },

        _createFacetItemsFromConditionGroup: function (rootCondition) {
            var facetItems = [];
            for (var i = 0; i < rootCondition.conditions.length; i++) {
                var complexCondition = rootCondition.conditions[i];
                for (var j = 0; j < complexCondition.conditions.length; j++) {
                    var condition = complexCondition.conditions[j];
                    if (condition.type === this.model.sinaNext.ConditionType.Simple) {
                        facetItems.push(new FacetItem({
                            facetAttribute: condition.attribute,
                            //                            label: condition.valueLabel,
                            label: this._formatLabel(condition.valueLabel, condition.operator),
                            filterCondition: condition,
                            selected: true
                        }));
                    } else {
                        facetItems.push(new FacetItem({
                            facetAttribute: condition.conditions[0].attribute,
                            label: condition.valueLabel,
                            filterCondition: condition,
                            selected: true
                        }));
                    }
                }
            }
            return facetItems;
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

        getAttributeFacetsFromPerspective: function (resultSet, oSearchModel) {

            var oDataSource = oSearchModel.getDataSource();
            if (oDataSource.type === oSearchModel.sinaNext.DataSourceType.Category) {
                //                return $.when(aClientSideFacets);
                return $.when([]); // UI decision: with Category, common attributes should not be shown
            }

            // get chart facets from resultSet
            var aServerSideFacets = resultSet.facets.filter(function (element) {
                return element.type === oSearchModel.sinaNext.FacetType.Chart;
            });

            // create facets and facet items from server respons
            var aClientSideFacets = [];
            var aClientSideFacetsByDimension = {};
            for (var i = 0, len = aServerSideFacets.length; i < len; i++) {
                var oServerSideFacet = aServerSideFacets[i];
                var oClientSideFacet = new Facet({
                    title: oServerSideFacet.title,
                    facetType: 'attribute',
                    dimension: oServerSideFacet.query.dimension,
                    totalCount: resultSet.totalCount
                });
                if (oServerSideFacet.items.length === 0) {
                    continue;
                }
                for (var j = 0; j < oServerSideFacet.items.length; j++) {
                    var oFacetListItem = oServerSideFacet.items[j];
                    var item = new FacetItem({
                        facetAttribute: oServerSideFacet.query.dimension,
                        // label: oFacetListItem.dimensionValueFormatted,
                        label: this._formatLabel(oFacetListItem.dimensionValueFormatted, oFacetListItem.filterCondition.operator),
                        value: oFacetListItem.measureValue,
                        filterCondition: oFacetListItem.filterCondition
                    });
                    item.facetTitle = oServerSideFacet.title;
                    item.serverSideItem = true;
                    oClientSideFacet.items.push(item);
                }
                aClientSideFacetsByDimension[oServerSideFacet.query.dimension] = oClientSideFacet;
                aClientSideFacets.push(oClientSideFacet);
            }

            this.addDataTypeToClientSideFacets(aClientSideFacets, oSearchModel);

            // create facet items from global filter
            var oClientSideFacetsWithSelection = {};
            var aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(oSearchModel.getProperty("/uiFilter/rootCondition"));

            // combine facets from global filter with facets from server
            for (var k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
                var oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
                var oClientSideFacetWithSelection = aClientSideFacetsByDimension[oSelectedFacetItem.facetAttribute];
                // if (!oClientSideFacetWithSelection) {
                //     // facet was not send from server -> create it
                //     var dimension = oSelectedFacetItem.filterCondition.attribute ? oSelectedFacetItem.filterCondition.attribute : oSelectedFacetItem.filterCondition.conditions[0].attribute;
                //     oClientSideFacetWithSelection = new Facet({
                //         dimension: dimension,
                //         title: resultSet.query.filter.dataSource.getAttributeMetadata(dimension).label,
                //         facetType: "attribute",
                //         items: [oSelectedFacetItem]
                //     });
                //     aClientSideFacetsByDimension[oSelectedFacetItem.facetAttribute] = oClientSideFacetWithSelection;
                //     aClientSideFacets.splice(0, 0, oClientSideFacetWithSelection); //insert selected facets on top

                // } else {
                if (oClientSideFacetWithSelection) {
                    // remove and insert selected facet on top, only in facet panel
                    var indexOfClientSideFacetWithSelection = aClientSideFacets.indexOf(oClientSideFacetWithSelection);
                    if (indexOfClientSideFacetWithSelection > 0) {
                        aClientSideFacets.splice(indexOfClientSideFacetWithSelection, 1);
                        aClientSideFacets.splice(0, 0, oClientSideFacetWithSelection);
                    }
                    // facet with the same title as a already selected facetitems facet was sent by the server
                    // -> merge the item into this facet. If the same facet item already exists just select it
                    // var facetItemFoundInFacet = false;
                    for (var m = 0, lenM = oClientSideFacetWithSelection.items.length; m < lenM; m++) {
                        var facetItem = oClientSideFacetWithSelection.items[m];
                        if (oSelectedFacetItem.filterCondition.equals(facetItem.filterCondition)) {
                            facetItem.selected = true;
                            // facetItemFoundInFacet = true;
                            if (!oSearchModel.config.multiSelect) {
                                facetItem.value = null;
                                facetItem.valueLabel = null;
                            }
                        }
                    }
                    // if (!facetItemFoundInFacet) {
                    //     // there is no such facet item -> add the facet item to the facet            
                    //     oClientSideFacetWithSelection.items.push(oSelectedFacetItem);
                    // }
                }
                oClientSideFacetsWithSelection[oSelectedFacetItem.facetAttribute] = oClientSideFacetWithSelection;
            }

            // no multiselect: 
            // remove all unselected attributes in facets which have selections
            // and make them single selected
            if (!oSearchModel.config.multiSelect) {
                for (var facetAttribute in oClientSideFacetsWithSelection) {
                    if (oClientSideFacetsWithSelection.hasOwnProperty(facetAttribute)) {
                        var facet = oClientSideFacetsWithSelection[facetAttribute];
                        for (var n = facet.items.length - 1; n >= 0; n--) {
                            var itemN = facet.items[n];
                            if (!itemN.selected) {
                                facet.items.splice(n, 1);
                            }
                        }
                    }
                }
            }

            return $.when(aClientSideFacets);
            // return this.addDataTypeToClientSideFacets(aClientSideFacets, oSearchModel);
        },

        addDataTypeToClientSideFacets: function (aClientSideFacets, oSearchModel) {

            var oDataSource = oSearchModel.getDataSource();
            for (var i = 0; i < aClientSideFacets.length; i++) {
                var oFacet = aClientSideFacets[i];
                var metadata = oDataSource.getAttributeMetadata(oFacet.dimension);
                oFacet.dataType = metadata.type;
            }
        },

        getFacets: function (oDataSource, oINAPerspective, oSearchModel) {

            // generate datasource facet
            var aFacets = [this.getDataSourceFacetFromTree(oSearchModel)];

            // for ds=apps or ds=category -> no attribute facets
            if (oDataSource === oSearchModel.appDataSource || oDataSource.type === oSearchModel.sinaNext.DataSourceType.Category) {
                return $.when(aFacets);
            }

            // return without perspective 
            if (!oINAPerspective) {
                return $.when(aFacets);
            }

            // generate attribute facets
            var facets = this.getAttributeFacetsFromPerspective(oINAPerspective, oSearchModel);
            var res = facets.then(function (aAttributeFacets) {
                if (aAttributeFacets.length > 0) {
                    aFacets.push.apply(aFacets, aAttributeFacets);
                }
                return aFacets;
            });
            return res;
        },

        getFacetItemsWithFilterConditions: function (oSearchModel) {
            return this._createFacetItemsFromConditionGroup(oSearchModel.getProperty("/uiFilter/rootCondition"));
        },

        getDialogFacetsFromMetaData: function (oMetaData, oSearchModel) {
            var aServerSideFacets = jQuery.map(oMetaData.attributeMetadataMap, function (el) {
                return el;
            });
            var aClientSideFacets = [];

            // extract facets from server response:
            for (var i = 0, len = aServerSideFacets.length; i < len; i++) {
                var oServerSideFacet = aServerSideFacets[i];

                if (oServerSideFacet.usage.Facet || oServerSideFacet.usage.AdvancedSearch) {
                    var oClientSideFacet = new Facet({
                        title: oServerSideFacet.label,
                        facetType: "attribute",
                        dimension: oServerSideFacet.id,
                        dataType: oServerSideFacet.type,
                        matchingStrategy: oServerSideFacet.matchingStrategy
                    });

                    var aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(oSearchModel.getProperty("/uiFilter/rootCondition"));
                    var count = 0;
                    for (var k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
                        var oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
                        if (oSelectedFacetItem.facetAttribute === oClientSideFacet.dimension) {
                            count++;
                            oClientSideFacet.items.splice(0, 0, oSelectedFacetItem);
                        }
                    }
                    oClientSideFacet.count = count;

                    aClientSideFacets.push(oClientSideFacet);
                }

            }

            //sorting by title
            aClientSideFacets.sort(function (a, b) {
                // if (a.title == b.title) {
                //     return 0;
                // }
                // return a.title > b.title ? 1 : -1;
                return a.title.localeCompare(b.title);
            });

            return aClientSideFacets;
        },

        getDialogFacetsFromChartQuery: function (resultSet, oSearchModel, bInitialFilters) {

            var oClientSideFacet = new Facet({
                dimension: oSearchModel.chartQuery.dimension
            });

            if (resultSet) {
                for (var j = 0; j < resultSet.items.length; j++) {
                    var oFacetListItem = resultSet.items[j];
                    var item = new FacetItem({
                        value: oFacetListItem.measureValue,
                        filterCondition: oFacetListItem.filterCondition,
                        label: oFacetListItem.dimensionValueFormatted,
                        facetAttribute: resultSet.query.dimension
                    });
                    oClientSideFacet.items.push(item);
                }

                // add filter conditions as facet items:
                var aFacetItemsWithFilterConditions;
                if (bInitialFilters) {
                    aFacetItemsWithFilterConditions = this._createFacetItemsFromConditionGroup(oSearchModel.getProperty("/uiFilter/rootCondition"));
                } else {
                    aFacetItemsWithFilterConditions = oSearchModel.aFilters;
                }

                for (var k = 0, lenK = aFacetItemsWithFilterConditions.length; k < lenK; k++) {
                    var oSelectedFacetItem = aFacetItemsWithFilterConditions[k];
                    if (oSelectedFacetItem.facetAttribute === oClientSideFacet.dimension) {
                        var facetItemFoundInFacet = false;
                        for (var m = 0, lenM = oClientSideFacet.items.length; m < lenM; m++) {
                            var facetItem = oClientSideFacet.items[m];
                            if (oSelectedFacetItem.filterCondition.equals(facetItem.filterCondition)) {
                                facetItem.selected = true;
                                facetItemFoundInFacet = true;
                            }
                        }
                        if (!facetItemFoundInFacet) {
                            // there is no such facet item -> add the facet item to the facet
                            oClientSideFacet.items.splice(oClientSideFacet.items.length, 0, oSelectedFacetItem);
                            if (oSelectedFacetItem.filterCondition.userDefined) {
                                oSelectedFacetItem.advanced = true;
                            } else {
                                oSelectedFacetItem.listed = true;
                                oSelectedFacetItem.value = "";
                                oSelectedFacetItem.valueLabel = "";
                            }
                        } else {
                            oSelectedFacetItem.listed = true;
                        }
                    }
                }
            }

            return oClientSideFacet;
        },

        hasDialogFacetsFromMetaData: function (oSearchModel) {
            var oMetaData = oSearchModel.getDataSource();
            var aServerSideFacets = jQuery.map(oMetaData.attributeMetadataMap, function (el) {
                return el;
            });
            var hasDialogFacets = false;

            // extract facets from server response:
            for (var i = 0, len = aServerSideFacets.length; i < len; i++) {
                var oServerSideFacet = aServerSideFacets[i];

                if (oServerSideFacet.usage) {
                    if (oServerSideFacet.usage.Facet || oServerSideFacet.usage.AdvancedSearch) { // TODO: ||, show more displays facets + advanced search
                        hasDialogFacets = true;
                        break;
                    }
                }

            }
            return hasDialogFacets;
        }
    };
    return module;
});
