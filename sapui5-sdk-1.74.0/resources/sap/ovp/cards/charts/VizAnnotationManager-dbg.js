/**
 * @fileOverview Library to Manage rendering of Viz Charts.
 *
 * Any function that needs to be exported(used outside this file) via namespace should be defined as
 * a function and then added to the return statement at the end of this file
 */
sap.ui.define(["sap/ui/thirdparty/jquery", "sap/ovp/cards/charts/Utils", "sap/ui/model/odata/CountMode",
        "sap/ovp/cards/AnnotationHelper", "sap/ui/core/format/NumberFormat", "sap/ui/core/format/DateFormat",
        "sap/viz/ui5/api/env/Format", "sap/viz/ui5/controls/VizTooltip", "sap/ovp/cards/CommonUtils",
        "sap/ovp/cards/OVPCardAsAPIUtils", "sap/viz/ui5/data/DimensionDefinition",
        "sap/viz/ui5/data/MeasureDefinition", "sap/viz/ui5/controls/common/feeds/FeedItem", "sap/ui/core/Element", "sap/ovp/app/resources",
        "sap/ovp/app/OVPUtils", "sap/base/Log", "sap/base/util/each"],
    function (jQuery, Utils, CountMode, CardAnnotationHelper, NumberFormat, DateFormat,
              VizFormat, VizTooltip, CommonUtils, OVPCardAsAPIUtils, DimensionDefinition,
              MeasureDefinition, FeedItem, CoreElement, OvpResources, OVPUtils, Log, each) {
        "use strict";

        /* All constants feature here */
        var constants = {
            LABEL_KEY: "sap:label",
            LABEL_KEY_V4: "com.sap.vocabularies.Common.v1.Label", //as part of supporting V4 annotation
            TEXT_KEY: "sap:text",
            TEXT_KEY_V4: "com.sap.vocabularies.Common.v1.Text", //as part of supporting V4 annotation
            TEXT_ARRANGEMENT_ANNO: "com.sap.vocabularies.UI.v1.TextArrangement",
            TYPE_KEY: "type",
            DISPLAY_FORMAT_KEY: "sap:display-format",
            SEMANTICS_KEY: "sap:semantics",
            UNIT_KEY: "sap:unit",
            UNIT_KEY_V4_ISOCurrency: "Org.OData.Measures.V1.ISOCurrency", //as part of supporting V4 annotation
            UNIT_KEY_V4_Unit: "Org.OData.Measures.V1.Unit", //as part of supporting V4 annotation
            CURRENCY_CODE: "currency-code",
            NAME_KEY: "name",
            NAME_CAP_KEY: "Name",
            EDM_TYPE: "type",
            EDM_INT32: "Edm.Int32",
            EDM_INT64: "Edm.Int64",
            SCATTER_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Scatter",
            BUBBLE_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Bubble",
            LINE_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Line",
            COLUMNSTACKED_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked",
            VERTICALBULLET_CHARTTYPE:"com.sap.vocabularies.UI.v1.ChartType/VerticalBullet",
            COLUMN_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Column",
            COMBINATION_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Combination",
            DONUT_CHARTTYPE: "com.sap.vocabularies.UI.v1.ChartType/Donut"
        };

        /* All constants for error messages feature here */
        var errorMessages = {
            CARD_WARNING: "OVP-AC: Analytic card: Warning: ",
            CARD_ERROR: "OVP-AC: Analytic card Error: ",
            DATA_ANNO_ERROR: "OVP-AC: Analytic card Error:",
            CARD_ANNO_ERROR: "OVP-AC: Analytic card: Error ",
            CHART_ANNO_ERROR: "OVP-AC: Analytic card: Error ",
            INVALID_CHART_ANNO: "OVP-AC: Analytic Cards: Invalid Chart Annotation.",
            ANALYTICAL_CONFIG_ERROR: "Analytic card configuration error",
            CACHING_ERROR: "no model defined while caching OdataMetaData",
            INVALID_MAXITEMS: "maxItems is Invalid. ",
            NO_DATASET: "OVP-AC: Analytic Cards: Could not obtain dataset.",
            SORTORDER_WARNING: "SortOrder is present in PresentationVariant, but it is empty or not well formed.",
            BOOLEAN_ERROR: "Boolean value is not present in PresentationVariant.",
            IS_MANDATORY: "is mandatory.",
            IS_MISSING: "is missing.",
            NOT_WELL_FORMED: "is not found or not well formed)",
            MISSING_CHARTTYPE: "Missing ChartType in ",
            CHART_ANNO: "Chart Annotation.",
            DATA_ANNO: "Data Annotation",
            CARD_ANNO: "card annotation.",
            CARD_CONFIG: "card configuration.",
            CARD_CONFIG_ERROR: "Could not obtain configuration for ",
            CARD_CONTAINER_ERROR: "Could not obtain card container. ",
            DATA_UNAVAIALABLE: "No data available.",
            CONFIG_LOAD_ERROR: "Failed to load config.json. Reason: ",
            INVALID_CHARTTYPE: "Invalid ChartType given for ",
            INVALID_CONFIG: "No valid configuration given for ",
            CONFIG_JSON: "in config.json",
            ENTER_INTEGER: "Please enter an Integer.",
            NO_CARD_MODEL: "Could not obtain Cards model.",
            ANNO_REF: "com.sap.vocabularies.UI.v1 annotation.",
            INVALID_REDUNDANT: "Invalid/redundant role configured for ",
            CHART_IS: "chart is/are ",
            CARD_CONFIG_JSON: "card from config.json",
            ALLOWED_ROLES: "Allowed role(s) for ",
            DIMENSIONS_MANDATORY: "DimensionAttributes are mandatory.",
            MEASURES_MANDATORY: "MeasureAttributes are mandatory.",
            CARD_LEAST: "card: Enter at least ",
            CARD_MOST: "card: Enter at most ",
            FEEDS: "feed(s).",
            MIN_FEEDS: "Minimum number of feeds required for ",
            FEEDS_OBTAINED: "card is not configured. Obtained ",
            FEEDS_REQUIRED: "feed(s), Required: ",
            INVALID_SEMANTIC_MEASURES: "More than one measure is being semantically coloured",
            INVALID_IMPROVEMENT_DIR: "No Improvement Direction Found",
            INVALID_CRITICALITY: "Invalid criticality values",
            INVALID_DIMMEAS: "Invalid number of Measures or Dimensions",
            INVALID_FORECAST: "Invalid/Redundant Datapoint or Forecast measure",
            INVALID_TARGET: "Invalid/Redundant Datapoint or Target measure",
            ERROR_MISSING_AXISSCALES: "Minimum and Maximum values are mandatory for AxisScale MinMax to work"
        };

        var aSupportedDateSemantics = ["yearweek", "yearmonth", "yearquarter"];

        var oGlobalEntityType;
        /*
         * Reads filters from annotation and prepares data binding path
         */
        function formatItems(iContext, oEntitySet, oSelectionVariant, oPresentationVariant, oDimensions, oMeasures, chartType) {

            var ret = "{";
            if (!iContext || !iContext.getSetting('ovpCardProperties')) {
                Log.error(errorMessages.ANALYTICAL_CONFIG_ERROR);
                ret += "}";
                return ret;
            }
            var dataModel = iContext.getSetting("dataModel");
            var chartEnumArr;
            if (chartType && chartType.EnumMember) {
                chartEnumArr = chartType.EnumMember.split("/");
                if (chartEnumArr && ( chartEnumArr[1] === 'Donut' )) {
                    dataModel.setDefaultCountMode(CountMode.Inline);
                }
                if (chartEnumArr && ( chartEnumArr[1] != 'Donut' ) && (oDimensions === undefined)) {
                    return null;
                }
            }

            var dimensionsList = [];
            var aExpand = [];
            var aAssociationKeys = [];
            var aTempAssociationKeyArr = [];
            var measuresList = [];
            var requestList = [];
            var sorterList = [];
            var bParams = oSelectionVariant && oSelectionVariant.Parameters;
            var bSorter = oPresentationVariant && oPresentationVariant.SortOrder;
            var maxItemTerm = oPresentationVariant && oPresentationVariant.MaxItems, maxItems = null;
            var tmp;
            var sExpand;
            var textPath;
            var entitySet = null;
            var textKey = constants.TEXT_KEY;
            var textKeyV4 = constants.TEXT_KEY_V4; //as part of supporting V4 annotation
            var unitKey = constants.UNIT_KEY;
            var unitKey_v4_isoCurrency = constants.UNIT_KEY_V4_ISOCurrency; //as part of supporting V4 annotation
            var unitKey_v4_unit = constants.UNIT_KEY_V4_Unit; //as part of supporting V4 annotation
            var oSelectItems = {};

            if (maxItemTerm) {
                maxItems = maxItemTerm.Int32 ? maxItemTerm.Int32 : maxItemTerm.Int;
            }

            if (maxItems) {
                if (maxItems === "0") {
                    Log.error("OVP-AC: Analytic card Error: maxItems is configured as " + maxItems);
                    ret += "}";
                    return ret;
                }
                if (!/^\d+$/.test(maxItems)) {
                    Log.error("OVP-AC: Analytic card Error: maxItems is Invalid. Please enter an Integer.");
                    ret += "}";
                    return ret;
                }
            }

            var ovpCardProperties = iContext.getSetting('ovpCardProperties'),
                aParameters = ovpCardProperties.getProperty('/parameters');
            var oMetaModel = ovpCardProperties.getProperty("/metaModel");

            bParams = bParams || !!aParameters;

            if (bParams) {
                var path = CardAnnotationHelper.resolveParameterizedEntitySet(dataModel, oEntitySet, oSelectionVariant, aParameters);
                ret += "path: '" + path + "'";
            } else {
                ret += "path: '/" + oEntitySet.name + "'";
            }

            var filters = [];

            entitySet = iContext.getSetting('ovpCardProperties').getProperty("/entitySet");
            if (!dataModel || !entitySet) {
                return ret;
            }
            var oMetadata = getMetadata(dataModel, entitySet);

            var cardLayout = iContext.getSetting('ovpCardProperties').getProperty("/cardLayout");
            var colSpan = 1, colSpanOffset;
            var allConfig = getConfig();
            var config;
            var reference;

            if (oDimensions && cardLayout && cardLayout.colSpan && cardLayout.colSpan > 1) {
                colSpanOffset = cardLayout.colSpan - colSpan;

                for (var key in allConfig) {
                    if ((reference = allConfig[key].reference) &&
                        allConfig[reference]) {
                        var virtualEntry = jQuery.extend(true, {}, allConfig[reference]);
                        allConfig[key] = virtualEntry;
                    }
                    if (key === chartEnumArr[1] || (allConfig[key].time && allConfig[key].time.type === chartEnumArr[1].toLowerCase())) {
                        config = allConfig[key];
                        break;
                    }
                }

                var bSupportsTimeSemantics = hasTimeSemantics(oDimensions, config, dataModel, entitySet);
                if (bSupportsTimeSemantics) {
                    config = config.time;
                } else {
                    config = config.default;
                }

                var dataStep = iContext.getSetting('ovpCardProperties').getProperty("/dataStep");
                if (!dataStep) {
                    if (config.resize && config.resize.hasOwnProperty("dataStep") && !isNaN(config.resize.dataStep)) {
                        dataStep = config.resize.dataStep;
                    }
                }

                dataStep = parseInt(dataStep, 10);

                if (colSpanOffset > 0 && dataStep && !isNaN(dataStep)) {
                    maxItems = parseInt(maxItems, 10) + dataStep * colSpanOffset;
                }

            }

            // The filters specified in the card and the selection variant
            // are both merged in the getFilters function
            if (oSelectionVariant) {
                var ovpCardProperties = iContext.getSetting('ovpCardProperties');
                filters = CardAnnotationHelper.getFilters(ovpCardProperties, oSelectionVariant);
            }

            if (filters.length > 0) {
                ret += ", filters: " + JSON.stringify(filters);
            }

            if (bSorter) {
                var oSortAnnotationCollection = oPresentationVariant.SortOrder;
                if (!oSortAnnotationCollection.length) {
                    oSortAnnotationCollection = Utils.getSortAnnotationCollection(dataModel, oPresentationVariant, oEntitySet);
                }
                if (oSortAnnotationCollection.length < 1) {
                    Log.warning(errorMessages.CARD_WARNING + errorMessages.SORTORDER_WARNING);
                } else {
                    var sSorterValue = "";
                    var oSortOrder;
                    var sSortOrder;
                    var sSortBy;
                    for (var i = 0; i < oSortAnnotationCollection.length; i++) {
                        oSortOrder = oSortAnnotationCollection[i];
                        sSortBy = oSortOrder.Property.PropertyPath;
                        sorterList.push(sSortBy);
                        if (typeof oSortOrder.Descending === "undefined") {
                            sSortOrder = 'true';
                        } else {
                            var checkFlag = oSortOrder.Descending.Bool || oSortOrder.Descending.Boolean;
                            if (!checkFlag) {
                                Log.warning(errorMessages.CARD_WARNING + errorMessages.BOOLEAN_ERROR);
                                sSortOrder = 'true';
                            } else {
                                sSortOrder = checkFlag.toLowerCase() === 'true' ? 'true' : 'false';
                            }
                        }
                        sSorterValue = sSorterValue + "{path: '" + sSortBy + "',descending: " + sSortOrder + "},";
                    }
                    /* trim the last ',' */
                    ret += ", sorter: [" + sSorterValue.substring(0, sSorterValue.length - 1) + "]";
                }
            }

            var entityTypeObject = iContext.getSetting("ovpCardProperties").getProperty("/entityType");

            each(oMeasures, function (i, m) {
                tmp = m.Measure.PropertyPath;
                if (m.DataPoint && m.DataPoint.AnnotationPath) {
                    var datapointAnnotationPath = entityTypeObject[m.DataPoint.AnnotationPath.substring(1)];
                    if (datapointAnnotationPath.ForecastValue && (datapointAnnotationPath.ForecastValue.PropertyPath || datapointAnnotationPath.ForecastValue.Path)) {
                        var forecastProperty = (datapointAnnotationPath.ForecastValue.PropertyPath || datapointAnnotationPath.ForecastValue.Path);
                        measuresList.push((datapointAnnotationPath.ForecastValue.PropertyPath || datapointAnnotationPath.ForecastValue.Path));
                        if (oMetadata && oMetadata[forecastProperty]) {
                            var unitCode;
                            if (oMetadata[forecastProperty][unitKey_v4_isoCurrency]) { //as part of supporting V4 annotation
                                unitCode = oMetadata[forecastProperty][unitKey_v4_isoCurrency].Path ? oMetadata[forecastProperty][unitKey_v4_isoCurrency].Path : undefined;
                            } else if (oMetadata[forecastProperty][unitKey_v4_unit]) {
                                unitCode = oMetadata[forecastProperty][unitKey_v4_unit].Path ? oMetadata[forecastProperty][unitKey_v4_unit].Path : undefined;
                            } else if (oMetadata[forecastProperty][unitKey]) {
                                unitCode = oMetadata[forecastProperty][unitKey];
                            }
                            if (unitCode) {
                                if ((measuresList ? Array.prototype.indexOf.call(measuresList, unitCode) : -1) === -1) {
                                    measuresList.push(unitCode);
                                }
                            }
                        }
                    }
                    if (datapointAnnotationPath.TargetValue && (datapointAnnotationPath.TargetValue.PropertyPath || datapointAnnotationPath.TargetValue.Path)) {
                        var targetProperty = (datapointAnnotationPath.TargetValue.PropertyPath || datapointAnnotationPath.TargetValue.Path);
                        measuresList.push((datapointAnnotationPath.TargetValue.PropertyPath || datapointAnnotationPath.TargetValue.Path));
                        if (oMetadata && oMetadata[targetProperty]) {
                            var unitCode;
                            if (oMetadata[targetProperty][unitKey_v4_isoCurrency]) { //as part of supporting V4 annotation
                                unitCode = oMetadata[targetProperty][unitKey_v4_isoCurrency].Path ? oMetadata[targetProperty][unitKey_v4_isoCurrency].Path : undefined;
                            } else if (oMetadata[targetProperty][unitKey_v4_unit]) {
                                unitCode = oMetadata[targetProperty][unitKey_v4_unit].Path ? oMetadata[targetProperty][unitKey_v4_unit].Path : undefined;
                            } else if (oMetadata[targetProperty][unitKey]) {
                                unitCode = oMetadata[targetProperty][unitKey];
                            }
                            if (unitCode) {
                                if ((measuresList ? Array.prototype.indexOf.call(measuresList, unitCode) : -1) === -1) {
                                    measuresList.push(unitCode);
                                }
                            }
                        }
                    }
                }
                measuresList.push(tmp);
                if (oMetadata && oMetadata[tmp]) {
                    if (oMetadata[tmp][textKeyV4]) { //as part of supporting V4 annotation
                        if (oMetadata[tmp][textKeyV4].String && tmp != oMetadata[tmp][textKeyV4].String) {
                            measuresList.push(oMetadata[tmp][textKeyV4].String ? oMetadata[tmp][textKeyV4].String : tmp);
                        } else if (oMetadata[tmp][textKeyV4].Path && tmp != oMetadata[tmp][textKeyV4].Path) {
                            measuresList.push(oMetadata[tmp][textKeyV4].Path ? oMetadata[tmp][textKeyV4].Path : tmp);
                        }
                    } else if (oMetadata[tmp][textKey] && tmp != oMetadata[tmp][textKey]) {
                        measuresList.push(oMetadata[tmp][textKey] ? oMetadata[tmp][textKey] : tmp);
                    }
                }

                if (oMetadata && oMetadata[tmp]) {
                    var unitCode;
                    if (oMetadata[tmp][unitKey_v4_isoCurrency]) { //as part of supporting V4 annotation
                        unitCode = oMetadata[tmp][unitKey_v4_isoCurrency].Path ? oMetadata[tmp][unitKey_v4_isoCurrency].Path : undefined;
                    } else if (oMetadata[tmp][unitKey_v4_unit]) {
                        unitCode = oMetadata[tmp][unitKey_v4_unit].Path ? oMetadata[tmp][unitKey_v4_unit].Path : undefined;
                    } else if (oMetadata[tmp][unitKey]) {
                        unitCode = oMetadata[tmp][unitKey];
                    }
                    if (unitCode) {
                        if ((measuresList ? Array.prototype.indexOf.call(measuresList, unitCode) : -1) === -1) {
                            measuresList.push(unitCode);
                        }
                    }
                }
            });

            each(oDimensions, function (i, d) {
                tmp = d.Dimension.PropertyPath;
                dimensionsList.push(tmp);
                if (oMetadata && oMetadata[tmp]) {
                    if (oMetadata[tmp][textKeyV4]) { //as part of supporting V4 annotation
                        if (oMetadata[tmp][textKeyV4].String && tmp != oMetadata[tmp][textKeyV4].String) {
                            dimensionsList.push(oMetadata[tmp][textKeyV4].String ? oMetadata[tmp][textKeyV4].String : tmp);
                        } else if (oMetadata[tmp][textKeyV4].Path && tmp != oMetadata[tmp][textKeyV4].Path) {
                            textPath = oMetadata[tmp][textKeyV4].Path;
                            var aParts = textPath.split("/");
                            if (aParts.length > 1) {
                                sExpand = getNavigationPrefix(oMetaModel, entityTypeObject, textPath);
                                if (sExpand !== "") {
                                    dimensionsList.push(textPath);
                                    aExpand.push(sExpand);
                                    aTempAssociationKeyArr = getAssociationKeys(oMetaModel, entityTypeObject, textPath);
                                    if (aTempAssociationKeyArr.length > 0) {
                                        aAssociationKeys = aAssociationKeys.concat(aTempAssociationKeyArr);
                                    }
                                }
                            } else {
                                dimensionsList.push(textPath ? textPath : tmp);
                            }
                        }
                    } else if (oMetadata[tmp][textKey] && tmp != oMetadata[tmp][textKey]) {
                        dimensionsList.push(oMetadata[tmp][textKey] ? oMetadata[tmp][textKey] : tmp);
                    }
                }
            });
            if (aAssociationKeys.length > 0) {
                var k = 0;
                while (k < aAssociationKeys.length) {
                    if (dimensionsList.indexOf(aAssociationKeys[k]) !== -1) {
                        aAssociationKeys.splice(k, 1);
                    } else {
                        k++;
                    }
                }
            }

            //Here, the measures and dimensions are combined into a single object to indicate whether it will be a part of
            //the select query
            if (measuresList.length > 0) {
                each(measuresList, function(i,m){
                    oSelectItems[m] = true;
                });
            }
            if (dimensionsList.length > 0) {
                each(dimensionsList, function(i,d){
                    oSelectItems[d] = true;
                });
            }

            ret += ", parameters: {select:'" + [].concat(dimensionsList, measuresList).join(",");

            //check for the entity type and add requestAtLeast Fields to $Select
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            if (oEntityType) {
                var requestFields = CardAnnotationHelper.getRequestFields(oPresentationVariant);
                if (requestFields && requestFields.length > 0) {
                    each(requestFields, function (i, r) {
                        //If requestAtLeast Fields are not part of select Items then append to select query
                        if (!oSelectItems.hasOwnProperty(r)) {
                            oSelectItems[r] = true;
                            requestList.push(r);
                        }
                    });
                    if (requestList.length > 0) {
                        ret += "," + requestList.join(",");
                    }
                }
            }

		    if (sorterList.length > 0) {
                var modSortList = [];
                each(sorterList, function(i,s){
                    //Here, a check occurs if any sort parameter is already a part of the select query object ie. oSelectItems
                    if (!oSelectItems.hasOwnProperty(s)) {
                        //if not, then add it into a separate array
                        modSortList.push(s);
                    }
                });
                if (modSortList.length > 0) {
                    ret += "," + modSortList.join(",");
                }
            }
            if (aExpand.length > 0) {
                ret += "'" + "," + " expand:'" + aExpand.join(',');
            }
            // add card id as custom parameter
            var bCheckFilterPreference = CardAnnotationHelper.checkFilterPreference(iContext.getSetting("ovpCardProperties"));
            if (bCheckFilterPreference) {
                ret += "', custom: {cardId: '" + iContext.getSetting("ovpCardProperties").getProperty("/cardId") + "'}}";
            } else {
                /* close `parameters` */
                ret += "'}";
            }

            if (chartEnumArr && ( chartEnumArr[1] === 'Donut' ) && (oDimensions === undefined)) {
                ret += ", length: 1";
            } else if (chartEnumArr && ( chartEnumArr[1] === 'Donut' ) && (oDimensions) && maxItems) {
                ret += ", length: " + (parseInt(maxItems, 10) + 1);
            } else if (maxItems) {
                ret += ", length: " + maxItems;
            }
            ret += "}";
            return ret;
        }

        formatItems.requiresIContext = true;

        function getNavigationPrefix(oMetaModel, oEntityType, sProperty) {
            var sExpand = "";
            var aParts = sProperty.split("/");

            if (aParts.length > 1) {
                for (var i = 0; i < (aParts.length - 1); i++) {
                    var oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, aParts[i]);
                    if (oAssociationEnd) {
                        oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type);
                        if (sExpand) {
                            sExpand = sExpand + "/";
                        }
                        sExpand = sExpand + aParts[i];
                    } else {
                        return sExpand;
                    }
                }
            }
            return sExpand;
        }

        function getAssociationKeys(oMetaModel, oEntityType, sProperty) {
            var aAssociationKeys = [];
            var aKeyObjects = [];
            var targetKey;
            var aParts = sProperty.split("/");
            if (aParts.length > 1) {
                for (var i = 0; i < (aParts.length - 1); i++) {
                    var oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, aParts[i]);
                    if (oAssociationEnd) {
                        oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type);
                        if (oEntityType) {
                            aKeyObjects = oEntityType && oEntityType.key && oEntityType.key.propertyRef;
                            for (var j = 0; j < aKeyObjects.length; j++) {
                                targetKey = aParts[i] + "/" + aKeyObjects[j].name;
                                aAssociationKeys.push(targetKey);
                            }
                        }
                    }
                }
            }
            return aAssociationKeys;
        }

        function checkForecastMeasure(aMeasure, entityTypeObject) {
            var boolflag = false;
            var realMeasure;
            if (aMeasure.DataPoint && aMeasure.DataPoint.AnnotationPath) {
                var oDatapoint = entityTypeObject[aMeasure.DataPoint.AnnotationPath.substring(1)];
                if (oDatapoint && oDatapoint.ForecastValue && (oDatapoint.ForecastValue.PropertyPath || oDatapoint.ForecastValue.Path)) {
                    boolflag = true;
                    realMeasure = aMeasure;
                }
            }

            if (boolflag === true) {
                return realMeasure;
            } else {
                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_FORECAST);
                return undefined;
            }
        }

        function checkTargetMeasure(aMeasure, entityTypeObject) {
            var boolflag = false;
            var realMeasure;
            if (aMeasure.DataPoint && aMeasure.DataPoint.AnnotationPath) {
                var oDatapoint = entityTypeObject[aMeasure.DataPoint.AnnotationPath.substring(1)];
                if (oDatapoint && oDatapoint.TargetValue && (oDatapoint.TargetValue.PropertyPath || oDatapoint.TargetValue.Path)) {
                    boolflag = true;
                    realMeasure = aMeasure;
                }
            }

            if (boolflag === true) {
                return realMeasure;
            } else {
                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_TARGET);
                return undefined;
            }
        }

        function getSapLabel(aMeasure, oMetadata) {
            var value;
            each(oMetadata, function (i, v) {
                if (v.name === aMeasure) {
                    if (v["com.sap.vocabularies.Common.v1.Label"]) { //as part of supporting V4 annotation
                        value = v["com.sap.vocabularies.Common.v1.Label"].String ? v["com.sap.vocabularies.Common.v1.Label"].String : v["com.sap.vocabularies.Common.v1.Label"].Path;
                    } else if (v["sap:label"]) {
                        value = v["sap:label"];
                    }
                    return false;
                }
            });
            return value;
        }

        function getMeasureDimCheck(feeds, chartType) {
            var boolFlag = true;
            if (chartType === "line" || chartType === "column") {
                each(feeds, function (i, v) {
                    if ((v.getUid() === 'valueAxis') || (v.getUid() === 'categoryAxis')) {
                        if (v.getValues().length != 1) {
                            boolFlag = false;
                            Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_DIMMEAS);
                            return false;
                        }
                    }
                });
            } else if (chartType === "vertical_bullet") {
                each(feeds, function (i, v) {
                    if ((v.getUid() === 'actualValues') || (v.getUid() === 'categoryAxis')) {
                        if (v.getValues().length != 1) {
                            boolFlag = false;
                            Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_DIMMEAS);
                            return false;
                        }
                    }
                });
            }

            if (boolFlag === true) {
                return true;
            }
        }

        function formatByType(oMetadata, sProp, sVal) {
            var typeKey = constants.TYPE_KEY;
            if (!oMetadata || !oMetadata[sProp] || !oMetadata[sProp][typeKey]) {
                return sVal;
            }
            var aNumberTypes = [
                "Edm.Int",
                "Edmt.Int16",
                "Edm.Int32",
                "Edm.Int64",
                "Edm.Decimal"
            ];
            var currentType = oMetadata[sProp][typeKey];
            if ((aNumberTypes ? Array.prototype.indexOf.call(aNumberTypes, currentType) : -1) !== -1) {
                return Number(sVal);
            }
            return sVal;
        }

        function returnDateFormat(date) {
            if (date) {
                return date;
            }
            return "";
        }

        function formatChartAxes() {
            var customFormatter = {
                locale: function () {
                },
                format: function (value, pattern) {
                    var patternArr = "";
                    if (pattern) {
                        patternArr = pattern.split('/');
                    }
                    if (patternArr.length > 0) {
                        var minFractionDigits, shortRef;
                        if (patternArr.length === 3) {
                            minFractionDigits = Number(patternArr[1]);
                            shortRef = Number(patternArr[2]);
                            if (isNaN(minFractionDigits)) {
                                minFractionDigits = -1;
                            }
                            if (isNaN(shortRef)) {
                                shortRef = 0;
                            }
                        } else {
                            minFractionDigits = 2;
                            shortRef = 0;
                        }
                        if (patternArr[0] === "axisFormatter" || (patternArr[0] === "ShortFloat")) {
                            // if (pattern === "axisFormatter") {
                            var numberFormat;
                            numberFormat = NumberFormat.getFloatInstance(
                                {
                                    style: 'short',
//										shortRefNumber: shortRef, //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
//										showScale: false,
                                    minFractionDigits: minFractionDigits,
                                    maxFractionDigits: minFractionDigits ? minFractionDigits : 1
                                }
                            );
                            if (patternArr[0] === "ShortFloat") {
                                numberFormat = NumberFormat.getFloatInstance(
                                    {
                                        style: 'short',
                                        minFractionDigits: minFractionDigits,
                                        maxFractionDigits: minFractionDigits
                                    }
                                );
                            }
                            if (minFractionDigits === -1) {
                                numberFormat = NumberFormat.getFloatInstance(
                                    {style: 'short'}
                                );
                            }
                            return numberFormat.format(Number(value));
                        } else if (patternArr[0] === "tooltipNoScaleFormatter") {//Pattern for tooltip other than Date
                            var tooltipFormat = NumberFormat.getFloatInstance(
                                {
                                    style: 'short',
                                    currencyCode: false,
                                    shortRefNumber: shortRef,
                                    showScale: false,
                                    minFractionDigits: minFractionDigits,
                                    maxFractionDigits: minFractionDigits
                                }
                            );
                            if (minFractionDigits === -1) {
                                tooltipFormat = NumberFormat.getFloatInstance(
                                    {
                                        minFractionDigits: 0,
                                        currencyCode: false
                                    }
                                );
                            }
                            return tooltipFormat.format(Number(value));
                        } else if (patternArr[0] === "CURR") {
                            var currencyFormat = NumberFormat.getCurrencyInstance(
                                {
                                    style: 'short',
                                    currencyCode: false,
//										shortRefNumber: shortRef, //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
//										showScale: false,
                                    minFractionDigits: minFractionDigits,
                                    maxFractionDigits: minFractionDigits
                                }
                            );
                            if (minFractionDigits === -1) {
                                currencyFormat = NumberFormat.getCurrencyInstance(
                                    {
                                        style: 'short',
                                        currencyCode: false
                                    }
                                );
                            }
                            return currencyFormat.format(Number(value));
                        } else if (patternArr[0].search("%") !== -1) {
                            //FIORITECHP1-5665 - Donut and Pie charts should be able to show numbers
                            var percentFormat = NumberFormat.getPercentInstance(
                                {
                                    style: 'short',
                                    minFractionDigits: minFractionDigits,
                                    maxFractionDigits: minFractionDigits
                                });
                            if (minFractionDigits === -1) {
                                percentFormat = NumberFormat.getPercentInstance(
                                    {
                                        style: 'short',
                                        minFractionDigits: 1,
                                        maxFractionDigits: 1
                                    });
                            }
                            value = percentFormat.format(Number(value));
                            return value;
                        }
                    }
                    if (value.constructor === Date) {
                        //var oDateFormat = DateFormat.getDateTimeInstance({pattern: "dd-MMM"});
                        //Commented for FIORITECHP1-3963[DEV] OVP-AC – Remove the formatting of the Time Axis
                        var oDateFormat = DateFormat.getDateTimeInstance({pattern: pattern});
                        if (pattern === "YearMonthDay") {
                            oDateFormat = DateFormat.getDateInstance({style: "medium"});
                        }
                        if (pattern === "YearMonth") {
                            oDateFormat = DateFormat.getDateTimeInstance({format: "YYYYMMM"});
                        }
                        if (pattern === "YearQuarter" || pattern === "Quarter") {
                            oDateFormat = DateFormat.getDateTimeInstance({format: "YYYYQ"});
                        }
                        if (pattern === "YearWeek" || pattern === "Week") {
                            oDateFormat = DateFormat.getDateTimeInstance({format: "YYYYWW"});
                        }
                        value = oDateFormat.format(new Date(value));
                    }
                    return value;
                }
            };
            VizFormat.numericFormatter(customFormatter);
        }

        function hideDateTimeAxis(vizFrame, feedName) {
            var dataModel = vizFrame.getModel();
            var type = vizFrame.getVizType();
            if (type != "line" && type != "bubble") {
                return;
            }
            if (!feedName) {
                feedName = type === "line" ? "categoryAxis" : "valueAxis";
            }
            var entitySet = vizFrame.getModel('ovpCardProperties').getProperty("/entitySet");
            if (!dataModel || !entitySet) {
                return;
            }
            var oMetadata = getMetadata(dataModel, entitySet);
            var feeds = vizFrame.getFeeds();
            for (var i = 0; i < feeds.length; i++) {
                if (feeds[i].getUid() === feedName) {
                    var feedValues = feeds[i].getValues();
                    if (!feedValues) {
                        return;
                    }
                    for (var j = 0; j < feedValues.length; j++) {
                        if (oMetadata[feedValues[j][constants.TYPE_KEY]] != "Edm.DateTime") {
                            return;
                        }
                    }
                    vizFrame.setVizProperties({
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        }
                    });
                    return;
                }
            }
        }

        /*
         * Check if annotations exist vis-a-vis manifest
         * @param {String} term - Annotation with Qualifier
         * @param {Object} annotation - Annotation Data
         * @param {String} type - Type of Annotation
         * @param {Boolean} [bMandatory=false] - Whether the term is mandatory
         * @param {String} logViewId - Id of the view for log purposes
         * @param {String} contentFragment - To check whether we're dealing with
         * generic analytic card or legacy type.
         * @returns {Boolean}
         */
        function checkExists(term, annotation, type, bMandatory, logViewId, contentFragment) {
            bMandatory = typeof bMandatory === "undefined" ? false : bMandatory;
            var ret = false;
            var annoTerm;
            if (!term && bMandatory) {
                Log.error(logViewId + errorMessages.CARD_ERROR + type + errorMessages.IS_MANDATORY);
                return ret;
            }
            if (!term) {
                /* Optional parameters can be blank */
                Log.warning(logViewId + errorMessages.CARD_WARNING + type + errorMessages.IS_MISSING);
                ret = true;
                return ret;
            }
            annoTerm = annotation[term];
            if (!annoTerm || typeof annoTerm !== "object") {
                var logger = bMandatory ? Log.error : Log.warning;
                logger(logViewId + errorMessages.CARD_ERROR + "in " + type + ". (" + term + " " + errorMessages.NOT_WELL_FORMED);
                return ret;
            }
            /*
             * For new style generic analytical card, make a check chart annotation
             * has chart type.
             */
            if (contentFragment &&
                contentFragment === "sap.ovp.cards.charts.analytical.analyticalChart" &&
                type === "Chart Annotation" &&
                (!annoTerm.ChartType || !annoTerm.ChartType.EnumMember)) {
                Log.error(logViewId + errorMessages.CARD_ERROR + errorMessages.MISSING_CHARTTYPE + errorMessages.CHART_ANNO);
                return ret;
            }
            ret = true;
            return ret;
        }

        /*
         * Check and log errors/warnings if any.
         */
        function validateCardConfiguration(oController) {
            var ret = false;
            if (!oController) {
                return ret;
            }
            var selVar;
            var chartAnno;
            var contentFragment;
            var preVar;
            var idAnno;
            var dPAnno;
            var entityTypeData;
            var logViewId = "";
            var oCardsModel;
            var oView = oController.getView();
            if (oView) {
                logViewId = "[" + oView.getId() + "] ";
            }

            if (!(oCardsModel = oController.getCardPropertiesModel())) {
                Log.error(logViewId + errorMessages.CARD_ERROR + "in " + errorMessages.CARD_CONFIG + errorMessages.NO_CARD_MODEL);
                return ret;
            }

            entityTypeData = oCardsModel.getProperty("/entityType");
            if (!entityTypeData || jQuery.isEmptyObject(entityTypeData)) {
                Log.error(logViewId + errorMessages.CARD_ERROR + "in " + errorMessages.CARD_ANNO);
                return ret;
            }

            selVar = oCardsModel.getProperty("/selectionAnnotationPath");
            chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
            preVar = oCardsModel.getProperty("/presentationAnnotationPath");
            idAnno = oCardsModel.getProperty("/identificationAnnotationPath");
            dPAnno = oCardsModel.getProperty("/dataPointAnnotationPath");
            contentFragment = oCardsModel.getProperty("/contentFragment");

            ret = checkExists(selVar, entityTypeData, "Selection Variant", false, logViewId);
            ret = checkExists(chartAnno, entityTypeData, "Chart Annotation", true, logViewId, contentFragment) && ret;
            ret = checkExists(preVar, entityTypeData, "Presentation Variant", false, logViewId) && ret;
            ret = checkExists(idAnno, entityTypeData, "Identification Annotation", true, logViewId) && ret;
            ret = checkExists(dPAnno, entityTypeData, "Data Point", false, logViewId) && ret;
            return ret;
        }

        /*
         * Check if backend supplies no data.
         * If so, show the no-data fragment.
         * Commented out due to an issue with filters.
         * Shows No data available even when correct filters are applied the second time.
         * So, removing it temporarily.
         */
        function checkNoData(oEvent, cardContainer, vizFrame) {
            /*	var self = sap.ovp.cards.charts.VizAnnotationManager;
             var data, noDataDiv;
             if (!cardContainer) {
             Log.error(errorMessages.CARD_ERROR + errorMessages.CARD_CONTAINER_ERROR +
             "(" + vizFrame.getId() + ")");
             return;
             }
             data = oEvent.getParameter("data");
             if (!data || jQuery.isEmptyObject(data) ||
             !data.results || !data.results.length) {

             Log.error(errorMessages.CARD_ERROR + errorMessages.DATA_UNAVAIALABLE  +
             "(" + vizFrame.getId() + ")");
             noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
             cardContainer.removeAllItems();
             cardContainer.addItem(noDataDiv);
             }*/
        }


        /*
         * @param {Object} [oChartType] - Chart Annotation Object
         * @returns {Object} - Get config object of a particular chart type from
         * configuration defined in config.json.
         * If the param is absent, return config of all charts.
         */
        function getConfig(oChartType) {
            return Utils.getConfig(oChartType);
        }

        /*
         * If there is exactly one dimension with time semantics (according to model metadata),
         * then instead time type shall be used.
         */
        function hasTimeSemantics(aDimensions, config, dataModel, entitySet) {
            var ret = false;
            var oMetadata;
            var dimensionName;
            var dimensionType;
            var displayFormat;
            var sapSemantics;
            var sapSemanticsV4; //as part of supporting V4 annotation
            if (!config.time || jQuery.isEmptyObject(config.time)) {
                return ret;
            }
            if (!aDimensions) {
                return ret;
            }
            for (var index = 0; index < aDimensions.length; index++) {
                if (!aDimensions[index].Dimension || !(dimensionName = aDimensions[index].Dimension.PropertyPath)) {
                    return ret;
                }
                oMetadata = getMetadata(dataModel, entitySet);
                if (oMetadata && oMetadata[dimensionName]) {
                    dimensionType = oMetadata[dimensionName][constants.TYPE_KEY];
                    displayFormat = oMetadata[dimensionName][constants.DISPLAY_FORMAT_KEY];
                    sapSemantics = oMetadata[dimensionName][constants.SEMANTICS_KEY];
                    sapSemanticsV4 = oMetadata[dimensionName]["com.sap.vocabularies.Common.v1.IsCalendarYear"]; //as part of supporting V4 annotation
                }
                if (dimensionType &&
                    dimensionType.lastIndexOf("Edm.Date", 0) === 0) {
                    if (dimensionType.toLowerCase() === "edm.datetime") {
                        if (displayFormat && displayFormat.toLowerCase() === "date") {
                            //displayFormat is mandatory only if the type is edm.datetime
                            ret = true;
                        }
                    } else {
                        ret = true;
                    }
                }
                //
                //as part of supporting V4 annotation
                if (dimensionType === "Edm.String" && (sapSemanticsV4 || sapSemantics && aSupportedDateSemantics.indexOf(sapSemantics) > -1)) {
                    ret = true;
                }
                if (ret) {
                    //In the dimension array insert the date dimension at first place
                    aDimensions.unshift(aDimensions.splice(index, 1)[0]);
                    break;
                }
            }
            return ret;
        }


        /*
         * Formatter for VizFrame type.
         * @param {Object} oChartType - Chart Annotation Object
         * @returns {String} Valid Enum for Vizframe type
         */
        function getChartType(iContext, oChartType, aDimensions) {
            var ret = "";
            var config = getConfig(oChartType);
            var dataModel, entitySet;
            if (!config) {
                return ret;
            }
            ret = config.default.type;
            dataModel = iContext.getSetting("dataModel");
            entitySet = iContext.getSetting('ovpCardProperties').getProperty("/entitySet");
            if (hasTimeSemantics(aDimensions, config, dataModel, entitySet)) {
                ret = config.time.type;
            }
            return ret;
        }

        getChartType.requiresIContext = true;

        /*
         * Check if roles are valid for dimension/measure for the chart type
         */
        function checkRolesForProperty(queue, config, type) {
            /* Nothing remains in the queue, all good !!! */
            if (!queue.length) {
                return;
            }
            var feedtype = type === "dimension" ? "Dimension" : "Measure";
            var queuedNames = [];
            each(queue, function (i, val) {
                if (!val || !val[feedtype] || !val[feedtype].PropertyPath) {
                    Log.error(errorMessages.INVALID_CHART_ANNO);
                    return false;
                }
                queuedNames.push(val[feedtype].PropertyPath);
            });
            var allowedRoles = jQuery.map(config.feeds, function (f) {
                if (f.type === type) {
                    if (f.role) {
                        return f.role.split("|");
                    }
                    return [];
                }
            });
            allowedRoles = jQuery.grep(allowedRoles, function (role, i) {
                return (allowedRoles ? Array.prototype.indexOf.call(allowedRoles, role) : -1) === i;
            }).join(", ");

            Log.error(errorMessages.CARD_ERROR + errorMessages.INVALID_REDUNDANT +
            type + "(s) " + queuedNames.join(", ") + ". " + errorMessages.ALLOWED_ROLES + config.type +
            errorMessages.CHART_IS + allowedRoles);
        }

        function getPrimitiveValue(oValue, isLegend) {
            var value;

            if (oValue) {
                if (oValue.String) {
                    value = oValue.String;
                } else if (oValue.Boolean || oValue.Bool) {
                    value = getBooleanValue(oValue);
                } else {
                    value = getNumberValue(oValue, isLegend);
                }
            }
            return value;
        }

        function getBooleanValue(oValue, bDefault) {
            if (oValue && oValue.Boolean) {
                if (oValue.Boolean.toLowerCase() === "true") {
                    return true;
                } else if (oValue.Boolean.toLowerCase() === "false") {
                    return false;
                }
            } else if (oValue && oValue.Bool) {
                if (oValue.Bool.toLowerCase() === "true") {
                    return true;
                } else if (oValue.Bool.toLowerCase() === "false") {
                    return false;
                }
            }

            return bDefault;
        }

        function getNumberValue(oValue, isLegend) {
            var value;
            if (oValue) {
                if (oValue.String) {
                    value = Number(oValue.String);
                } else if (oValue.Int) {
                    value = Number(oValue.Int);
                } else if (oValue.Decimal) {
                    value = Number(oValue.Decimal);
                } else if (oValue.Double) {
                    value = Number(oValue.Double);
                } else if (oValue.Single) {
                    value = Number(oValue.Single);
                }
            }
            if (isLegend) {
                var numberFormat = NumberFormat.getFloatInstance({
                    style: 'short',
                    minFractionDigits: 2,
                    maxFractionDigits: 2
                });
                if (value) {
                    value = numberFormat.format(Number(value));
                }
            }
            return value;
        }

        function formThePathForCriticalityStateCalculation(iContext, oDataPoint) {

            function getPathOrPrimitiveValue(oItem) {
                if (oItem) {
                    if (oItem.Path) {
                        return "{path:'" + oItem.Path + "'}";
                    } else {
                        return getPrimitiveValue(oItem);
                    }
                } else {
                    return "";
                }
            }

            var value = iContext[iContext.measureNames];
            if (oDataPoint && oDataPoint.CriticalityCalculation && oDataPoint.CriticalityCalculation.ImprovementDirection) {
                var sImprovementDirection = oDataPoint.CriticalityCalculation.ImprovementDirection.EnumMember;
                var deviationLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeLowValue);
                var deviationHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeHighValue);
                var toleranceLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeLowValue);
                var toleranceHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeHighValue);

                return CardAnnotationHelper._calculateCriticalityState(value, sImprovementDirection, deviationLow, deviationHigh, toleranceLow, toleranceHigh, CardAnnotationHelper.criticalityConstants.StateValues);
            } else {
                //If there's no criticality calculation in the datapoint annotation, we check for criticality
                var state = oDataPoint.Criticality.EnumMember;
                var criticalTypeArr = state ? state.split("/") : [];
                if (criticalTypeArr) {
                    return criticalTypeArr[1]; //returns positive, negative, critical or none
                }
            }
        }

        function mapMeasures(oContext, oMetadata, aMeasures) {
            var value, dataPointAnnotationPath;
            each(oMetadata, function (i, v) {
                //as part of supporting V4 annotation
                if (v["com.sap.vocabularies.Common.v1.Label"] && v["com.sap.vocabularies.Common.v1.Label"].String === oContext.measureNames) {
                    value = v.name;
                    return false;
                } else if (v["com.sap.vocabularies.Common.v1.Label"] && v["com.sap.vocabularies.Common.v1.Label"].Path === oContext.measureNames) {
                    value = v.name;
                    return false;
                } else if (v["sap:label"] === oContext.measureNames) {
                    value = v.name;
                    return false;
                }
            });

            each(aMeasures, function (i, v) {
                if (v.Measure.PropertyPath === value) {
                    if (!v.DataPoint || !v.DataPoint.AnnotationPath) {
                        return false;
                    }
                    dataPointAnnotationPath = v.DataPoint.AnnotationPath;
                    return false;
                }
            });
            return dataPointAnnotationPath;
        }

        function getPathOrPrimitiveValue(oItem, isLegend) {

            if (oItem) {
                if (oItem.Path) {
                    return oItem.Path;
                } else {
                    return getPrimitiveValue(oItem, isLegend);
                }
            } else {
                return "";
            }
        }

        function checkFlag(aMeasures, entityTypeObject) {
            function endsWith(sString, sSuffix) {
                return sString && sString.indexOf(sSuffix, sString.length - sSuffix.length) !== -1;
            }

            var boolFlag = false;
            each(aMeasures, function (i, v) {
                if (v.DataPoint && v.DataPoint.AnnotationPath) {
                    var oDatapoint = entityTypeObject[v.DataPoint.AnnotationPath.substring(1)];
                    if (oDatapoint && oDatapoint.CriticalityCalculation &&
                        oDatapoint.CriticalityCalculation.ImprovementDirection &&
                        oDatapoint.CriticalityCalculation.ImprovementDirection.EnumMember) {

                        var sImproveDirection = oDatapoint.CriticalityCalculation.ImprovementDirection.EnumMember;

                        var deviationLow = getPathOrPrimitiveValue(oDatapoint.CriticalityCalculation.DeviationRangeLowValue);
                        var deviationHigh = getPathOrPrimitiveValue(oDatapoint.CriticalityCalculation.DeviationRangeHighValue);
                        var toleranceLow = getPathOrPrimitiveValue(oDatapoint.CriticalityCalculation.ToleranceRangeLowValue);
                        var toleranceHigh = getPathOrPrimitiveValue(oDatapoint.CriticalityCalculation.ToleranceRangeHighValue);

                        if (endsWith(sImproveDirection, "Minimize") ||
                            endsWith(sImproveDirection, "Minimizing")) {
                            if (toleranceHigh && deviationHigh) {
                                boolFlag = true;
                                return false;
                            } else {
                                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_CRITICALITY);
                            }

                        } else if (endsWith(sImproveDirection, "Maximize") ||
                            endsWith(sImproveDirection, "Maximizing")) {
                            if (toleranceLow && deviationLow) {
                                boolFlag = true;
                                return false;
                            } else {
                                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_CRITICALITY);
                            }

                        } else if (endsWith(sImproveDirection, "Target")) {
                            if (toleranceLow && deviationLow && toleranceHigh && deviationHigh) {
                                boolFlag = true;
                                return false;
                            } else {
                                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_CRITICALITY);
                            }
                        }

                    } else if (oDatapoint && oDatapoint.Criticality) {
                        boolFlag = true;
                        return false;
                    } else {
                        Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_IMPROVEMENT_DIR);
                    }
                }
            });
            if (boolFlag === true && aMeasures.length > 1) {
                Log.warning(errorMessages.CARD_WARNING + errorMessages.INVALID_SEMANTIC_MEASURES);
            }
            return boolFlag;
        }

        function buildSemanticLegends(oMeasure, entityTypeObject, oMetadata, vizFrame) {
            function endsWith(sString, sSuffix) {
                return sString && sString.indexOf(sSuffix, sString.length - sSuffix.length) !== -1;
            }

            var ret = [null, null];
            var isLegend = true;
            var measureName = oMeasure.Measure.PropertyPath;
            if (oMetadata[measureName]) {
                if (oMetadata[measureName][constants.LABEL_KEY_V4]) { //as part of supporting V4 annotation
                    measureName = getLabelFromAnnotationPath(oMetadata[measureName][constants.LABEL_KEY_V4].String ? oMetadata[measureName][constants.LABEL_KEY_V4].String : oMetadata[measureName][constants.LABEL_KEY_V4].Path, vizFrame, oMetadata);
                } else if (oMetadata[measureName][constants.LABEL_KEY]) {
                    measureName = oMetadata[measureName][constants.LABEL_KEY];
                } else if (measureName) {
                    measureName = measureName;
                }
            }
            var dataPointAnnotationPath = oMeasure.DataPoint.AnnotationPath;
            var oDataPoint = entityTypeObject[dataPointAnnotationPath.substring(1)];
            if (!oDataPoint.CriticalityCalculation || !oDataPoint.CriticalityCalculation.ImprovementDirection || !oDataPoint.CriticalityCalculation.ImprovementDirection.EnumMember) {
                return ret;
            }
            var sImproveDirection = oDataPoint.CriticalityCalculation.ImprovementDirection.EnumMember;
            var deviationLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeLowValue, isLegend);
            var deviationHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeHighValue, isLegend);
            var toleranceLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeLowValue, isLegend);
            var toleranceHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeHighValue, isLegend);

            if (endsWith(sImproveDirection, "Minimize") ||
                endsWith(sImproveDirection, "Minimizing")) {
                if (toleranceHigh && deviationHigh) {
                    ret[0] = OvpResources.getText("MINIMIZING_LESS", [measureName, toleranceHigh]);
                    ret[1] = OvpResources.getText("MINIMIZING_MORE", [measureName, deviationHigh]);
                    ret[2] = OvpResources.getText("MINIMIZING_CRITICAL", [toleranceHigh, measureName, deviationHigh]);
                }

            } else if (endsWith(sImproveDirection, "Maximize") ||
                endsWith(sImproveDirection, "Maximizing")) {
                if (toleranceLow && deviationLow) {
                    ret[0] = OvpResources.getText("MAXIMISING_MORE", [measureName, toleranceLow]);
                    ret[1] = OvpResources.getText("MAXIMISING_LESS", [measureName, deviationLow]);
                    ret[2] = OvpResources.getText("MAXIMIZING_CRITICAL", [deviationLow, measureName, toleranceLow]);
                }

            } else if (endsWith(sImproveDirection, "Target")) {
                if (toleranceLow && deviationLow && toleranceHigh && deviationHigh) {
                    ret[0] = OvpResources.getText("TARGET_BETWEEN", [toleranceLow, measureName, toleranceHigh]);
                    ret[1] = OvpResources.getText("TARGET_AROUND", [measureName, deviationLow, deviationHigh]);
                    ret[2] = OvpResources.getText("TARGET_CRITICAL", [deviationLow, measureName, toleranceLow, toleranceHigh, deviationHigh]);
                }
            }
            return ret;
        }

        // Check the numberFormat of the DataPoint for each measure
        function checkNumberFormat(minValue, val, entityTypeObject) {
            if (val && val.DataPoint && val.DataPoint.AnnotationPath) {
                var oDataPoint = entityTypeObject[val.DataPoint.AnnotationPath.substring(1)];
                var fractionDigits, fractionDigitsVal;
                if (oDataPoint && oDataPoint.ValueFormat) {
                    fractionDigits = oDataPoint.ValueFormat;
                } else if (oDataPoint && oDataPoint.NumberFormat) {
                    fractionDigits = oDataPoint.NumberFormat;
                }

                if (fractionDigits && fractionDigits.NumberOfFractionalDigits && fractionDigits.NumberOfFractionalDigits.Int) {
                    fractionDigitsVal = fractionDigits.NumberOfFractionalDigits.Int;
                    if (minValue < Number(fractionDigitsVal)) {
                        minValue = Number(fractionDigitsVal);
                    }
                }
            }

            return minValue;
        }

        function getMaxScaleFactor(maxScaleValue, val, entityTypeObject) {
            if (val && val.DataPoint && val.DataPoint.AnnotationPath) {
                var oDataPoint = entityTypeObject[val.DataPoint.AnnotationPath.substring(1)];
                var scaleF, ScaleFVal;
                if (oDataPoint && oDataPoint.ValueFormat) {
                    scaleF = oDataPoint.ValueFormat;
                } else if (oDataPoint && oDataPoint.NumberFormat) {
                    scaleF = oDataPoint.NumberFormat;
                }

                if (scaleF) {
                    if (scaleF.ScaleFactor && scaleF.ScaleFactor.Decimal) {
                        ScaleFVal = Number(scaleF.ScaleFactor.Decimal);
                    } else if (scaleF.ScaleFactor && scaleF.ScaleFactor.Int) {
                        ScaleFVal = Number(scaleF.ScaleFactor.Int);
                    }

                    if (!isNaN(ScaleFVal)) {
                        if (maxScaleValue === undefined) {
                            maxScaleValue = Number(ScaleFVal);
                        } else if (maxScaleValue > Number(ScaleFVal)) {
                            maxScaleValue = Number(ScaleFVal);
                        }
                    }
                }
            }
            return maxScaleValue;
        }

        function isMeasureCurrency(oMetadata, sapUnit) {
            //as part of supporting V4 annotation
            if (oMetadata && oMetadata[sapUnit] && (oMetadata[sapUnit]["Org.OData.Measures.V1.ISOCurrency"] || (oMetadata[sapUnit][constants.SEMANTICS_KEY] && oMetadata[sapUnit][constants.SEMANTICS_KEY] === constants.CURRENCY_CODE))) {
                return true;
            }
            return false;
        }

        function checkEDMINT32Exists(oMetadata, val, feedtype) {
            if (oMetadata[val[feedtype].PropertyPath][constants.EDM_TYPE] === constants.EDM_INT32) {
                return true;
            }
            return false;
        }

        function checkEDMINT64Exists(oMetadata, val, feedtype) {
            if (oMetadata[val[feedtype].PropertyPath][constants.EDM_TYPE] === constants.EDM_INT64) {
                return true;
            }
            return false;
        }

        /*
         * Construct VizProperties and Feeds for VizFrame
         * @param {Object} VizFrame
         */
        function buildVizAttributes(vizFrame, handler, chartTitle, oController) {
            var oCardsModel, entityTypeObject, chartAnno, chartContext;
            var chartType, allConfig, config, aDimensions, aMeasures;
            var oVizProperties;
            var aQueuedProperties, aQueuedDimensions, aQueuedMeasures;
            var aPropertyWithoutRoles, aDimensionWithoutRoles = [], aMeasureWithoutRoles = [];
            var bSupportsTimeSemantics;
            var reference;
            var oView = oController && oController.getView();
            var oDropdown, selectedKey;
            chartType = vizFrame.getVizType();
            allConfig = getConfig();

            for (var key in allConfig) {
                if ((reference = allConfig[key].reference) &&
                    allConfig[reference]) {
                    var virtualEntry = jQuery.extend(true, {}, allConfig[reference]);
                    allConfig[key] = virtualEntry;
                }
                if (allConfig[key].default.type === chartType ||
                    (allConfig[key].time && allConfig[key].time.type === chartType)) {
                    config = allConfig[key];
                    break;
                }
            }


            if (!config) {
                Log.error(errorMessages.CARD_ERROR + "in " + errorMessages.CARD_CONFIG +
                errorMessages.CARD_CONFIG_ERROR + chartType + " " + errorMessages.CARD_CONFIG_JSON);
                return;
            }

            if (!(oCardsModel = vizFrame.getModel('ovpCardProperties'))) {
                Log.error(errorMessages.CARD_ERROR + "in " + errorMessages.CARD_CONFIG +
                errorMessages.NO_CARD_MODEL);
                return;
            }
            var dataModel = vizFrame.getModel();
            var entitySet = oCardsModel.getProperty("/entitySet");
            if (!dataModel || !entitySet) {
                return;
            }
            entityTypeObject = oCardsModel.getProperty("/entityType");
            if (!entityTypeObject) {
                Log.error(errorMessages.CARD_ANNO_ERROR + "in " + errorMessages.CARD_ANNO);
                return;
            }
            var oMetadata = getMetadata(dataModel, entitySet);
            chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
            if (!chartAnno || !(chartContext = entityTypeObject[chartAnno])) {
                Log.error(errorMessages.CARD_ANNO_ERROR + "in " + errorMessages.CARD_ANNO);
                return;
            }

            if (!(aDimensions = chartContext.DimensionAttributes) || !aDimensions.length) {
                Log.error(errorMessages.CHART_ANNO_ERROR + "in " + errorMessages.CHART_ANNO + " " + errorMessages.DIMENSIONS_MANDATORY);
                return;
            }
            //Added support for fractional digits
            var aNumberOfFractionalDigits;
            if (!(aMeasures = chartContext.MeasureAttributes) || !aMeasures.length) {
                Log.error(errorMessages.CHART_ANNO_ERROR + "in " + errorMessages.CHART_ANNO + " " + errorMessages.MEASURES_MANDATORY);
                return;
            } else {
                var datapointAnnotationPath = aMeasures[0].DataPoint ? entityTypeObject[aMeasures[0].DataPoint.AnnotationPath.substring(1)] : null;
                var dpNumberOfFractionalDigits = datapointAnnotationPath && datapointAnnotationPath.ValueFormat && datapointAnnotationPath.ValueFormat.NumberOfFractionalDigits && datapointAnnotationPath.ValueFormat.NumberOfFractionalDigits.Int;
                aNumberOfFractionalDigits = dpNumberOfFractionalDigits ? dpNumberOfFractionalDigits : 0;
            }
            bSupportsTimeSemantics = hasTimeSemantics(aDimensions, config, dataModel, entitySet);
            if (bSupportsTimeSemantics) {
                config = config.time;
            } else {
                config = config.default;
            }

            var chartProps = oCardsModel.getProperty("/ChartProperties") || oCardsModel.getProperty("/chartProperties");
            if (oCardsModel && oCardsModel.getProperty("/tabs") && (chartProps === undefined)) {
                oDropdown = oView.byId("ovp_card_dropdown");
                selectedKey = parseInt(oDropdown.getSelectedKey(), 10);
                chartProps = oCardsModel.getProperty("/tabs") && oCardsModel.getProperty("/tabs")[selectedKey - 1] && (oCardsModel.getProperty("/tabs")[selectedKey - 1]["ChartProperties"] || oCardsModel.getProperty("/tabs")[selectedKey - 1]["chartProperties"]);
            }

            var bErrors = false;
            var tooltipFormatString = aNumberOfFractionalDigits > 0 ? "tooltipNoScaleFormatter/" + aNumberOfFractionalDigits.toString() + "/" : 'tooltipNoScaleFormatter/-1/';
            var oTooltip = new VizTooltip({formatString: tooltipFormatString});
            oTooltip.connect(vizFrame.getVizUid());
            oTooltip.connect(vizFrame.getVizUid());
            vizFrame._oOvpVizFrameTooltip = oTooltip;
            /*
             * Check if given number of dimensions, measures
             * are valid acc to config's min and max requirements
             */
            [config.dimensions, config.measures].forEach(function (entry, i) {
                var oProperty = i ? aMeasures : aDimensions;
                var typeCue = i ? "measure(s)" : "dimension(s)";
                if (entry.min && oProperty.length < entry.min) {
                    Log.error(errorMessages.CARD_ERROR + "in " + chartType + " " + errorMessages.CARD_LEAST + entry.min + " " + typeCue);
                    bErrors = true;
                }
                if (entry.max && oProperty.length > entry.max) {
                    Log.error(errorMessages.CARD_ERROR + "in " + chartType + errorMessages.CARD_MOST + entry.max + " " + typeCue);
                    bErrors = true;
                }
            });

            if (bErrors) {
                return;
            }

            /* HEADER UX stuff */
            var bHideAxisTitle = true;

            if (config.properties && config.properties.hasOwnProperty("hideLabel") && !config.properties["hideLabel"]) {
                bHideAxisTitle = false;
            }

            var bDatapointNavigation = true;

            //FIORITECHP1-6021 - Allow Disabling of Navigation from Graph
//		var dNav = oCardsModel.getProperty("/navigation");
//		if (dNav === "chartNav") {
//			bDatapointNavigation = false;
//		}
            var bDonutChart = false;
            if (chartType === 'donut') {
                bDonutChart = true;
            }
            vizFrame.removeAllAggregation();
            /*
             * Default viz properties template
             */
            oVizProperties = {
                legend: {
                    isScrollable: false
                },
                title: {
                    visible: false
                },
                interaction: {
                    noninteractiveMode: bDatapointNavigation ? false : true,
                    selectability: {
                        legendSelection: bDonutChart ? true : false,
                        axisLabelSelection: false,
                        mode: 'EXCLUSIVE',
                        plotLassoSelection: false,
                        plotStdSelection: true
                    },
                    zoom: {
                        enablement: 'disabled'
                    }
                },
                plotArea: {
                    window: {
                        start: 'firstDataPoint',
                        end: 'lastDataPoint'
                    },
                    dataLabel: {
                        visible: bDonutChart ? true : false,
                        type: 'value' //FIORITECHP1-5665 - Donut and Pie charts should be able to show numbers
                    },
                    dataPoint: {
                        invalidity: 'ignore'
                    },
                    alignment: {
                        vertical: 'top'
                    }
                },
                categoryAxis: {
                    label: {
                        truncatedLabelRatio: 0.15
                    }
                },
                general: {
                    groupData: false,
                    showAsUTC: true
                }
            };

            if (config.properties && config.properties.semanticColor === true && checkFlag(aMeasures, entityTypeObject)) {
                //put strings in resource bundle
                var goodLegend = OvpResources.getText("GOOD");
                var badLegend = OvpResources.getText("BAD");
                var criticalLegend = OvpResources.getText("CRITICAL");
                var othersLegend = OvpResources.getText("OTHERS");
                if (aMeasures.length === 1) {
                    var legends = buildSemanticLegends(aMeasures[0], entityTypeObject, oMetadata, vizFrame);
                    var goodLegend = legends[0] || goodLegend,
                        badLegend = legends[1] || badLegend,
                        criticalLegend = legends[2] || criticalLegend,
                        othersLegend = OvpResources.getText("OTHERS");
                }
                oVizProperties.plotArea.dataPointStyle = {
                    rules: [
                        {
                            callback: function (oContext) {
                                var dataPointAnnotationPath = mapMeasures(oContext, oMetadata, aMeasures);
                                if (!dataPointAnnotationPath) {
                                    return false;
                                }
                                var criticality = entityTypeObject[dataPointAnnotationPath.substring(1)];
                                var sState = formThePathForCriticalityStateCalculation(oContext, criticality);
                                if (sState === CardAnnotationHelper.criticalityConstants.StateValues.Positive) {
                                    return true;
                                } else if (sState === "Positive") {
                                    return true;
                                }
                            },
                            properties: {
                                color: "sapUiChartPaletteSemanticGoodLight1"
                            },
                            "displayName": goodLegend
                        },
                        {
                            callback: function (oContext) {
                                var dataPointAnnotationPath = mapMeasures(oContext, oMetadata, aMeasures);
                                if (!dataPointAnnotationPath) {
                                    return false;
                                }
                                var criticality = entityTypeObject[dataPointAnnotationPath.substring(1)];
                                var sState = formThePathForCriticalityStateCalculation(oContext, criticality);
                                if (sState === CardAnnotationHelper.criticalityConstants.StateValues.Critical) {
                                    return true;
                                } else if (sState === "Critical") {
                                    return true;
                                }
                            },
                            properties: {
                                color: "sapUiChartPaletteSemanticCriticalLight1"
                            },
                            "displayName": criticalLegend
                        },
                        {
                            callback: function (oContext) {
                                var dataPointAnnotationPath = mapMeasures(oContext, oMetadata, aMeasures);
                                if (!dataPointAnnotationPath) {
                                    return false;
                                }
                                var criticality = entityTypeObject[dataPointAnnotationPath.substring(1)];
                                var sState = formThePathForCriticalityStateCalculation(oContext, criticality);
                                if (sState === CardAnnotationHelper.criticalityConstants.StateValues.Negative) {
                                    return true;
                                } else if (sState === "Negative") {
                                    return true;
                                }
                            },
                            properties: {
                                color: "sapUiChartPaletteSemanticBadLight1"
                            },
                            "displayName": badLegend
                        },
                        {
                            callback: function (oContext) {
                                var dataPointAnnotationPath = mapMeasures(oContext, oMetadata, aMeasures);
                                if (!dataPointAnnotationPath) {
                                    return false;
                                }
                                var criticality = entityTypeObject[dataPointAnnotationPath.substring(1)];
                                var sState = formThePathForCriticalityStateCalculation(oContext, criticality);
                                if (sState === CardAnnotationHelper.criticalityConstants.StateValues.None) {
                                    return true;
                                } else if (sState === "Neutral") {
                                    return true;
                                }
                            },
                            properties: {
                                color: "sapUiChartPaletteSemanticNeutralLight1"
                            },
                            "displayName": othersLegend
                        }]
                };
            }

            var bEnableStableColors = oCardsModel.getProperty("/bEnableStableColors");
            var oColorPalette = oCardsModel.getProperty("/colorPalette");
            var colorPaletteDimension;

            //Perform only semantic coloring here
            if (!bEnableStableColors && (chartContext.ChartType.EnumMember === constants.COLUMNSTACKED_CHARTTYPE || chartContext.ChartType.EnumMember === constants.DONUT_CHARTTYPE || chartContext.ChartType.EnumMember === constants.COLUMN_CHARTTYPE ||
                    chartContext.ChartType.EnumMember === constants.VERTICALBULLET_CHARTTYPE || chartContext.ChartType.EnumMember === constants.LINE_CHARTTYPE || chartContext.ChartType.EnumMember === constants.COMBINATION_CHARTTYPE || chartContext.ChartType.EnumMember === constants.BUBBLE_CHARTTYPE) &&
                    oColorPalette && Object.keys(oColorPalette).length >= 2 && Object.keys(oColorPalette).length <= 4) {
                each(aDimensions, function (i, oDimension) {
                    if (oDimension && oDimension.Role && oDimension.Role.EnumMember === "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series") {
                        colorPaletteDimension = oDimension.Dimension && oDimension.Dimension.PropertyPath;
                        return;
                    }
                });
                var feedName;
                if (colorPaletteDimension) {
                    if (oMetadata && oMetadata[colorPaletteDimension]) {
                        if (oMetadata[colorPaletteDimension][constants.LABEL_KEY_V4]) { //as part of supporting V4 annotation
                            feedName = getLabelFromAnnotationPath(oMetadata[colorPaletteDimension][constants.LABEL_KEY_V4].String ? oMetadata[colorPaletteDimension][constants.LABEL_KEY_V4].String : oMetadata[colorPaletteDimension][constants.LABEL_KEY_V4].Path, vizFrame, oMetadata);
                        } else if (oMetadata[colorPaletteDimension][constants.LABEL_KEY]) {
                            feedName = oMetadata[colorPaletteDimension][constants.LABEL_KEY];
                        } else if (colorPaletteDimension) {
                            feedName = colorPaletteDimension;
                        }
                    }
                    /*if (chartContext.ChartType.EnumMember === constants.COLUMNSTACKED_CHARTTYPE) {
                        var chartData = vizFrame.getDataset() && vizFrame.getDataset().getBinding("data");
                        if (chartData) {
                            chartData.sort([new sap.ui.model.Sorter(colorPaletteDimension, true)]);
                        }
                    }*/

                    //In case of an array based colorPalette
                    if (oColorPalette instanceof Array){
                        var aColorValues = oColorPalette.map(function (value) {
                            return value.color;
                        });
                        var aLegendTexts = oColorPalette.map(function (value) {
                            return value.legendText;
                        });
                        //put strings in resource bundle
                        var othersCustomLegend = aLegendTexts[0] != undefined ? aLegendTexts[0] : OvpResources.getText("OTHERS");
                        var badCustomLegend = aLegendTexts[1] != undefined ? aLegendTexts[1] : OvpResources.getText("BAD");
                        var criticalCustomLegend = aLegendTexts[2] != undefined ? aLegendTexts[2] : OvpResources.getText("CRITICAL");
                        var goodCustomLegend = aLegendTexts[3] != undefined ? aLegendTexts[3] : OvpResources.getText("GOOD");
                    }

                    oVizProperties.plotArea.dataPointStyle = {
                        rules: [
                            {
                                callback: function (oContext) {
                                    if (oContext && (oContext[feedName] === "3" || oContext[feedName] === 3)) {
                                        //This rule should always return false, when the number of colors maintained in the colorPalette is less
                                        //than value of Criticality + 1(which signifies the position of the color within the colorPalette array)
                                        //Coloring is not applied for such cases
                                        if (oColorPalette instanceof Array) {
                                            //In case an array based colorPalette is used
                                            if (oColorPalette.length < 4){
                                                return false;
                                            }
                                        } else if (oColorPalette && !oColorPalette.hasOwnProperty(3)){
                                            //In case an object map based colorPalette is used
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                properties: {
                                    color: oColorPalette instanceof Array && aColorValues.length ? aColorValues[3] : oColorPalette[3] && oColorPalette[3]["color"]
                                },
                                "displayName": goodCustomLegend || oColorPalette[3] && oColorPalette[3]["legendText"]
                            },
                            {
                                callback: function (oContext) {
                                    if (oContext && (oContext[feedName] === "2" || oContext[feedName] === 2)) {
                                        //This rule should always return false, when the number of colors maintained in the colorPalette is less
                                        //than value of Criticality + 1(which signifies the position of the color within the colorPalette array)
                                        //Coloring is not applied for such cases
                                        if (oColorPalette instanceof Array) {
                                            //In case an array based colorPalette is used
                                            if (oColorPalette.length < 3){
                                                return false;
                                            }
                                        } else if (oColorPalette && !oColorPalette.hasOwnProperty(2)){
                                            //In case an object map based colorPalette is used
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                properties: {
                                    color: oColorPalette instanceof Array && aColorValues.length ? aColorValues[2] : oColorPalette[2] && oColorPalette[2]["color"]
                                },
                                "displayName": criticalCustomLegend ||  oColorPalette[2] && oColorPalette[2]["legendText"]
                            },
                            {
                                callback: function (oContext) {
                                    if (oContext && (oContext[feedName] === "1" || oContext[feedName] === 1)) {
                                        return true;
                                    }
                                },
                                properties: {
                                    color: oColorPalette instanceof Array && aColorValues.length ? aColorValues[1] : oColorPalette[1] && oColorPalette[1]["color"]
                                },
                                "displayName": badCustomLegend ||  oColorPalette[1] && oColorPalette[1]["legendText"]
                            },
                            {
                                callback: function (oContext) {
                                    if (oContext && (oContext[feedName] === "0" || oContext[feedName] === 0)) {
                                        return true;
                                    }
                                },
                                properties: {
                                    color: oColorPalette instanceof Array && aColorValues.length ? aColorValues[0] : oColorPalette[0] && oColorPalette[0]["color"]
                                },
                                "displayName": othersCustomLegend ||  oColorPalette[0] && oColorPalette[0]["legendText"]
                            }]
                    };
                }

            }

            /*Check if the Config.json has scale properties set*/
            var bConsiderAnnotationScales = false;
            var bIsMinMax = false;
            if (chartContext.ChartType.EnumMember === constants.SCATTER_CHARTTYPE ||
                chartContext.ChartType.EnumMember === constants.BUBBLE_CHARTTYPE ||
                chartContext.ChartType.EnumMember === constants.LINE_CHARTTYPE) {
                if (chartContext && chartContext.AxisScaling && chartContext.AxisScaling.RecordType == "com.sap.vocabularies.UI.v1.ChartAxisScalingType") {
                    var oAxisScaling = chartContext.AxisScaling;
                    if (oAxisScaling.AutoScaleBehavior && oAxisScaling.AutoScaleBehavior.RecordType == "com.sap.vocabularies.UI.v1.ChartAxisAutoScaleBehaviorType") {
                        var oAutoScaleBehavior = oAxisScaling.AutoScaleBehavior;
                        if (oAutoScaleBehavior.ZeroAlwaysVisible && oAutoScaleBehavior.ZeroAlwaysVisible.Bool == "true") {
                            oVizProperties.plotArea.adjustScale = false;
                            bConsiderAnnotationScales = true;
                        } else if (oAutoScaleBehavior.DataScope) {
                            oVizProperties.plotArea.adjustScale = true;
                            bConsiderAnnotationScales = true;
                        }
                    } else if (oAxisScaling.RecordType == "com.sap.vocabularies.UI.v1.ChartAxisScalingType" && oAxisScaling.ScaleBehavior && oAxisScaling.ScaleBehavior.EnumMember) {
                        var sEnumMember = oAxisScaling.ScaleBehavior.EnumMember;
                        var sEnumMemberValue = sEnumMember.substring(sEnumMember.lastIndexOf('/') + 1, sEnumMember.length);
                        if (sEnumMemberValue == "FixedScale") {
                            bIsMinMax = true;
                        }
                    }
                } else if (chartContext && chartContext.AxisScaling && chartContext.AxisScaling.EnumMember) {
                    var sScaleType = chartContext.AxisScaling.EnumMember.substring(chartContext.AxisScaling.EnumMember.lastIndexOf('/') + 1, chartContext.AxisScaling.EnumMember.length);
                    //bConsiderAnnotationScales are individually set for each case to make sure the scale values are set casewise
                    switch (sScaleType) {
                        case "AdjustToDataIncluding0":
                            oVizProperties.plotArea.adjustScale = false;
                            bConsiderAnnotationScales = true;
                            break;
                        case "AdjustToData":
                            oVizProperties.plotArea.adjustScale = true;
                            bConsiderAnnotationScales = true;
                            break;
                        case "MinMaxValues":
                            bIsMinMax = true;
                            break;
                        default:
                            break;
                    }
                }

                if (bIsMinMax) {
                    var aChartScales = [];
                    if (chartContext["MeasureAttributes"][0] &&
                        chartContext["MeasureAttributes"][0].DataPoint &&
                        chartContext["MeasureAttributes"][0].DataPoint.AnnotationPath) {
                        var sDataPointAnnotationPath = chartContext["MeasureAttributes"][0].DataPoint.AnnotationPath;
                        var sDataPointPath = sDataPointAnnotationPath.substring(sDataPointAnnotationPath.lastIndexOf('@') + 1, sDataPointAnnotationPath.length);
                        if (entityTypeObject && entityTypeObject[sDataPointPath]) {
                            var oMinMaxParams = entityTypeObject[sDataPointPath];
                            if (oMinMaxParams && oMinMaxParams.MaximumValue && oMinMaxParams.MaximumValue.Decimal &&
                                oMinMaxParams.MinimumValue && oMinMaxParams.MinimumValue.Decimal) {
                                aChartScales.push({
                                    feed: "valueAxis",
                                    max: oMinMaxParams.MaximumValue.Decimal,
                                    min: oMinMaxParams.MinimumValue.Decimal
                                });
                                bConsiderAnnotationScales = true;
                            } else {
                                Log.error(errorMessages.ERROR_MISSING_AXISSCALES);
                            }

                        }

                    }
                    //LINE_CHARTTYPE donot have valueAxis2
                    if (chartContext.ChartType.EnumMember !== constants.LINE_CHARTTYPE &&
                        chartContext["MeasureAttributes"][1] &&
                        chartContext["MeasureAttributes"][1].DataPoint &&
                        chartContext["MeasureAttributes"][1].DataPoint.AnnotationPath) {
                        var sDataPointAnnotationPath = chartContext["MeasureAttributes"][1].DataPoint.AnnotationPath;
                        var sDataPointPath = sDataPointAnnotationPath.substring(sDataPointAnnotationPath.lastIndexOf('@') + 1, sDataPointAnnotationPath.length);
                        if (entityTypeObject && entityTypeObject[sDataPointPath]) {
                            var oMinMaxParams = entityTypeObject[sDataPointPath];
                            if (oMinMaxParams && oMinMaxParams.MaximumValue && oMinMaxParams.MaximumValue.Decimal &&
                                oMinMaxParams.MinimumValue && oMinMaxParams.MinimumValue.Decimal) {
                                aChartScales.push({
                                    feed: "valueAxis2",
                                    max: oMinMaxParams.MaximumValue.Decimal,
                                    min: oMinMaxParams.MinimumValue.Decimal
                                });
                                bConsiderAnnotationScales = true;
                            } else {
                                Log.error(errorMessages.ERROR_MISSING_AXISSCALES);
                            }
                        }

                    }
                    vizFrame.setVizScales(aChartScales);
                }
            }
            aQueuedDimensions = aDimensions.slice();
            aQueuedMeasures = aMeasures.slice();

//		var minFractionDigits = Number(dataContext.NumberFormat.NumberOfFractionalDigits.Int);

            var minValue = 0;
            var minValCurr = 0;
            var maxScaleValue;
            var maxScaleValueCurr;
            var isCurrency = false;
            var isNotCurrency = false;
            var sapUnit;
            var oVizPropertiesFeeds = [];
            var measureArr = [], dimensionArr = [];
            /*
                IMPORTANT - Temporary fix to add the color feed at runtime for column and vertical bullet custom charts
                This is a dirty fix and has to be taken care of.
            */
            if ((chartType === "column" || chartType === "vertical_bullet") && config.feeds && (config.feeds.length > 0)) {
                //First delete all the config properties that are unnecessary.
                //This is required as the config is picked up from the cache if available.
                var index;
                for (index = 0; index < config.feeds.length; index++) {
                    if (config.feeds[index].uid === "color") {
                        config.feeds.splice(index, 1);
                        break;
                    }
                }
                for (index = 0; index < config.feeds.length; index++) {
                    if (config.feeds[index].uid === "categoryAxis") {
                        delete config.feeds[index].role;
                        break;
                    }
                }
                if (oCardsModel.getProperty("/colorPalette")) {
                    //Now add the properties required for the custom color charts
                    for (index = 0; index < config.feeds.length; index++) {
                        if (config.feeds[index].uid === "categoryAxis") {
                            config.feeds[index].role = "Category";
                            break;
                        }
                    }
                    //Push color feed to the config for custom coloring to be applied against this feed.
                    config.feeds.push({
                        "uid": "color",
                        "min": 1,
                        "type": "dimension",
                        "role": "Series"
                    });
                }
            }

            each(config.feeds, function (i, feed) {
                var uid = feed.uid;
                var aFeedProperties = [];
                if (feed.type) {
                    var iPropertiesLength, feedtype, propertyName;
                    if (feed.type === "dimension") {
                        iPropertiesLength = aDimensions.length;
                        feedtype = "Dimension";
                        propertyName = "dimensions";
                        aQueuedProperties = aQueuedDimensions;
                        aPropertyWithoutRoles = aDimensionWithoutRoles;
                    } else {
                        iPropertiesLength = aMeasures.length;
                        feedtype = "Measure";
                        propertyName = "measures";
                        aQueuedProperties = aQueuedMeasures;
                        aPropertyWithoutRoles = aMeasureWithoutRoles;
                    }
                    var min = 0, max = iPropertiesLength;
                    if (feed.min) {
                        min = min > feed.min ? min : feed.min;
                    }
                    if (feed.max) {
                        max = max < feed.max ? max : feed.max;
                    }
                    /* If no roles configured - add the property to feed */
                    if (!feed.role) {
                        var len = aQueuedProperties.length;
                        for (var j = 0; j < len && aFeedProperties.length < max; ++j) {
                            var val = aQueuedProperties[j];
                            aQueuedProperties.splice(j, 1);
                            --len;
                            --j;
                            aFeedProperties.push(val);
                            if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency]) { //as part of supporting V4 annotation
                                sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path : undefined;
                            } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit]) {
                                sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path : undefined;
                            } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY]) {
                                sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY];
                            }

                            if (isMeasureCurrency(oMetadata, sapUnit)) {
                                isCurrency = true;
                            } else {
                                isNotCurrency = true;
                            }

                            if (!isCurrency) {
                                minValue = checkNumberFormat(minValue, val, entityTypeObject);
                                maxScaleValue = getMaxScaleFactor(maxScaleValue, val, entityTypeObject);
                            } else {
                                minValCurr = checkNumberFormat(minValCurr, val, entityTypeObject);
                                maxScaleValueCurr = getMaxScaleFactor(maxScaleValueCurr, val, entityTypeObject);
                            }
                        }
                    } else {
                        var rolesByPrio = feed.role.split("|");
                        each(rolesByPrio, function (j, role) {
                            if (aFeedProperties.length === max) {
                                return false;
                            }
                            var len = aQueuedProperties.length;
                            for (var k = 0; k < len && aFeedProperties.length < max; ++k) {
                                var val = aQueuedProperties[k];
                                if (val && val.Role && val.Role.EnumMember &&
                                    val.Role.EnumMember.split("/") && val.Role.EnumMember.split("/")[1]) {
                                    var annotationRole = val.Role.EnumMember.split("/")[1];
                                    if (annotationRole === role) {
                                        aQueuedProperties.splice(k, 1);
                                        --len;
                                        --k;
                                        aFeedProperties.push(val);
                                        if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency]) { //as part of supporting V4 annotation
                                            sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path : undefined;
                                        } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit]) {
                                            sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path : undefined;
                                        } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY]) {
                                            sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY];
                                        }
                                        if (isMeasureCurrency(oMetadata, sapUnit)) {
                                            isCurrency = true;
                                        } else {
                                            isNotCurrency = true;
                                        }

                                        if (!isCurrency) {
                                            minValue = checkNumberFormat(minValue, val, entityTypeObject);
                                            maxScaleValue = getMaxScaleFactor(maxScaleValue, val, entityTypeObject);
                                        } else {
                                            minValCurr = checkNumberFormat(minValCurr, val, entityTypeObject);
                                            maxScaleValueCurr = getMaxScaleFactor(maxScaleValueCurr, val, entityTypeObject);
                                        }
                                    }
                                } else if ((aPropertyWithoutRoles ? Array.prototype.indexOf.call(aPropertyWithoutRoles, val) : -1) === -1) {
                                    aPropertyWithoutRoles.push(val);
                                }
                            }
                        });
                        if (aFeedProperties.length < max) {
                            each(aPropertyWithoutRoles, function (k, val) {
                                /* defaultRole is the fallback role */
                                var defaultRole;
                                var index;
                                if ((defaultRole = config[propertyName].defaultRole) &&
                                    ((rolesByPrio ? Array.prototype.indexOf.call(rolesByPrio, defaultRole) : -1) !== -1) &&
                                    (index = (aQueuedProperties ? Array.prototype.indexOf.call(aQueuedProperties, val) : -1) !== -1)) {
                                    aQueuedProperties.splice(index, 1);
                                    aFeedProperties.push(val);
                                    if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency]) { //as part of supporting V4 annotation
                                        sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_ISOCurrency].Path : undefined;
                                    } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit]) {
                                        sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path ? oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY_V4_Unit].Path : undefined;
                                    } else if (oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY]) {
                                        sapUnit = oMetadata[val[feedtype].PropertyPath][constants.UNIT_KEY];
                                    }
                                    if (isMeasureCurrency(oMetadata, sapUnit)) {
                                        isCurrency = true;
                                    } else {
                                        isNotCurrency = true;
                                    }

                                    if (!isCurrency) {
                                        minValue = checkNumberFormat(minValue, val, entityTypeObject);
                                        maxScaleValue = getMaxScaleFactor(maxScaleValue, val, entityTypeObject);
                                    } else {
                                        minValCurr = checkNumberFormat(minValCurr, val, entityTypeObject);
                                        maxScaleValueCurr = getMaxScaleFactor(maxScaleValueCurr, val, entityTypeObject);
                                    }

                                    if (aFeedProperties.length === max) {
                                        return false;
                                    }
                                }
                            });
                        }
                        if (aFeedProperties.length < min) {
                            Log.error(errorMessages.CARD_ERROR + errorMessages.MIN_FEEDS + chartType +
                            " " + errorMessages.FEEDS_OBTAINED + aFeedProperties.length + " " + errorMessages.FEEDS_REQUIRED + min +
                            " " + errorMessages.FEEDS);
                            return false;
                        }
                    }
                    if (aFeedProperties.length) {
                        var aFeeds = [];
                        var dataset;
                        if (!(dataset = vizFrame.getDataset())) {
                            Log.error(errorMessages.NO_DATASET);
                            return false;
                        }
                        oGlobalEntityType = entityTypeObject;
                        each(aFeedProperties, function (i, val) {
                            if (!val || !val[feedtype] || !val[feedtype].PropertyPath) {
                                Log.error(errorMessages.INVALID_CHART_ANNO);
                                return false;
                            }
                            var property = val[feedtype].PropertyPath;
                            var feedName = property;
                            var textColumn = property;
                            var edmType = null;
                            if (oMetadata && oMetadata[property]) {
                                if (oMetadata[property][constants.LABEL_KEY_V4]) { //as part of supporting V4 annotation
                                    if (oMetadata[property][constants.LABEL_KEY_V4].String) {
                                        feedName = getLabelFromAnnotationPath(oMetadata[property][constants.LABEL_KEY_V4].String, vizFrame, oMetadata);
                                    } else if (oMetadata[property][constants.LABEL_KEY_V4].Path) {
                                        feedName = oMetadata[property][constants.LABEL_KEY_V4].Path;
                                    } else {
                                        feedName = property; //Fallback on the technical name in case sap:label is not maintained in the desired language
                                    }
                                } else if (oMetadata[property][constants.LABEL_KEY]) {
                                    feedName = oMetadata[property][constants.LABEL_KEY];
                                } else if (property) {
                                    feedName = property;
                                }
                                if (oMetadata[property][constants.TEXT_KEY_V4]) { //as part of supporting V4 annotation
                                    textColumn = oMetadata[property][constants.TEXT_KEY_V4].String ? oMetadata[property][constants.TEXT_KEY_V4].String : oMetadata[property][constants.TEXT_KEY_V4].Path;
                                } else if (oMetadata[property][constants.TEXT_KEY]) {
                                    textColumn = oMetadata[property][constants.TEXT_KEY];
                                } else if (property) {
                                    textColumn = property;
                                }
                                edmType = oMetadata[property][constants.TYPE_KEY] || null;
                            }
                            var displayBindingPath;
                            if ((edmType === "Edm.DateTime" || edmType === "Edm.DateTimeOffset") && textColumn === property) {
                                displayBindingPath = "{path:'" + property + "', formatter: 'sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat'}";
                            } else {
                                //Check if there's a text arrangement annotation
                                if (oMetadata[property] && oMetadata[property][constants.TEXT_KEY_V4] && oMetadata[property][constants.TEXT_KEY_V4][constants.TEXT_ARRANGEMENT_ANNO]) {
                                    var oTextArrangement, sTextArrangementType;
                                    //Once you find the text for text arrangement, you need to get the text arrangement type
                                    //Text Arrangement annotation can be defined in three ways - Property Level, Text Level or Entity Level

                                    //Priority 1 - Property Level
                                    oTextArrangement = oMetadata[property][constants.TEXT_ARRANGEMENT_ANNO];
                                    sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;

                                    //Priority 2 - Text Level
                                    if (!sTextArrangementType) {
                                        oTextArrangement = oMetadata[property][constants.TEXT_KEY_V4][constants.TEXT_ARRANGEMENT_ANNO];
                                        sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;
                                    }

                                    //Priority 3 - Entity Level
                                    if (!sTextArrangementType) {
                                        var oEntityType = oGlobalEntityType;
                                        oTextArrangement = oEntityType && oEntityType[constants.TEXT_ARRANGEMENT_ANNO];
                                        sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;
                                    }
                                    switch (sTextArrangementType) {
                                        //Possible cases are TextFirst, TextLast, TextOnly and TextSeperate. Currently we don't support TextSeperate
                                        case "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst" :
                                            displayBindingPath = "{" + textColumn + "}" + " " + "(" + "{" + property + "}" + ")";
                                            break;
                                        case "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast" :
                                            displayBindingPath = "{" + property + "}" + " " + "(" + "{" + textColumn + "}" + ")";
                                            break;
                                        case "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" :
                                            displayBindingPath = "{" + textColumn + "}";
                                            break;
                                        case "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeperate" : //Currently we don't support Text Seperate, fallback to TextLast instead
                                            displayBindingPath = "{" + property + "}" + " " + "(" + "{" + textColumn + "}" + ")";
                                            break;
                                        default :
                                            displayBindingPath = "{" + property + "}";
                                            break;
                                    }
                                } else {
                                    //If there is a Text annotation but no TextArrangement annotation, just show the corresponding property (Like it behaved earlier, before this feature)
                                    displayBindingPath = "{" + textColumn + "}";
                                }
                            }
                            aFeeds.push(feedName);
                            if (feedtype === "Dimension") {
                                if (uid === "waterfallType") {
                                    var dimensionDefinition = new DimensionDefinition({
                                        name: feedName,
                                        value: "{" + property + "}"
                                        //displayValue: displayBindingPath
                                    });
                                } else {
                                    var dimensionDefinition = new DimensionDefinition({
                                        name: feedName,
                                        value: "{" + property + "}",
                                        displayValue: displayBindingPath
                                    });
                                }
                                var sapSemantics = oMetadata[property][constants.SEMANTICS_KEY];
                                var isV4CalendarYear = oMetadata[property]["com.sap.vocabularies.Common.v1.IsCalendarYear"] && oMetadata[property]["com.sap.vocabularies.Common.v1.IsCalendarYear"].Bool;
                                if (bSupportsTimeSemantics && (edmType === "Edm.DateTime" || isV4CalendarYear || edmType === "Edm.DateTimeOffset" || (sapSemantics && sapSemantics.lastIndexOf("year", 0) === 0))) {
                                    dimensionDefinition.setDataType("date");
                                }
                                dataset.addDimension(dimensionDefinition);
                                if ((dimensionArr ? Array.prototype.indexOf.call(dimensionArr, feedName) : -1) === -1) {
                                    dimensionArr.push(feedName);
                                }
                            } else {
                                dataset.addMeasure(new MeasureDefinition({
                                    name: feedName,
                                    value: "{" + property + "}"
                                }));
                                if (((measureArr ? Array.prototype.indexOf.call(measureArr, feedName) : -1) === -1) && (uid != "bubbleWidth")) {
                                    measureArr.push(feedName);
                                }
                            }

                        });
                        vizFrame.addFeed(new FeedItem({
                            'uid': uid,
                            'type': feedtype,
                            'values': aFeeds
                        }));
                        if (uid === "categoryAxis") {
                            oVizProperties[uid] = {
                                title: {
                                    visible: bHideAxisTitle ? false : true,
                                    text: aFeeds.join(", ")
                                },
                                label: {
                                    formatString: isCurrency ? 'CURR' : 'axisFormatter',
                                    truncatedLabelRatio: 0.15
                                }
                            };
                        } else {
                            oVizProperties[uid] = {
                                title: {
                                    visible: bHideAxisTitle ? false : true,
                                    text: aFeeds.join(", ")
                                },
                                label: {
                                    formatString: isCurrency ? 'CURR' : 'axisFormatter'
                                }
                            };
                        }

                        oVizPropertiesFeeds.push(oVizProperties[uid]);

                        if (config.hasOwnProperty("vizProperties")) {
                            var configi = 0;
                            var confignumberOfProperties = config.vizProperties.length;
                            var configpathToUse;
                            var configvalue;
                            for (; configi < confignumberOfProperties; configi++) {
                                if (config.vizProperties[configi].hasOwnProperty("value")) {
                                    configvalue = config.vizProperties[configi].value;
                                }
                                if (config.vizProperties[configi].hasOwnProperty("path")) {
                                    configpathToUse = (config.vizProperties[configi].path).split(".");
                                    var configlengthOfPathToUse = configpathToUse.length;
                                    var configtmp, manifestTmp;
                                    var configcurrent;
                                    for (var configj = 0, configcurrent = configpathToUse[0], configtmp = oVizProperties, manifestTmp = chartProps; configj < configlengthOfPathToUse; ++configj) {
                                        if (configj === configlengthOfPathToUse - 1) {
                                            if (manifestTmp && manifestTmp.hasOwnProperty(configcurrent)) {
                                                //FIORITECHP1-5665 - Donut and Pie charts should be able to show numbers
                                                if (chartType === 'donut' && (manifestTmp[configcurrent] === "value" || manifestTmp[configcurrent] === "percentage")) {
                                                    configvalue = manifestTmp[configcurrent];
                                                } else if (chartType != 'donut') {
                                                    configvalue = manifestTmp[configcurrent];
                                                }
                                            }
                                            if ((bConsiderAnnotationScales && (configcurrent != "adjustScale")) ||
                                                (!bConsiderAnnotationScales && (configcurrent === "adjustScale")) ||
                                                (!bConsiderAnnotationScales && (configcurrent != "adjustScale"))) {
                                                configtmp[configcurrent] = configvalue;
                                            }
                                            break;
                                        }
                                        configtmp[configcurrent] = configtmp[configcurrent] || {};
                                        configtmp = configtmp[configcurrent];
                                        if (manifestTmp) {
                                            manifestTmp[configcurrent] = manifestTmp[configcurrent] || {};
                                            manifestTmp = manifestTmp[configcurrent];
                                        }

                                        configcurrent = configpathToUse[configj + 1];
                                    }
                                }
                            }
                        }
                        if (feed.hasOwnProperty("vizProperties")) {
                            var i = 0;
                            var numberOfProperties = feed.vizProperties.length;
                            var attributeValue;
                            var methodToUse;
                            var pathToUse;

                            for (; i < numberOfProperties; i++) {
                                if (feed.vizProperties[i].hasOwnProperty("method")) {
                                    methodToUse = feed.vizProperties[i].method;

                                    switch (methodToUse) {
                                        case 'count':
                                            attributeValue = aFeeds.length;
                                            if (feed.vizProperties[i].hasOwnProperty("min") &&
                                                attributeValue <= feed.vizProperties[i].min) {
                                                attributeValue = feed.vizProperties[i].min;
                                            } else if (feed.vizProperties[i].hasOwnProperty("max") &&
                                                attributeValue >= feed.vizProperties[i].max) {
                                                attributeValue = feed.vizProperties[i].max;
                                            }
                                            break;
                                    default: break;
                                    }
                                } else if (feed.vizProperties[i].hasOwnProperty("value")) {
                                    attributeValue = feed.vizProperties[i].value;

                                }
                                if (feed.vizProperties[i].hasOwnProperty("path")) {
                                    pathToUse = (feed.vizProperties[i].path).split(".");
                                    var lengthOfPathToUse = pathToUse.length;
                                    for (var j = 0, current = pathToUse[0], tmp = oVizProperties; j < lengthOfPathToUse; ++j) {
                                        if (j === lengthOfPathToUse - 1) {
                                            tmp[current] = attributeValue;
                                            break;
                                        }
                                        tmp[current] = tmp[current] || {};
                                        tmp = tmp[current];
                                        current = pathToUse[j + 1];
                                    }
                                }
                            }
                        }
                    }
                }
            });

            var feeds = vizFrame.getFeeds();
            if (config.properties && config.properties.semanticPattern === true && getMeasureDimCheck(feeds, chartType)) {
                each(feeds, function (i, v) {
                    if (feeds[i].getType() === 'Measure' && ((feeds[i].getUid() === 'valueAxis') || (feeds[i].getUid() === 'actualValues'))) {
                        var selectedValue;
                        each(aMeasures, function (index, value) {
                            var valueLabel = getSapLabel(value.Measure.PropertyPath, oMetadata);
                            if (valueLabel === feeds[i].getValues()[0]) {
                                selectedValue = checkForecastMeasure(value, entityTypeObject);
                                return false;
                            }
                        });
                        if (selectedValue) {
                            var actualMeasure = getSapLabel(selectedValue.Measure.PropertyPath, oMetadata);
                            var forecastMeasure = (entityTypeObject[selectedValue.DataPoint.AnnotationPath.substring(1)].ForecastValue.PropertyPath || entityTypeObject[selectedValue.DataPoint.AnnotationPath.substring(1)].ForecastValue.Path);
                            var forecastValue = getSapLabel(forecastMeasure, oMetadata);
                            var actualValue = OvpResources.getText("ACTUAL", [actualMeasure]);
                            var forecastValueName = OvpResources.getText("FORECAST", [forecastValue]);
                            oVizProperties.plotArea.dataPointStyle = {
                                rules: [
                                    {
                                        dataContext: {
                                            MeasureNamesDimension: actualMeasure
                                        },
                                        properties: {
                                            color: "sapUiChartPaletteSequentialHue1Light1",
                                            lineType: "line",
                                            lineColor: "sapUiChartPaletteSequentialHue1Light1"

                                        },
                                        displayName: actualValue
                                    },
                                    {
                                        dataContext: {
                                            MeasureNamesDimension: forecastValue
                                        },
                                        properties: {
                                            color: "sapUiChartPaletteSequentialHue1Light1",
                                            lineType: "dotted",
                                            lineColor: "sapUiChartPaletteSequentialHue1Light1",
                                            pattern: "diagonalLightStripe"
                                        },
                                        displayName: forecastValueName
                                    }]
                            };
                            vizFrame.getDataset().addMeasure(new MeasureDefinition({
                                name: forecastValue,
                                value: "{" + forecastMeasure + "}"
                            }));
                            var values = feeds[i].getValues();
                            values.push(forecastValue);
                            feeds[i].setValues(values);
                        }
                        return false;
                    }
                });
            }

            if (config.properties && config.properties.semanticPattern === true && getMeasureDimCheck(feeds, chartType) && vizFrame.getVizType() === "vertical_bullet") {
                each(feeds, function (i, v) {
                    if (feeds[i].getType() === 'Measure' && ((feeds[i].getUid() === 'valueAxis') || (feeds[i].getUid() === 'actualValues'))) {
                        var selectedValue;
                        each(aMeasures, function (index, value) {
                            var valueLabel = getSapLabel(value.Measure.PropertyPath, oMetadata);
                            if (valueLabel === feeds[i].getValues()[0]) {
                                selectedValue = checkTargetMeasure(value, entityTypeObject);
                                return false;
                            }
                        });
                        if (selectedValue) {
                            //var actualMeasure = getSapLabel(selectedValue.Measure.PropertyPath, oMetadata);
                            var targetMeasure = (entityTypeObject[selectedValue.DataPoint.AnnotationPath.substring(1)].TargetValue.PropertyPath || entityTypeObject[selectedValue.DataPoint.AnnotationPath.substring(1)].TargetValue.Path);
                            var targetValue = getSapLabel(targetMeasure, oMetadata);
                            /*var actualValue = OvpResources.getText("ACTUAL",[actualMeasure]);
                             var targetValueName = OvpResources.getText("FORECAST",[targetValue]);*/

                            vizFrame.getDataset().addMeasure(new MeasureDefinition({
                                name: targetValue,
                                value: "{" + targetMeasure + "}"
                            }));
                            /*var values = feeds[i].getValues();
                             values.push(targetValue);
                             feeds[i].setValues(values);*/
                            vizFrame.addFeed(new FeedItem({
                                'uid': "targetValues",
                                'type': "Measure",
                                'values': [targetValue]
                            }));
                        }
                        return false;
                    }
                });
            }

            if (isCurrency && isNotCurrency) {
                Log.warning(OvpResources.getText("Currency_non_currency_measure"));
            }

            //Applying the correct formatting for valueAxes as per the property type
            each(feeds, function(i, feed){
                //Loop through available feeds for the chart
                //Only perform this task for measures
                var feedType = feed.getProperty("type");
                if (feedType === "Measure"){
                    var aFeedValues = feed.getProperty("values");
                    var isMeasureDecimal = true;
                    var aFeedValueContexts = chartContext.MeasureAttributes.filter(function(measureAttr){
                        return aFeedValues.indexOf(oMetadata[measureAttr[feedType]["PropertyPath"]][constants.LABEL_KEY]) >= 0 ||
                        aFeedValues.indexOf(oMetadata[measureAttr[feedType]["PropertyPath"]][constants.LABEL_KEY_V4]) >= 0 ;
                    });
                    //Loop through the feedValues - these are properties of the entity set
                    each(aFeedValueContexts, function(j, contextMeasure){
                            //if any one property that is a measure is not of
                            //type Int32 or Int64, consider Decimal formatting for it
                        if (checkEDMINT32Exists(oMetadata, contextMeasure, feedType) ||
                        checkEDMINT64Exists(oMetadata, contextMeasure, feedType)){
                            isMeasureDecimal = false;
                        }else {
                            isMeasureDecimal = true;
                            //break once this condition is met
                            return false;
                        }
                    });
                    if (!isMeasureDecimal){
                        oVizProperties[feed.getProperty('uid')]['label']['allowDecimals'] = false;
                    }
                }
            });

            var scaleUnit;

            if (maxScaleValueCurr === undefined) {
                maxScaleValueCurr = "";
            }

            if (maxScaleValue === undefined) {
                maxScaleValue = "";
            }

            if (isCurrency) {
                scaleUnit = getScaleUnit(maxScaleValueCurr, isCurrency);
            } else {
                scaleUnit = getScaleUnit(maxScaleValue, isCurrency);
            }

            if (handler) {
                handler.setScale(scaleUnit);
            }
            setFormattedChartTitle(measureArr, dimensionArr, chartTitle);

            var fmtStr = "";

            //Applying NumberOfFractionalDigits per measure feed
            each(feeds, function(i, feed){
                var feedFractionalDigits = "-1";
                var currentFeedType = feed.getProperty("type");
                //Looping through feeds
                if (currentFeedType === "Measure"){
                    //Get the correct feed
                    var oVizPropertiesFeed = oVizPropertiesFeeds.filter(function(singleFeed){
                        var result = singleFeed["title"]["text"].split(",").filter(function(property){
                            if (feed.getValues().indexOf(property.trim()) >= 0){
                                return true;
                            }else {
                                return false;
                            }
                        });
                        if (result.length > 0){
                            return true;
                        }else {
                            return false;
                        }
                    });

                    if (oVizPropertiesFeed && oVizPropertiesFeed.length){
                        var aPropertiesLabels = feed.getValues();
                        if (aPropertiesLabels && aPropertiesLabels.length){
                            //Get the correct property
                            each(aPropertiesLabels, function(i, propertyLabel){
                                var trimmedPropertyLabel = propertyLabel.trim();
                                var currentMeasure = aMeasures.filter(function(measureObject){
                                    if (measureObject["Measure"] && measureObject["Measure"]["PropertyPath"]){
                                        var measureProperty = measureObject["Measure"]["PropertyPath"];
                                        if ((oMetadata[measureProperty] && oMetadata[measureProperty][constants.LABEL_KEY] === trimmedPropertyLabel)
                                            || (oMetadata[measureProperty] && oMetadata[measureProperty][constants.LABEL_KEY_V4] === trimmedPropertyLabel)){
                                            return true;
                                        }else {
                                            return false;
                                        }
                                    }
                                });

                                //Get the Datapoint annotation and corresponding fractional digits for the measure
                                if (currentMeasure && currentMeasure.length){
                                    var currentMeasureObject = currentMeasure[0];
                                    //Fetch fractional digits only if the measure is not of Edm.Int32 or Edm.Int64
                                    if (!checkEDMINT32Exists(oMetadata, currentMeasureObject, currentFeedType) &&
                                        !checkEDMINT64Exists(oMetadata, currentMeasureObject, currentFeedType)){
                                        var currentMeasureDPPath = "";
                                        if (currentMeasureObject && currentMeasureObject["DataPoint"] &&
                                                currentMeasureObject["DataPoint"]["AnnotationPath"] && currentMeasureObject["DataPoint"]["AnnotationPath"]){
                                                currentMeasureDPPath = currentMeasureObject["DataPoint"]["AnnotationPath"] && currentMeasureObject["DataPoint"]["AnnotationPath"].substring(1);
                                            if (currentMeasureDPPath != ""){
                                                var tempFractionalDigits;
                                                //Only overwrite the fractional digits for the feed if it is greater than the previous measure's NumberOfFractionalDigits
                                                tempFractionalDigits = entityTypeObject[currentMeasureDPPath] && entityTypeObject[currentMeasureDPPath]["ValueFormat"]
                                                    && entityTypeObject[currentMeasureDPPath]["ValueFormat"]["NumberOfFractionalDigits"]
                                                    && entityTypeObject[currentMeasureDPPath]["ValueFormat"]["NumberOfFractionalDigits"]["Int"];
                                                feedFractionalDigits = tempFractionalDigits > feedFractionalDigits ? tempFractionalDigits : feedFractionalDigits;
                                            }
                                        }
                                    }else {
                                        //If the datatype is Edm.Int32 or Edm.Int64
                                        feedFractionalDigits = feedFractionalDigits < "0" ? "0" : feedFractionalDigits;
                                    }
                                }
                            });
                        }
                    }

                    if (oVizPropertiesFeed && oVizPropertiesFeed[0] && oVizPropertiesFeed[0].label && oVizPropertiesFeed[0].label.formatString){
                        var formatStr = oVizPropertiesFeed[0].label.formatString;
                    }
                    fmtStr = "";
                    if (isCurrency) {
                        if (formatStr === 'CURR') {
                            fmtStr = 'CURR/' + feedFractionalDigits.toString() + "/";// + maxScaleValueCurr.toString(); //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
                        } else {
                            fmtStr = 'axisFormatter/' + feedFractionalDigits.toString() + "/";// + maxScaleValueCurr.toString(); //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
                        }
                    } else {
                        fmtStr = 'axisFormatter/' + feedFractionalDigits.toString() + "/";// + maxScaleValue.toString(); //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
                    }
                    if (oVizPropertiesFeed && oVizPropertiesFeed[0]){
                        oVizPropertiesFeed[0].label.formatString = fmtStr;
                    }
                }
            });

            if (chartType === "vertical_bullet") {
                oVizProperties["valueAxis"] = {
                    title: {
                        visible: bHideAxisTitle ? false : true
                    },
                    label: {
                        formatString: fmtStr
                    }
                };
            }

            var finalMinValue = "";
            var donutFmtStr = "";
            if (isCurrency) {
                finalMinValue = minValCurr.toString();
                donutFmtStr = 'CURR/' + minValCurr.toString() + "/";
            } else {
                finalMinValue = minValue.toString();
                donutFmtStr = 'axisFormatter/' + minValue.toString() + "/";
            }

            if (chartType === "donut") {
                oVizProperties.plotArea.dataLabel.formatString = donutFmtStr;
                if (oVizProperties.plotArea.dataLabel.type === "percentage") {
                    oVizProperties.plotArea.dataLabel.formatString = "0.0%/" + finalMinValue + "/";
                }
            }

            checkRolesForProperty(aQueuedDimensions, config, "dimension");
            checkRolesForProperty(aQueuedMeasures, config, "measure");

            //updating levels for timeAxis vizproperty
            if (bSupportsTimeSemantics){
                var timeDimension = aDimensions[0].Dimension.PropertyPath;
                //Support for V4 annotations
                if (oMetadata[timeDimension][constants.SEMANTICS_KEY] === 'yearmonth' || oMetadata[timeDimension]["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"]) {
                    oVizProperties.timeAxis.levels = ["year","month"];
                } else if (oMetadata[timeDimension][constants.SEMANTICS_KEY] === 'yearquarter' || oMetadata[timeDimension]["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"]) {
                    oVizProperties.timeAxis.levels = ["quarter"];
                } else if (oMetadata[timeDimension][constants.SEMANTICS_KEY] === 'yearweek' || oMetadata[timeDimension]["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"]) {
                    oVizProperties.timeAxis.levels = ["week"];
                }
            }
            vizFrame.setVizProperties(oVizProperties);
        }

        function setChartUoMTitle(vizFrame, vizData, chartTitle) {

            if (vizFrame && (vizFrame.getVizType() === "bubble" || vizFrame.getVizType() === "scatter")) {
                return;
            }
            var oCardsModel, entityTypeObject, chartAnno, chartContext;
            var aMeasures;
            var unitKey = constants.UNIT_KEY;
            var unitKey_v4_isoCurrency = constants.UNIT_KEY_V4_ISOCurrency; //as part of supporting V4 annotation
            var unitKey_v4_unit = constants.UNIT_KEY_V4_Unit; //as part of supporting V4 annotation
            var tmp;
            var measureList = [];

            if (!(oCardsModel = vizFrame.getModel('ovpCardProperties'))) {
                Log.error(errorMessages.CARD_ERROR + "in " + errorMessages.CARD_CONFIG +
                errorMessages.NO_CARD_MODEL);
                return;
            }

            var dataModel = vizFrame.getModel();
            var entitySet = oCardsModel.getProperty("/entitySet");
            if (!dataModel || !entitySet) {
                return;
            }
            entityTypeObject = oCardsModel.getProperty("/entityType");
            if (!entityTypeObject) {
                Log.error(errorMessages.CARD_ANNO_ERROR + "in " + errorMessages.CARD_ANNO);
                return;
            }
            var oMetadata = getMetadata(dataModel, entitySet);
            chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
            if (!chartAnno || !(chartContext = entityTypeObject[chartAnno])) {
                Log.error(errorMessages.CARD_ANNO_ERROR + "in " + errorMessages.CARD_ANNO);
                return;
            }

            if (!(aMeasures = chartContext.MeasureAttributes) || !aMeasures.length) {
                Log.error(errorMessages.CHART_ANNO_ERROR + "in " + errorMessages.CHART_ANNO + " " +
                errorMessages.MEASURES_MANDATORY);
                return;
            }

            each(aMeasures, function (i, m) {
                tmp = m.Measure.PropertyPath;
                if (m.DataPoint && m.DataPoint.AnnotationPath) {
                    var datapointAnnotationPath = entityTypeObject[m.DataPoint.AnnotationPath.substring(1)];
                    if (datapointAnnotationPath.ForecastValue && (datapointAnnotationPath.ForecastValue.PropertyPath || datapointAnnotationPath.ForecastValue.Path)) {
                        measureList.push((datapointAnnotationPath.ForecastValue.PropertyPath || datapointAnnotationPath.ForecastValue.Path));
                    }
                }
                measureList.push(tmp);
            });

            var result = vizData ? vizData.results : null;
            var unitType = "";
            var bSetChartUoMTitle = true;
            var feedMeasures = [];

            var feeds = vizFrame.getFeeds();

            each(feeds, function (i, feed) {
                if (feed.getType() === "Measure") {
                    feedMeasures = feedMeasures.concat(feed.getValues());
                }
            });

            if (result) {
                each(measureList, function (i, property) {
                    var feedName = "";
                    if (oMetadata && oMetadata[property]) {
                        if (oMetadata[property][constants.LABEL_KEY_V4]) { //as part of supporting V4 annotation
                            feedName = getLabelFromAnnotationPath(oMetadata[property][constants.LABEL_KEY_V4].String ? oMetadata[property][constants.LABEL_KEY_V4].String : oMetadata[property][constants.LABEL_KEY_V4].Path, vizFrame, oMetadata);
                        } else if (oMetadata[property][constants.LABEL_KEY]) {
                            feedName = oMetadata[property][constants.LABEL_KEY];
                        } else if (property) {
                            feedName = property;
                        }
                    }
                    if ((feedMeasures ? Array.prototype.indexOf.call(feedMeasures, feedName) : -1) != -1) {
                        if (oMetadata && oMetadata[property]) {
                            var unitCode;
                            // if (unitCode && oMetadata[unitCode] && oMetadata[currCode][semanticKey] === currencyCode) {
                            if (oMetadata[property][unitKey_v4_isoCurrency]) { //as part of supporting V4 annotation
                                unitCode = oMetadata[property][unitKey_v4_isoCurrency].Path ? oMetadata[property][unitKey_v4_isoCurrency].Path : oMetadata[property][unitKey_v4_isoCurrency].String;
                            } else if (oMetadata[property][unitKey_v4_unit]) {
                                unitCode = oMetadata[property][unitKey_v4_unit].Path ? oMetadata[property][unitKey_v4_unit].Path : oMetadata[property][unitKey_v4_unit].String;
                            } else if (oMetadata[property][unitKey]) {
                                unitCode = oMetadata[property][unitKey];
                            }
                            if (!unitCode) {
                                bSetChartUoMTitle = false;
                                return false;
                            }
                            if (unitCode && oMetadata[unitCode]) {
                                for (var i = 0; i < result.length; i++) {
                                    var objData = result[i];
                                    if (bSetChartUoMTitle) {
                                        if (unitType && objData[unitCode] && (objData[unitCode] != "" ) && (unitType != "") && (unitType != objData[unitCode])) {
                                            bSetChartUoMTitle = false;
                                            break;
                                        }
                                    }
                                    unitType = objData[unitCode];
                                }
                            }
                        }
                    }

                });
            }

            var chartUnitTitleTxt = "";

            if (bSetChartUoMTitle) {
                if (unitType != "") {
                    chartUnitTitleTxt = OvpResources.getText("IN_NO_SCALE", [unitType]);
                    chartUnitTitleTxt = " " + chartUnitTitleTxt;
                }
                if (chartTitle) {
                    chartTitle.setText(chartUnitTitleTxt);
                    chartTitle.data("aria-label", chartUnitTitleTxt, true);

                    //Also append it to the existing aria-label for VizFrame
                    var labelForVizFrame = vizFrame.data("aria-label");
                    if (labelForVizFrame && chartUnitTitleTxt && labelForVizFrame.indexOf(chartUnitTitleTxt) === -1){
                        var updatedLabelForVizFrame = labelForVizFrame + chartUnitTitleTxt;
                        vizFrame.data("aria-label", updatedLabelForVizFrame, true);
                    }
                }
            }
        }

        /*
         * Check if the feed has a com.sap.vocabularies.Common.v1.Label associated with it, and obtain the appropriate value from ResourceBundle if present
         */
         function getLabelFromAnnotationPath(feedName, vizFrame, oMetadata){
            var sResourceModelName;
            var sPropertyName;
            var aTemp;
            if (feedName.indexOf("{") === 0) {
                feedName = feedName.slice(1, -1);
                if (feedName.indexOf(">") != -1) {
                    aTemp = feedName.split(">");
                    sResourceModelName = aTemp[0];
                    sPropertyName = aTemp[1];
                } else if (feedName.indexOf("&gt;") != -1) {
                    aTemp = feedName.split("&gt;");
                    sResourceModelName = aTemp[0];
                    sPropertyName = aTemp[1];
                }
                // get ovp card properties
                try {
                    feedName = vizFrame.getModel(sResourceModelName).getProperty(sPropertyName);
                } catch (err) {
                    feedName = oMetadata[feedName][constants.LABEL_KEY_V4].String;
                    Log.error("Unable to read labels from resource file",err);
                }
            }
            return feedName;
         }

        /*
         * Get the (cached) OData metadata information.
         */
        function getMetadata(model, entitySet) {
            var map = Utils.cacheODataMetadata(model);
            if (!map) {
                return undefined;
            }
            return map[entitySet];
        }

        function setFormattedChartTitle(measureArr, dimensionArr, chartTitle) {
            var txt = "", measureStr = "", dimensionStr = "";
            if (chartTitle) {
                txt = chartTitle.getText();
            }

            if (measureArr && (measureArr.length > 1)) {
                for (var i = 0; i < measureArr.length - 1; i++) {
                    if (measureStr != "") {
                        measureStr += ", ";
                    }
                    measureStr += measureArr[i];
                }
                measureStr = OvpResources.getText("MEAS_DIM_TITLE", [measureStr, measureArr[i]]);
            } else if (measureArr) {
                measureStr = measureArr[0];
            }

            if (dimensionArr && (dimensionArr.length > 1)) {
                for (var i = 0; i < dimensionArr.length - 1; i++) {
                    if (dimensionStr != "") {
                        dimensionStr += ", ";
                    }
                    dimensionStr += dimensionArr[i];
                }
                dimensionStr = OvpResources.getText("MEAS_DIM_TITLE", [dimensionStr, dimensionArr[i]]);
            } else if (dimensionArr) {
                dimensionStr = dimensionArr[0];
            }

            if (chartTitle && (txt === "")) {
                txt = OvpResources.getText("NO_CHART_TITLE", [measureStr, dimensionStr]);
                chartTitle.setText(txt);
                chartTitle.data("aria-label", txt, true);
            }
        }

        function getScaleUnit(maxScaleValue, isCurrency) {
            var num = 1;
            var scaledNum;
            if (isCurrency) {
                var currencyFormat = NumberFormat.getCurrencyInstance(
                    {
                        style: 'short',
                        currencyCode: false,
                        shortRefNumber: maxScaleValue
                    }
                );
                scaledNum = currencyFormat.format(Number(num));
            } else {
                var numberFormat = NumberFormat.getFloatInstance(
                    {
                        style: 'short',
                        shortRefNumber: maxScaleValue
                    }
                );
                scaledNum = numberFormat.format(Number(num));
            }

            var scaleUnit = scaledNum.slice(-1);
            return scaleUnit;
        }

        function getSelectedDataPoint(vizFrame, controller) {

            vizFrame.attachSelectData(function (oEvent) {
                var sNavMode = OVPUtils.bCRTLPressed ? OVPUtils.constants.explace : OVPUtils.constants.inplace;
                OVPUtils.bCRTLPressed = false;

                var oCardsModel = vizFrame.getModel('ovpCardProperties');
                var dataModel = vizFrame.getModel();
                var entitySet = oCardsModel.getProperty("/entitySet");
                var oMetadata = getMetadata(dataModel, entitySet);
                var dimensionArrayNames = [], dimensions = [];
                var finalDimensions = {}, aCustomContext = {};
                var dimensionsArr = vizFrame.getDataset().getDimensions();
                var contextNumber;

                for (var i = 0; i < dimensionsArr.length; i++) {
                    dimensionArrayNames.push(dimensionsArr[i].getName());
                }

                var allData = jQuery.map(vizFrame.getDataset().getBinding("data").getCurrentContexts(), function (x) {
                    return x.getObject();
                });

                if (oEvent.getParameter("data") && oEvent.getParameter("data")[0] && oEvent.getParameter("data")[0].data) {
                    dimensions = Object.keys(oEvent.getParameter("data")[0].data);
                    contextNumber = oEvent.getParameter("data")[0].data._context_row_number;
                    var oContext = vizFrame.getDataset().getBinding("data").getContexts()[contextNumber];
                    var oNavigationField = controller.getEntityNavigationEntries(oContext)[0];
                    if (allData[contextNumber].$isOthers && allData[contextNumber].$isOthers === true) {
                        var aOtherNavigationDimension = {}, aFinalDimensions = [];
                        //get all dimensions which are shown
                        for (var j = 0; j < dimensionArrayNames.length; j++) {
                            for (var k = 0; k < dimensions.length; k++) {
                                if (dimensionArrayNames[j] === dimensions[k]) {
                                    for (var key in oMetadata) {
                                        if (oMetadata.hasOwnProperty(key)) {
                                            var propertyName = oMetadata[key][constants.LABEL_KEY] || oMetadata[key][constants.NAME_KEY] || oMetadata[key][constants.NAME_CAP_KEY];
                                            if (propertyName === dimensions[k]) {
                                                aFinalDimensions.push(key);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //get all values of all dimensions which are shown
                        for (var i = 0; i < aFinalDimensions.length; i++) {
                            aOtherNavigationDimension[aFinalDimensions[i]] = [];
                            for (var j = 0; j < allData.length - 1; j++) {
                                if (j != contextNumber) {
                                    aOtherNavigationDimension[aFinalDimensions[i]].push(allData[j][aFinalDimensions[i]]);
                                }
                            }
                        }

                        var donutIntent = {$isOthers: true};
                        var payLoad = {
                            getObject: function () {
                                return donutIntent;
                            },
                            getOtherNavigationDimensions: function(){
                                return aOtherNavigationDimension;
                            }
                        };
                        if (OVPCardAsAPIUtils.checkIfAPIIsUsed(controller)) {
                            if (controller.checkAPINavigation()){
                                //The function is only called when there is a valid semantic object and action is available
                                CommonUtils.onContentClicked(payLoad);
                            }
                        } else {
                            if (oNavigationField) {
                                controller.doNavigation(payLoad, oNavigationField, sNavMode);
                            }
                        }
                    } else {
                        for (var j = 0; j < dimensionArrayNames.length; j++) {
                            for (var k = 0; k < dimensions.length; k++) {
                                if (dimensionArrayNames[j] === dimensions[k]) {
                                    for (var key in oMetadata) {
                                        if (oMetadata.hasOwnProperty(key)) {
                                            var propertyName = (oMetadata[key][constants.LABEL_KEY_V4] && oMetadata[key][constants.LABEL_KEY_V4].String) || oMetadata[key][constants.LABEL_KEY] || oMetadata[key][constants.NAME_KEY] || oMetadata[key][constants.NAME_CAP_KEY];
                                            if (propertyName.match(/{@i18n>.+}/gi)) { //To also consider i18n string coming from Common.Label annotation
                                                var oRb = this.getModel("@i18n").getResourceBundle();
                                                propertyName = oRb.getText(propertyName.substring(propertyName.indexOf(">") + 1, propertyName.length - 1));
                                            }
                                            if (propertyName === dimensions[k]) {
                                                finalDimensions[key] = allData[contextNumber][key];
                                            }
                                        }
                                    }
                                }
                                for (var key in allData[contextNumber]) {
                                    if (oMetadata.hasOwnProperty(key)) {
                                        aCustomContext[key] = allData[contextNumber][key]; //aCustomContext will have all the data related to datapoint
                                    }
                                }
                            }
                        }

                        //converting Date timeAxis dimension values back to Edm.String, if as per metadata, they are of type Edm.String
                        if (finalDimensions){
                            each(Object.keys(finalDimensions), function(i, key){
                                if (oMetadata[key]["type"] === "Edm.String"){
                                    if (oMetadata[key]["sap:semantics"] === "yearmonth" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"]){
                                        finalDimensions[key] = (finalDimensions[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYMM"}).format(finalDimensions[key]) : finalDimensions[key]);
                                    }else if (oMetadata[key]["sap:semantics"] === "yearquarter" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"]){
                                        finalDimensions[key] = (finalDimensions[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYQ"}).format(finalDimensions[key]) : finalDimensions[key]);
                                    }else if (oMetadata[key]["sap:semantics"] === "yearweek" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"]){
                                        finalDimensions[key] = (finalDimensions[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYww"}).format(finalDimensions[key]) : finalDimensions[key]);
                                    }
                                }
                            });
                        }

                        if (aCustomContext){
                            each(Object.keys(aCustomContext), function(i, key){
                                if (oMetadata[key]["type"] === "Edm.String"){
                                    if (oMetadata[key]["sap:semantics"] === "yearmonth" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"]){
                                        aCustomContext[key] = (aCustomContext[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYMM"}).format(aCustomContext[key]) : aCustomContext[key]);
                                    }else if (oMetadata[key]["sap:semantics"] === "yearquarter" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"]){
                                        aCustomContext[key] = (aCustomContext[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYQ"}).format(aCustomContext[key]) : aCustomContext[key]);
                                    }else if (oMetadata[key]["sap:semantics"] === "yearweek" || oMetadata[key]["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"]){
                                        aCustomContext[key] = (aCustomContext[key].constructor === Date ? DateFormat.getDateTimeInstance({pattern: "YYYYww"}).format(aCustomContext[key]) : aCustomContext[key]);
                                    }
                                }
                            });
                        }
                        //Adding requestAtLeast Fields as the part of Navigation Params for analytical card
                        var oEntityType = oCardsModel.getProperty("/entityType"),
                            oPresentationVariant = oEntityType[oCardsModel.getProperty('/presentationAnnotationPath')];
                        if (oEntityType) {
                            var requestFields = CardAnnotationHelper.getRequestFields(oPresentationVariant);
                            if (requestFields && requestFields.length > 0) {
                                each(requestFields, function (i, r) {
                                    if (!finalDimensions.hasOwnProperty(r)) {
                                        finalDimensions[r] = allData[contextNumber][r];
                                    }
                                });
                            }
                        }

                        var payLoad = {
                            getObject: function () {
                                return finalDimensions;
                            },
                            //getAllData will allow the user to pass additional data using cutom navigation
                            getAllData: function () {
                                return aCustomContext;
                            }
                        };

                        if (OVPCardAsAPIUtils.checkIfAPIIsUsed(controller)) {
                            if (controller.checkAPINavigation()){
                                //The function is only called when there is a valid semantic object and action is available
                                CommonUtils.onContentClicked(payLoad);
                            }
                        } else {
                            if (oNavigationField) {
                                controller.doNavigation(payLoad, oNavigationField, sNavMode);
                            }
                        }
                    }
                }
            });
        }

        function checkBubbleChart(chartType) {
            if (chartType.EnumMember.endsWith("Bubble")) {
                return true;
            } else {
                return false;
            }
        }

        function dimensionAttrCheck(dimensions) {
            var ret = false;
            if (!dimensions ||
                dimensions.constructor != Array ||
                dimensions.length < 1 ||
                dimensions[0].constructor != Object || !dimensions[0].Dimension || !dimensions[0].Dimension.PropertyPath) {
                Log.error(errorMessages.CHART_ANNO_ERROR + "in " + errorMessages.CHART_ANNO + " " +
                errorMessages.DIMENSIONS_MANDATORY);
                return ret;
            }
            ret = true;
            return ret;
        }

        function measureAttrCheck(measures) {
            var ret = false;
            if (!measures ||
                measures.constructor != Array ||
                measures.length < 1 ||
                measures[0].constructor != Object || !measures[0].Measure || !measures[0].Measure.PropertyPath) {
                Log.error(errorMessages.CHART_ANNO_ERROR + "in " + errorMessages.CHART_ANNO + " " +
                errorMessages.MEASURES_MANDATORY);
                return ret;
            }
            ret = true;
            return ret;
        }

        function getEntitySet(oEntitySet) {
            return oEntitySet.name;
        }

        function getAnnotationQualifier(annotationPath) {
            if (annotationPath && annotationPath.indexOf("#") != -1) {
                var tokens = annotationPath.split("#");
                if (tokens.length > 1) {
                    return tokens[1];
                }
            }
            return "";
        }

        /*
         * Method called upon resize of analytical card where the calculation is done to fetch more data-point
         * @method reprioritizeContent
         * @param {Object} newCardLayout - Card layout object which contains all resizing properties
         * @param {Object} vizFrame - viz object
         */
        function reprioritizeContent(newCardLayout, vizFrame) {
            var oCardsModel = vizFrame.getModel('ovpCardProperties');
            var cardPropObject = getMaxItems(vizFrame);
            var maxItems = +cardPropObject.itemsLength;
            var dataStep = +oCardsModel.getProperty("/dataStep");
            if (maxItems && dataStep) {
                var colSpanOffset = newCardLayout.colSpan - 1;
                if (colSpanOffset >= 0) {
                    maxItems += dataStep * colSpanOffset;
                    updateBindingForAnalyticalCard(vizFrame, maxItems);
                }
            }
        }

        /*
         * Method to calculate the initial items mentioned in presentation annotation and data step
         * @method getMaxItems
         * @param {Object} vizFrame - viz object
         * @return {Object} object - object containing maxitems and data step
         */
        function getMaxItems(vizFrame) {
            var oCardsModel = vizFrame.getModel('ovpCardProperties');
            var entityTypeObject = oCardsModel.getProperty("/entityType");
            var presentationAnno = oCardsModel.getProperty("/presentationAnnotationPath");
            var presentationContext = entityTypeObject.hasOwnProperty(presentationAnno) && entityTypeObject[presentationAnno];
            var maxItemTerm = presentationContext && presentationContext.MaxItems;
            if (maxItemTerm) {
                var maxItems = maxItemTerm.Int32 ? maxItemTerm.Int32 : maxItemTerm.Int;
                return {
                    itemsLength: +maxItems,
                    dataStep: +oCardsModel.getProperty("/dataStep")
                };
            }
        }

        /*
         * Method to update the binding after resize if required
         * @method updateBindingForAnalyticalCard
         * @param {Object} vizFrame - viz object
         * @param {Integer} maxItems - no of datat-points to fetch
         */
        function updateBindingForAnalyticalCard(vizFrame, maxItems) {
            var newAggrBinding, newBinding = {}, finalMeasures = [];
            var chartType = vizFrame.getVizType();
            var oCardsModel = vizFrame.getModel('ovpCardProperties');
            var entityTypeObject = oCardsModel.getProperty("/entityType");
            var chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
            var chartContext = entityTypeObject[chartAnno];
            var vizFrameParent = vizFrame.getParent();
            var dataBinding = vizFrameParent.getBinding("data");
            newBinding.path = dataBinding.getPath();
            newBinding.parameters = {};
            if (dataBinding.mParameters && dataBinding.mParameters.select){
                newBinding.parameters.select = dataBinding.mParameters.select;
            }
            newBinding.filters = dataBinding.aApplicationFilters;
            newBinding.sorter = dataBinding.aSorters;
            newBinding.length = ( chartType === "donut") ? maxItems + 1 : maxItems;//(count-1)== maxItems? maxItems+1:maxItems;
            newBinding.template = new CoreElement();
            vizFrameParent.bindAggregation("data", newBinding);
            if (chartType === "donut") {
                each(chartContext.MeasureAttributes, function (i, m) {
                    finalMeasures.push(m.Measure.PropertyPath);
                });
                newAggrBinding = {};
                newAggrBinding.path = dataBinding.getPath();
                newAggrBinding.parameters = {};
                newAggrBinding.parameters.select = finalMeasures.join(",");
                newAggrBinding.filters = dataBinding.aApplicationFilters;
                newAggrBinding.sorter = dataBinding.aSorters;
                newAggrBinding.length = 1;//(count-1)== maxItems? maxItems+1:maxItems;
                newAggrBinding.template = new CoreElement();
                vizFrameParent.bindAggregation("aggregateData", newAggrBinding);
            }
            vizFrameParent.updateBindingContext();
        }

        //The returned attributes can be used outside this file using namespace sap.ovp.cards.charts.SmartAnnotationManager
        return {
            constants: constants,
            errorMessages: errorMessages,
            formatItems: formatItems,
            formatByType: formatByType,
            returnDateFormat: returnDateFormat,
            formatChartAxes: formatChartAxes,
            hideDateTimeAxis: hideDateTimeAxis,
            checkExists: checkExists,
            validateCardConfiguration: validateCardConfiguration,
            checkNoData: checkNoData,
            getConfig: getConfig,
            hasTimeSemantics: hasTimeSemantics,
            getChartType: getChartType,
            getPrimitiveValue: getPrimitiveValue,
            formThePathForCriticalityStateCalculation: formThePathForCriticalityStateCalculation,
            checkFlag: checkFlag,
            buildVizAttributes: buildVizAttributes,
            setChartUoMTitle: setChartUoMTitle,
            getMetadata: getMetadata,
            getSelectedDataPoint: getSelectedDataPoint,
            checkBubbleChart: checkBubbleChart,
            dimensionAttrCheck: dimensionAttrCheck,
            measureAttrCheck: measureAttrCheck,
            getEntitySet: getEntitySet,
            getAnnotationQualifier: getAnnotationQualifier,
            reprioritizeContent: reprioritizeContent,
            getMaxItems: getMaxItems,
            getLabelFromAnnotationPath : getLabelFromAnnotationPath
        };
    },
    /* bExport= */true);