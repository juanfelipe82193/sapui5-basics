/**
 * @fileOverview Miscellaneous utility functions for legacy cards.
 * See VizAnnotationManager.js for generic card methods.
 * This file can be safely deleted when legacy cards deprecate.
 */
sap.ui.define(["sap/ui/thirdparty/jquery", "sap/base/Log", "sap/base/util/each"],
    function (jQuery, Log, each) {
        "use strict";

        var oUtils = {};
        /* All constants feature here */
        var constants = {
            /* qualifiers for annotation terms */
            CHART_QUALIFIER_KEY: "chartAnnotationPath",
            SELVAR_QUALIFIER_KEY: "selectionAnnotationPath",
            PREVAR_QUALIFIER_KEY: "presentationAnnotationPath",
            /* DEBUG MESSAGES */
            ERROR_NO_CHART: "Analytic cards require valid \"chartAnnotationPath\" " +
            "configured in manifest.json",
            LABEL_KEY: "sap:label",
            TEXT_KEY: "sap:text",
            TYPE_KEY: "type"
        };

        var errorMessages = {
            CONFIG_LOAD_ERROR: "Failed to load config.json. Reason: ",
            CARD_ERROR: "OVP-AC: Analytic card Error: ",
            INVALID_CHARTTYPE: "Invalid ChartType given for ",
            ANNO_REF: "com.sap.vocabularies.UI.v1 annotation.",
            INVALID_CONFIG: "No valid configuration given for ",
            CONFIG_JSON: "in config.json",
            CACHING_ERROR: "no model defined while caching OdataMetaData"
        };

        /* retrieve qualifier from iContext */
        function getQualifier(iContext, annoTerm) {
            /* see sap.ovp.cards.charts.Utils.constants for legal values of annoTerm */
            if (!annoTerm) {
                return "";
            }
            var settingsModel = iContext.getSetting('ovpCardProperties');
            if (!settingsModel) {
                return "";
            }
            var oSettings = settingsModel.oData;
            if (!oSettings) {
                return "";
            }
            var fullQualifier = oSettings && oSettings[annoTerm] ? oSettings[annoTerm] : "";
            return fullQualifier === "" ? "" : fullQualifier.split("#")[1];
        }

        /************************ FORMATTERS ************************/
        /* Returns column name that contains the sap:text(s) for all properties in the metadata*/
        oUtils.getAllColumnTexts = function (entityTypeObject) {
            return getAllColumnProperties("sap:text", entityTypeObject);
        };

        oUtils.formDimensionPath = function (dimension) {
            var ret = "{" + dimension + "}";
            var entityTypeObject = this.getModel('ovpCardProperties').getProperty("/entityType");
            if (!entityTypeObject) {
                return ret;
            }
            var edmTypes = getEdmTypeOfAll(entityTypeObject);
            if (!edmTypes || !edmTypes[dimension]) {
                return ret;
            }
            var type = edmTypes[dimension];
            if (type == "Edm.DateTime") {
                return "{path:'" + dimension + "', formatter: 'sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat'}";
            }
            var columnTexts = oUtils.getAllColumnTexts(entityTypeObject);
            if (!columnTexts) {
                return ret;
            }
            ret = "{" + (columnTexts[dimension] || dimension) + "}";
            return ret;
        };

        /************************ METADATA PARSERS ************************/

        /* Returns the set of all properties in the metadata */
        function getAllColumnProperties(prop, entityTypeObject) {
            var finalObject = {};
            var properties = entityTypeObject.property;
            for (var i = 0, len = properties.length; i < len; i++) {
                if (properties[i].hasOwnProperty(prop) && prop == "com.sap.vocabularies.Common.v1.Label") {
                    finalObject[properties[i].name] = properties[i][prop].String;
                } else if (properties[i].hasOwnProperty(prop)) {
                    finalObject[properties[i].name] = properties[i][prop];
                } else {
                    finalObject[properties[i].name] = properties[i].name;
                }
            }
            return finalObject;
        }

        /* Returns column name that contains the sap:label(s) for all properties in the metadata*/
        function getAllColumnLabels(entityTypeObject) {
            return getAllColumnProperties("com.sap.vocabularies.Common.v1.Label", entityTypeObject);
        }

        /* get EdmType of all properties from $metadata */
        function getEdmTypeOfAll(entityTypeObject) {
            return getAllColumnProperties("type", entityTypeObject);
        }

        /************************ Line Chart functions ************************/

        var categoryAxisFeedList = {};

        oUtils.LineChart = (function () {

            function getVizProperties(iContext, dimensions, measures) {
                var rawValueAxisTitles = getValueAxisFeed(iContext, measures).split(",");
                var rawCategoryAxisTitles = getCategoryAxisFeed(iContext, dimensions).split(",");
                var valueAxisTitles = [];
                each(rawValueAxisTitles, function (i, m) {
                    valueAxisTitles.push(m);
                });
                var categoryAxisTitles = [];
                each(rawCategoryAxisTitles, function (i, d) {
                    categoryAxisTitles.push(d);
                });
                var bDatapointNavigation = true;
                var dNav = iContext.getSetting("ovpCardProperties").getProperty("/navigation");
                if (dNav == "chartNav") {
                    bDatapointNavigation = false;
                }
                var bDatapointNavigation = bDatapointNavigation ? false : true;
                return "{ valueAxis:{  layout: { maxWidth : 0.4 }, title:{   visible:false,   text: '" + valueAxisTitles.join(",") + "'  },  label:{   formatString:'axisFormatter'  } }, categoryAxis:{  title:{   visible:false,   text: '" + categoryAxisTitles.join(",") + "'  },  label:{   formatString:'axisFormatter'  } }, legend: {  isScrollable: false }, title: {  visible: false }, general: { groupData: false }, interaction:{  noninteractiveMode: " + bDatapointNavigation + ",  selectability: {   legendSelection: false,   axisLabelSelection: false,   mode: 'EXCLUSIVE',   plotLassoSelection: false,   plotStdSelection: true  }, zoom:{   enablement: 'disabled'} } }";
            }

            getVizProperties.requiresIContext = true;

            function getValueAxisFeed(iContext, measures) {
                var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
                if (!entityTypeObject) {
                    return "";
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var ret = [];
                each(measures, function (i, m) {
                    ret.push(columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath);
                });
                return ret.join(",");
            }

            getValueAxisFeed.requiresIContext = true;

            function getCategoryAxisFeed(iContext, dimensions) {
                var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
                if (!entityTypeObject) {
                    return "";
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var ret = [];
                var qualifier;
                var feedValue;
                each(dimensions, function (i, d) {
                    if (d.Role.EnumMember.split("/")[1] === "Category") {
                        feedValue = columnLabels[d.Dimension.PropertyPath];
                        ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
                    }
                });
                /*
                 * If no dimensions are given as category, pick first dimension as category
                 * (see Software Design Description UI5 Chart Control 3.1.2.2.1.1)
                 */
                if (ret.length < 1) {
                    feedValue = columnLabels[dimensions[0].Dimension.PropertyPath];
                    ret.push(feedValue ? feedValue : dimensions[0].Dimension.PropertyPath);
                }
                qualifier = getQualifier(iContext, constants.CHART_QUALIFIER_KEY);
                categoryAxisFeedList[qualifier] = ret;
                return ret.join(",");
            }

            getCategoryAxisFeed.requiresIContext = true;

            function getColorFeed(iContext, dimensions) {
                var ret = [];
                var qualifier;
                var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
                if (!entityTypeObject) {
                    return "";
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var feedValue;
                each(dimensions, function (i, d) {
                    if (d.Role.EnumMember.split("/")[1] === "Series") {
                        feedValue = columnLabels[d.Dimension.PropertyPath];
                        ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
                    }
                });
                /*
                 * If the dimensions is picked up for category feed as no category is given in the annotation,
                 * remove it from color feed.
                 * (see Software Design Description UI5 Chart Control 3.1.2.2.1.1)
                 */
                qualifier = getQualifier(iContext,
                    constants.CHART_QUALIFIER_KEY);
                ret = jQuery.grep(ret, function (value) {
                    if (!categoryAxisFeedList[qualifier]) {
                        return true;
                    }
                    return value !== categoryAxisFeedList[qualifier][0];
                });
                return ret.join(",");
            }

            getColorFeed.requiresIContext = true;

            function testColorFeed(iContext, dimensions) {
                return getColorFeed(iContext, dimensions) !== "";
            }

            testColorFeed.requiresIContext = true;

            return {
                getVizProperties: getVizProperties,
                getValueAxisFeed: getValueAxisFeed,
                getCategoryAxisFeed: getCategoryAxisFeed,
                getColorFeed: getColorFeed,
                testColorFeed: testColorFeed
            };
        })();

        /************************ Bubble Chart Functions ************************/

        oUtils.BubbleChart = (function () {

            function getVizProperties(iContext, dimensions, measures) {
                var rawValueAxisTitles = getValueAxisFeed(iContext, measures).split(",");
                var rawValueAxis2Titles = getValueAxis2Feed(iContext, measures).split(",");
                var valueAxisTitles = [];
                each(rawValueAxisTitles, function (i, m) {
                    valueAxisTitles.push(m);
                });
                var valueAxis2Titles = [];
                each(rawValueAxis2Titles, function (i, m) {
                    valueAxis2Titles.push(m);
                });
                var bDatapointNavigation = true;
                var dNav = iContext.getSetting("ovpCardProperties").getProperty("/navigation");
                if (dNav == "chartNav") {
                    bDatapointNavigation = false;
                }
                var bDatapointNavigation = bDatapointNavigation ? false : true;

                return "{ valueAxis:{  layout: { maxWidth : 0.4 }, title:{ visible:true, text: '" + valueAxisTitles.join(",") + "'  },  label:{ formatString:'axisFormatter'  } }, valueAxis2:{  title:{ visible:true, text: '" + valueAxis2Titles.join(",") + "'  },  label:{ formatString:'axisFormatter'  } }, categoryAxis:{  title:{ visible:true  },  label:{ formatString:'axisFormatter'  } }, legend: {  isScrollable: false }, title: {  visible: false }, interaction:{  noninteractiveMode: " + bDatapointNavigation + ",  selectability: { legendSelection: false, axisLabelSelection: false, mode: 'EXCLUSIVE', plotLassoSelection: false, plotStdSelection: true  }, zoom:{   enablement: 'disabled'} } }";
            }

            getVizProperties.requiresIContext = true;

            function getMeasurePriorityList(iContext, measures) {
                /* (see Software Design Description UI5 Chart Control - Bubble Chart) */
                var ovpCardPropertiesModel;
                if (!iContext || !iContext.getSetting || !(ovpCardPropertiesModel = iContext.getSetting('ovpCardProperties'))) {
                    return [""];
                }
                var entityTypeObject = ovpCardPropertiesModel.getProperty("/entityType");
                if (!entityTypeObject) {
                    return [""];
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var ret = [null, null, null];
                var axisList = ["Axis1", "Axis2", "Axis3"];
                each(measures, function (i, m) {
                    if (axisList.indexOf(m.Role.EnumMember.split("/")[1]) > -1) {
                        if (ret[0] === null) {
                            ret[0] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
                        } else if (ret[1] === null) {
                            ret[1] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
                        } else if (ret[2] == null) {
                            ret[2] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
                        }
                    }
                });
                return ret;
            }

            getMeasurePriorityList.requiresIContext = true;

            function getValueAxisFeed(iContext, measures) {
                return getMeasurePriorityList(iContext, measures)[0];
            }

            getValueAxisFeed.requiresIContext = true;

            function getValueAxis2Feed(iContext, measures) {
                return getMeasurePriorityList(iContext, measures)[1];
            }

            getValueAxis2Feed.requiresIContext = true;

            function getBubbleWidthFeed(iContext, measures) {
                return getMeasurePriorityList(iContext, measures)[2];
            }

            getBubbleWidthFeed.requiresIContext = true;

            function getColorFeed(iContext, dimensions) {
                var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
                if (!entityTypeObject) {
                    return "";
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var ret = [];
                var feedValue;
                each(dimensions, function (i, d) {
                    if (d.Role.EnumMember.split("/")[1] === "Series") {
                        feedValue = columnLabels[d.Dimension.PropertyPath];
                        ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
                    }
                });
                return ret.join(",");
            }

            getColorFeed.requiresIContext = true;

            function getShapeFeed(iContext, dimensions) {
                var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
                if (!entityTypeObject) {
                    return "";
                }
                var columnLabels = getAllColumnLabels(entityTypeObject);
                var ret = [];
                var feedValue;
                each(dimensions, function (i, d) {
                    if (d.Role.EnumMember.split("/")[1] === "Category") {
                        feedValue = columnLabels[d.Dimension.PropertyPath];
                        ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
                    }
                });
                return ret.join(",");
            }

            getShapeFeed.requiresIContext = true;

            function testColorFeed(iContext, dimensions) {
                return getColorFeed(iContext, dimensions) !== "";
            }

            testColorFeed.requiresIContext = true;

            function testShapeFeed(iContext, dimensions) {
                return getShapeFeed(iContext, dimensions) !== "";
            }

            testShapeFeed.requiresIContext = true;

            return {
                getVizProperties: getVizProperties,
                getMeasurePriorityList: getMeasurePriorityList,
                getValueAxisFeed: getValueAxisFeed,
                getValueAxis2Feed: getValueAxis2Feed,
                getBubbleWidthFeed: getBubbleWidthFeed,
                getColorFeed: getColorFeed,
                getShapeFeed: getShapeFeed,
                testColorFeed: testColorFeed,
                testShapeFeed: testShapeFeed
            };

        })();

        oUtils.validateMeasuresDimensions = function (vizFrame, type) {
            var measuresArr = null;
            var dimensionsArr = null;
            if (!vizFrame.getDataset()) {
                Log.error("OVP-AC: " + type + " Card Error: No Dataset defined for chart.");
                return false;
            }
            measuresArr = vizFrame.getDataset().getMeasures();
            dimensionsArr = vizFrame.getDataset().getDimensions();

            switch (type) {
                case "Bubble":
                    if (measuresArr.length !== 3 || dimensionsArr.length < 1 || !measuresArr[0].getName() || !measuresArr[1].getName() || !measuresArr[2].getName() || !dimensionsArr[0].getName()) {
                        Log.error("OVP-AC: Bubble Card Error: Enter exactly 3 measures and at least 1 dimension.");
                        return false;
                    }
                    break;

                case "Donut":
                    if (measuresArr.length !== 1 || dimensionsArr.length !== 1 || !measuresArr[0].getName() || !dimensionsArr[0].getName()) {
                        Log.error("OVP-AC: Donut Card Error: Enter exactly 1 measure and 1 dimension.");
                        return false;
                    }
                    break;

                case "Line":
                    if (measuresArr.length < 1 || dimensionsArr.length < 1 || !measuresArr[0].getName() || !dimensionsArr[0].getName()) {
                        Log.error("OVP-AC: Line Card Error: Configure at least 1 dimensions and 1 measure.");
                        return false;
                    }
                    break;
            }
            return true;
        };

        oUtils.getSortAnnotationCollection = function (dataModel, presentationVariant, entitySet) {
            if (presentationVariant && presentationVariant.SortOrder && presentationVariant.SortOrder.Path && presentationVariant.SortOrder.Path.indexOf('@') >= 0) {
                var sSortOrderPath = presentationVariant.SortOrder.Path.split('@')[1];
                var oAnnotationData = dataModel.getServiceAnnotations()[entitySet.entityType];
                return oAnnotationData[sSortOrderPath];
            }
            return presentationVariant.SortOrder;
        };

        oUtils.oFullConfig = null;
        oUtils.getConfig = function (oChartType) {
            //If calculated once, the configuration is already stored, no need to read again
            if (!this.oFullConfig) {
                try {
                    var sUrl = sap.ui.require.toUrl("sap/ovp/cards/charts/config.json");
                    var fullConfig;
                    jQuery.ajax({
                        type: "GET",
                        url: sUrl,
                        dataType: "json",
                        async: false,
                        headers: "",
                        success: function (data) {
                            fullConfig = jQuery.extend(true, {}, data);
                        },
                        error: function (oEvent) {
                            Log.error(oEvent);
                        }
                    });
                    this.oFullConfig = fullConfig;
                } catch (err) {
                    Log.error(errorMessages.CONFIG_LOAD_ERROR + err);
                }
            }
            //If chart type not provided, return whole configuration
            if (!oChartType) {
                return this.oFullConfig;
            }
            //Read the chart type from the annotation
            var sChartType;
            try {
                sChartType = oChartType.EnumMember.split("/")[1];
            } catch (err) {
                Log.error(errorMessages.CARD_ERROR + errorMessages.INVALID_CHARTTYPE + errorMessages.ANNO_REF);
                return {};
            }

            //Read the configuration for the particular chart type
            if (!this.oFullConfig[sChartType]) {
                Log.error(errorMessages.INVALID_CONFIG + sChartType + " " + errorMessages.CONFIG_JSON);
                return {};
            }


            var sReference;
            if ((sReference = this.oFullConfig[sChartType].reference) && this.oFullConfig[sReference]) {
                var oVirtualEntry = jQuery.extend(true, {}, this.oFullConfig[sReference]);
                this.oFullConfig[sChartType] = oVirtualEntry;
            }
            return this.oFullConfig[sChartType];
        };

        //Cache OData metadata information with key as UI5 ODataModel id.
        oUtils.oCachedMetaModel = {};
        oUtils.cacheODataMetadata = function (oModel) {
            if (!oModel) {
                Log.error(errorMessages.CARD_ERROR + errorMessages.CACHING_ERROR);
                //return if no oModel present
                return;
            }
            var oEntityPropertyMap = this.oCachedMetaModel[oModel.getId()];

            //calculate map for first time
            if (!oEntityPropertyMap) {
                oEntityPropertyMap = {};
                var oMetaModel = oModel.getMetaModel();
                var oEntityContainer = oMetaModel && oMetaModel.getODataEntityContainer();

                var oEntityType, oPropertyMap;
                each(oEntityContainer.entitySet, function (nEntityIndex, oEntitySet) {
                    oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                    oPropertyMap = {};

                    each(oEntityType.property, function (nPropertyIndex, oProperty) {
                        oPropertyMap[oProperty.name] = oProperty;
                    });
                    oEntityPropertyMap[oEntitySet.name] = oPropertyMap;
                });
                this.oCachedMetaModel[oModel.getId()] = oEntityPropertyMap;
            }
            return oEntityPropertyMap;
        };

        return oUtils;
    },
    /* bExport= */true);
