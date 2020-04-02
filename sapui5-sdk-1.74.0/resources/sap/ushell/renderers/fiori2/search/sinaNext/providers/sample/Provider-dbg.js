// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, $*/

sinaDefine(['../../core/core', '../../core/util', './template', './template2', '../../sina/NavigationTarget'], function (core, util, template, template2, NavigationTarget) {
    "use strict";

    return core.defineClass({

        id: 'sample',
        instanceCounterStr: "0",

        _initAsync: function (properties) {
            var that = this;
            that.sina = properties.sina;
            that.NavigationTarget = NavigationTarget;
            this.sina.util.sampleProviderInstanceCounter++;
            that.instanceCounterStr = "" + this.sina.util.sampleProviderInstanceCounter;
            var demoRoot;
            var forceSample = 0;
            if (document.location.href.indexOf("use=sample1") > 0) {
                forceSample = 1;
            } else if (document.location.href.indexOf("use=sample2") > 0) {
                forceSample = 2;
            }
            if (forceSample === 1) {
                that.templateProvider = template2; //the original template, scientists
            } else if (forceSample === 2) {
                that.templateProvider = template; //the newer template, folklorists
            } else if (parseInt(that.instanceCounterStr, 10) % 2 === 1) {
                that.templateProvider = template;
            } else {
                that.templateProvider = template2;
            }
            demoRoot = that.templateProvider(that);
            demoRoot._init(demoRoot);
            var res = core.Promise.resolve({
                capabilities: this.sina._createCapabilities({
                    fuzzy: false
                })
            });

            return res;
        },
        getSuggestionList: function (templateData) {
            var listAsString = this._stringify(templateData);
            /* eslint no-useless-escape:0 */
            var regexp = new RegExp("\"valueFormatted\"\:\"([^\{/]+?)\",\"valueHighlighted", "g");
            var matches = [];
            listAsString.replace(regexp, function () {
                matches.push(arguments[1]);
            });
            var singleWords = matches.toString().split(' ');
            singleWords = singleWords.toString().split(',');
            matches = matches.concat(singleWords);
            //matches = singleWords;
            matches = matches.filter(function (item, pos) {
                if (item !== '') {
                    return matches.indexOf(item) == pos;
                }
            });
            return matches;
        },
        _stringify: function (o) {
            var cache = [];
            var s = JSON.stringify(o, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return undefined;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
            cache = null; // Enable garbage collection
            return s;
        },
        adjustImageViewing: function () {
            var clonePic, top, left;
            try { //try catch added for require issues  during unit testing per qUnit
                $(".sapUshellSearchResultListItem-Image").on('mouseenter', function () {
                    //var pos = $(this).offset();
                    clonePic = $(this).clone();
                    $('body').append(clonePic);

                    top = ($(window).height() - $(clonePic).outerHeight()) * 0.33;
                    left = ($(window).width() - $(clonePic).outerWidth()) * 0.33;

                    //var w = clonePic[0].width;
                    clonePic.css({
                        position: "absolute",
                        top: top + "px",
                        left: left + "px"
                    }).show();
                });

                $(".sapUshellSearchResultListItem-Image").on('mouseleave', function () {
                    clonePic.remove();
                });
            } catch (error) {
                //do nothing
            }
        },
        applyFilters: function (items, searchQuery) {
            var newItemsArray = [];
            if (!searchQuery.filter.rootCondition.conditions.length > 0 || !searchQuery.filter.rootCondition.conditions[0].conditions.length > 0) {
                return items;
            }
            var toBeDimensionValuePairsArray = [];
            var toBeDimensionsArray = [];
            for (var g = 0; g < searchQuery.filter.rootCondition.conditions.length; g++) {
                var conditions = searchQuery.filter.rootCondition.conditions[g].conditions;
                for (var h = 0; h < conditions.length; h++) {
                    //conditions[j].attribute; //eg LOCATION
                    //conditions[j].value; //eg Galapagos
                    toBeDimensionValuePairsArray.push([conditions[h].attribute, conditions[h].value]);
                    toBeDimensionsArray.push(conditions[h].attribute);
                }
            }
            var fits = false;
            for (var i = 0; i < items.length; i++) { //compare items with collected to-be-valid conditions
                var item = items[i];
                var fitsArray = [];
                for (var j = 0; j < toBeDimensionValuePairsArray.length; j++) {
                    fits = false;
                    for (var k = 0; k < item.detailAttributes.length; k++) { //loop thru all detailAttributes of item
                        var detailAttribute = item.detailAttributes[k];
                        if (detailAttribute.id === toBeDimensionValuePairsArray[j][0] && detailAttribute.value === toBeDimensionValuePairsArray[j][1]) {
                            fits = true;
                        }
                    }
                    for (var m = 0; m < item.titleAttributes.length; m++) { //loop thru all titleAttributes of item
                        var titleAttribute = item.titleAttributes[m];
                        if (titleAttribute.id === toBeDimensionValuePairsArray[j][0] && titleAttribute.value === toBeDimensionValuePairsArray[j][1]) {
                            fits = true;
                        }
                    }
                    toBeDimensionValuePairsArray[j][2] = fits;
                    fitsArray.push(fits);
                }
                if (fitsArray.toString().match(/false/) === null) {
                    newItemsArray.push(item);
                } else {
                    //see it there is one 'true' match for each unique dimension, if so we can still add item
                    var fitsArray2 = [];
                    var uniqueDimensionsArray = toBeDimensionsArray.filter(function (item, pos) {
                        return toBeDimensionsArray.indexOf(item) == pos;
                    });
                    for (var n = 0; n < uniqueDimensionsArray.length; n++) {
                        fits = false;
                        var dimension = uniqueDimensionsArray[n];
                        for (var p = 0; p < toBeDimensionValuePairsArray.length; p++) {
                            if (toBeDimensionValuePairsArray[p][0] === dimension && toBeDimensionValuePairsArray[p][2] === true) {
                                fits = true;
                                break;
                            }
                        }
                        fitsArray2.push(fits);
                    }
                    if (fitsArray2.toString().match(/false/) === null) {
                        newItemsArray.push(item);
                    }
                }

            }

            return newItemsArray;
        },
        adjustHighlights: function (items, searchTerm) {
            var newItemsArray = [];
            var attrMetadataType = "";
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var neverFound = true;
                attrMetadataType = "";
                item.titleHighlighted = this.addHighlight(item.title, searchTerm);

                if (item.titleHighlighted !== item.title) {
                    neverFound = false;
                }
                for (var j = 0; j < item.detailAttributes.length; j++) {
                    var detailAttr = item.detailAttributes[j];
                    attrMetadataType = detailAttr.metadata.type;
                    if (attrMetadataType === "String" || attrMetadataType === "Integer") {
                        detailAttr.valueHighlighted = this.addHighlight(detailAttr.valueFormatted, searchTerm);
                        if (detailAttr.valueHighlighted !== detailAttr.valueFormatted) {
                            neverFound = false;
                        }
                    }
                }
                for (var k = 0; k < item.titleAttributes.length; k++) {
                    var titleAttr = item.titleAttributes[k];
                    attrMetadataType = titleAttr.metadata.type;
                    //  KLUDGE!! ImageUrl added to the following for publications / document links
                    if (attrMetadataType === "String" || attrMetadataType === "Integer" || attrMetadataType === "ImageUrl") {
                        titleAttr.valueHighlighted = this.addHighlight(titleAttr.valueFormatted, searchTerm);
                        if (titleAttr.valueHighlighted !== titleAttr.valueFormatted) {
                            neverFound = false;
                        }
                    }
                }
                if (neverFound === false || searchTerm === "*") {
                    newItemsArray.push(item);
                }
            }
            return newItemsArray;
        },
        addHighlight: function (hText, searchTerm) {
            if (typeof hText !== "string" || typeof searchTerm !== "string") {
                return hText;
            }
            var pos1 = hText.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (pos1 > -1) {
                var pos2 = pos1 + searchTerm.length;
                var newHText = hText.substring(0, pos1) + '<b>' + hText.substring(pos1, pos2) + '</b>' + hText.substring(pos2);
                return newHText;
            }
            return hText;

        },
        addSuvLinkToSearchResultItem: function (searchResultItem, suvPath, searchTermsArray) {
            var suvNavTargetResolver = this.sina._createSuvNavTargetResolver();
            if (!suvPath) {
                suvPath = '/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/renderers/fiori2/search/sinaNext/providers/sample/docs/folklorist_authors_and_publications.suv';
            }
            if (!searchTermsArray) {
                searchTermsArray = [];
            }
            var suvAttributes = {};
            suvAttributes.obj = {
                suvThumbnailAttribute: searchResultItem,
                suvTargetMimeTypeAttribute: {
                    value: 'application/vnd.sap.universal-viewer+suv'
                },
                suvTargetUrlAttribute: {
                    value: suvPath
                }
            };
            suvNavTargetResolver.resolveSuvNavTargets(null, suvAttributes, searchTermsArray);

        },
        augmentDetailAttributes: function (resultItemArray) {
            for (var i = 0; i < resultItemArray.length; i++) {
                var attributesArray = resultItemArray[i].detailAttributes;
                for (var j = 0; j < attributesArray.length; j++) {
                    var attribute = attributesArray[j];
                    attribute = util.addPotentialNavTargetsToAttribute(this.sina, attribute);
                }
            }
            return resultItemArray;
        },

        executeSearchQuery: function (searchQuery) {
            var that = this;
            that.searchQuery = searchQuery;
            return new core.Promise(function (resolve, reject) {
                var resultSet, searchTerm, dataSourceId;
                var itemsRoot = that.templateProvider(that);
                var items1 = itemsRoot.searchResultSetItemArray;
                items1 = that.augmentDetailAttributes(items1);
                var items2 = itemsRoot.searchResultSetItemArray2;
                items2 = that.augmentDetailAttributes(items2);
                var itemsAll = items1.concat(items2);
                var items3;
                if (itemsRoot.searchResultSetItemArray3) {
                    items3 = itemsRoot.searchResultSetItemArray3;
                    itemsAll = items1.concat(items3);
                }


                that.searchQuery = searchQuery;
                searchTerm = searchQuery.filter.searchTerm;
                dataSourceId = searchQuery.filter.dataSource.id;
                var facets1 = that.generateFacets(searchQuery);

                var items;
                if (dataSourceId === "Scientists" || dataSourceId === "Folklorists") {
                    items = that.adjustHighlights(items1, searchTerm);
                    items = that.applyFilters(items, searchQuery);
                    resultSet = that.sina._createSearchResultSet({
                        items: items,
                        facets: facets1,
                        type: "",
                        query: searchQuery,
                        title: "",
                        totalCount: items.length
                    });

                } else if (dataSourceId === "Mysterious_Sightings" || dataSourceId === "Urban_Legends") {
                    items = that.adjustHighlights(items2, searchTerm);
                    items = that.applyFilters(items, searchQuery);
                    resultSet = that.sina._createSearchResultSet({
                        items: items,
                        facets: facets1,
                        type: "",
                        query: searchQuery,
                        title: "",
                        totalCount: items.length
                    });
                } else if (dataSourceId === "Publications") {
                    items = that.adjustHighlights(items3, searchTerm);
                    items = that.applyFilters(items, searchQuery);
                    resultSet = that.sina._createSearchResultSet({
                        items: items,
                        facets: facets1,
                        type: "",
                        query: searchQuery,
                        title: "",
                        totalCount: items.length
                    });
                } else if (dataSourceId === "All") {
                    //calculate total counts for each sub branch of 'all'
                    items = that.adjustHighlights(items1, searchTerm);
                    items = that.applyFilters(items, searchQuery);
                    var totalCount1 = items.length;

                    items = that.adjustHighlights(items2, searchTerm);
                    items = that.applyFilters(items, searchQuery);
                    var totalCount2 = items.length;
                    var totalCount3 = "";
                    if (items3) {
                        items = that.adjustHighlights(items3, searchTerm);
                        items = that.applyFilters(items, searchQuery);
                        totalCount3 = items.length;
                    }

                    facets1[0].items[0].measureValue = totalCount1; //scientists
                    facets1[0].items[0].measureValueFormatted = '' + totalCount1;

                    facets1[0].items[1].measureValue = totalCount2; //mysterious sightings
                    facets1[0].items[1].measureValueFormatted = '' + totalCount2;

                    if (items3 && facets1[0].items.length > 2) {
                        facets1[0].items[2].measureValue = totalCount3; //publications
                        facets1[0].items[2].measureValueFormatted = '' + totalCount3;
                    }

                    //proceed to insert facets into resultSet
                    items = that.adjustHighlights(itemsAll, searchTerm);
                    items = that.applyFilters(items, searchQuery);

                    resultSet = that.sina._createSearchResultSet({
                        items: items,
                        facets: facets1,
                        type: "",
                        query: searchQuery,
                        title: "",
                        totalCount: items.length
                    });
                }


                // window.setTimeout(that.adjustImageViewing, 1000);

                resolve(resultSet);

            });

        },
        executeSuggestionQuery: function (query) {
            var that = this;
            var searchTerm = query.filter.searchTerm;
            var demoRoot = this.templateProvider(this);
            var searchAbleItems = demoRoot.searchResultSetItemArray.concat(demoRoot.searchResultSetItemArray2).concat(demoRoot.searchResultSetItemArray3);
            var suggestionTerms = this.getSuggestionList(searchAbleItems); //"Sally Spring,Galapagos,Female,Barry Williamson,Off East Cyprus,Male,Conrad Atkinson,Baalbek, Lebanon,Roger Murdoch,Wycliffe Well"
            //to do: limit suggestion terms to what matches start of search term
            var suggestionsMatchingSearchterm = suggestionTerms.filter(function (s) {
                var regexp = new RegExp("^" + searchTerm, "gi");
                return s.match(regexp);
            });
            if (suggestionsMatchingSearchterm.length === 0) {
                suggestionsMatchingSearchterm = suggestionTerms;
            }
            var suggestions = [];

            var SuggestionItem = function (term) {
                var calculationMode = that.sina.SuggestionCalculationMode.Data;
                var filter = query.filter.clone();
                filter.setSearchTerm(term);
                return that.sina._createSearchTermSuggestion({
                    searchTerm: term,
                    calculationMode: calculationMode,
                    filter: filter,
                    label: term
                });
            };
            for (var i = 0; i < suggestionsMatchingSearchterm.length; i++) {
                suggestions.push(new SuggestionItem(suggestionsMatchingSearchterm[i]));
            }

            var resultSet = this.sina._createSuggestionResultSet({
                title: 'Suggestions',
                query: query,
                items: suggestions
            });

            return new core.Promise(function (resolve, reject) {

                resolve(resultSet);

            });
        },
        executeChartQuery: function (query) {

            var chartResultSetItems = this.generateFacets(query);
            var whichChart = 1; //scientists
            if (query.dimension === "LOCATION" || chartResultSetItems.length === 1) {
                whichChart = 0;
            }
            return new core.Promise(function (resolve, reject) {
                resolve(chartResultSetItems[whichChart]);

            });

        },
        getChartResultSetItemsForLocations: function (resultSetItemsArray) {
            var chartResultSetItems = [];
            var that = this;
            var location;
            var locations = [];
            var chartResultSetItem, i, j, k, attrs;
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].detailAttributes;
                for (j = 0; j < attrs.length; j++) {

                    if (attrs[j].id === "LOCATION") {
                        location = attrs[j].value;
                        if (locations.indexOf(location) === -1) { //new location
                            locations.push(location);
                            chartResultSetItem = that.sina._createChartResultSetItem({
                                filterCondition: that.sina.createSimpleCondition({
                                    attribute: "LOCATION",
                                    operator: that.sina.ComparisonOperator.Equals,
                                    value: location
                                }),
                                dimensionValueFormatted: location,
                                measureValue: 1,
                                measureValueFormatted: '1',
                                dataSource: that.searchQuery.filter.dataSource
                            });

                            chartResultSetItems.push(chartResultSetItem);
                        } else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === location) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted = '' + chartResultSetItems[k].measureValue;
                                }

                            }
                        }
                    }
                }
            }
            return chartResultSetItems;
        },
        getChartResultSetItemsForPublications: function (resultSetItemsArray) {
            var chartResultSetItems = [];
            var that = this;
            var location;
            var locations = [];
            var chartResultSetItem, i, j, k, attrs;
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].detailAttributes;
                for (j = 0; j < attrs.length; j++) {

                    if (attrs[j].id === "PUBLICATION") {
                        location = attrs[j].value;
                        if (locations.indexOf(location) === -1) { //new location
                            locations.push(location);
                            chartResultSetItem = that.sina._createChartResultSetItem({
                                filterCondition: that.sina.createSimpleCondition({
                                    attribute: "PUBLICATION",
                                    operator: that.sina.ComparisonOperator.Equals,
                                    value: location
                                }),
                                dimensionValueFormatted: location,
                                measureValue: 1,
                                measureValueFormatted: '1',
                                dataSource: that.searchQuery.filter.dataSource
                            });

                            chartResultSetItems.push(chartResultSetItem);
                        } else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === location) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted = '' + chartResultSetItems[k].measureValue;
                                }

                            }
                        }
                    }
                }
            }
            return chartResultSetItems;
        },
        getSientistOrFolkloristFacet: function (searchQuery, resultSetItemsArray) {
            var that = this;
            var scientist;
            var scientists = [];
            var chartResultSetItem, i, j, k, attrs, dimension;
            var chartResultSetItems = [];
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].titleAttributes; //for folklorists and scientists
                if (searchQuery.filter.dataSource.id === "Mysterious_Sightings" || searchQuery.filter.dataSource.id === "Urban_Legends" || searchQuery.filter.dataSource.id === "Publications") {
                    attrs = resultSetItemsArray[i].detailAttributes;
                }
                for (j = 0; j < attrs.length; j++) {

                    if (attrs[j].id === "SCIENTIST" || attrs[j].id === "FOLKLORIST") {
                        scientist = attrs[j].value;
                        dimension = attrs[j].id;
                        if (scientists.indexOf(scientist) === -1) { //this particular scientist is not listed yet
                            scientists.push(scientist);
                            chartResultSetItem = that.sina._createChartResultSetItem({
                                filterCondition: that.sina.createSimpleCondition({
                                    attribute: attrs[j].id,
                                    operator: that.sina.ComparisonOperator.Equals,
                                    value: scientist
                                }),
                                dimensionValueFormatted: scientist,
                                measureValue: 1,
                                measureValueFormatted: '1',
                                dataSource: that.searchQuery.filter.dataSource
                            });

                            chartResultSetItems.push(chartResultSetItem);
                        } else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === scientist) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted = '' + chartResultSetItems[k].measureValue;
                                }

                            }
                        }
                    }
                }
            }
            return [chartResultSetItems, dimension];
        },
        getTopFacetOnly: function (searchQuery) {
            var that = this;
            var dataSource = searchQuery.filter.sina.allDataSource;
            var dataSourceItems = [that.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[1],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 4,
                    measureValueFormatted: '4' //4 scientists currently
                }),
                that.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[2],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 5,
                    measureValueFormatted: '5' //5 sightings currently
                }),
                that.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[3],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 1,
                    measureValueFormatted: '1' //1 publication currently
                })
            ];

            var dataSourceFacets = [that.sina._createDataSourceResultSet({
                title: searchQuery.filter.dataSource.label,
                titleHighlighted: searchQuery.filter.dataSource.label,
                items: dataSourceItems,
                query: searchQuery
            })];
            return dataSourceFacets;
        },
        generateFacets: function (searchQuery) {
            var that = this;

            if (searchQuery.filter.dataSource.id === "All") {
                return that.getTopFacetOnly(searchQuery);
            }
            var chartResultSetArray = [];
            var chartResultSet;
            var gen = this.templateProvider(this);

            var filter = that.sina.createFilter({
                searchTerm: that.searchQuery.filter.searchTerm,
                dataSource: that.searchQuery.filter.dataSource,
                rootCondition: that.searchQuery.filter.rootCondition.clone()
            });
            var chartResultSetItems = [];
            var resultSetItemsArray, info, dimension;

            /*
             *
             *           get the right resultsetitems
             *
             */

            if (searchQuery.filter.dataSource.id === "Publications") {
                resultSetItemsArray = gen.searchResultSetItemArray3;
            } else if (searchQuery.filter.dataSource.id === "Scientists" || searchQuery.filter.dataSource.id === "Folklorists") {

                resultSetItemsArray = gen.searchResultSetItemArray;
            } else if (searchQuery.filter.dataSource.id === "Urban_Legends" || searchQuery.filter.dataSource.id === "Mysterious_Sightings") {
                resultSetItemsArray = gen.searchResultSetItemArray2;
            }

            /*
             *
             *           Location Facet
             *
             */
            if (searchQuery.filter.dataSource.id === "Scientists" || searchQuery.filter.dataSource.id === "Mysterious_Sightings") {


                chartResultSetItems = that.getChartResultSetItemsForLocations(resultSetItemsArray);

                chartResultSet = that.sina._createChartResultSet({
                    items: chartResultSetItems,
                    query: that.sina.createChartQuery({
                        filter: filter,
                        dimension: "LOCATION"
                    }),
                    title: "Locations",
                    type: ''
                });
                chartResultSetArray.push(chartResultSet);
            }
            /*
             *
             *           Scientist or Folklorist Facet
             *
             */


            info = that.getSientistOrFolkloristFacet(searchQuery, resultSetItemsArray);
            chartResultSetItems = info[0];
            dimension = info[1];

            chartResultSet = that.sina._createChartResultSet({
                items: chartResultSetItems,
                query: that.sina.createChartQuery({
                    filter: filter,
                    dimension: dimension
                }),
                title: dimension.charAt(0).toUpperCase() + dimension.slice(1).toLowerCase() + "s",
                type: ''
            });
            chartResultSetArray.push(chartResultSet);

            /*
             *
             *           Publication Facet - doesn't work! confirm with holger?
             *
            

            if (searchQuery.filter.dataSource.id === "Publications") {

                chartResultSetItems = that.getChartResultSetItemsForPublications(resultSetItemsArray);

                chartResultSet = that.sina._createChartResultSet({
                    items: chartResultSetItems,
                    query: that.sina.createChartQuery({
                        filter: filter,
                        dimension: "PUBLICATION"
                    }),
                    title: "Publications",
                    type: ''
                });
                chartResultSetArray.push(chartResultSet);
            }
 */

            return chartResultSetArray;

        }

    });

});
