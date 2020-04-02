/**
 * Any function that needs to be exported(used outside this file) via namespace should be defined as
 * a function and then added to the return statement at the end of this file
 */
sap.ui.define(["sap/ui/thirdparty/jquery", "sap/ui/core/format/NumberFormat", "sap/ui/core/format/DateFormat",
        "sap/ovp/cards/CommonUtils", "sap/ui/model/odata/AnnotationHelper", "sap/ui/model/FilterOperator", "sap/ui/Device",
    "sap/ui/model/analytics/odata4analytics", "sap/ui/generic/app/navigation/service/SelectionVariant", "sap/ovp/app/resources", "sap/base/strings/formatMessage", "sap/base/Log", "sap/base/util/isPlainObject", "sap/base/util/each"],
    function (jQuery, NumberFormat, DateFormat, CommonUtils, OdataAnnotationHelper,
        FilterOperator, Device, odata4analytics, SelectionVariant, OvpResources, formatMessage, Log, isPlainObject, each) {
        "use strict";

        var formatFunctions = {
            count: 0
        };
        var NumberFormatFunctions = {};
        var DateFormatFunctions = {};
        var CurrencyFormatFunctions = {};
        var criticalityConstants = {
            StateValues: {
                None: "None",
                Negative: "Error",
                Critical: "Warning",
                Positive: "Success"
            },
            ColorValues: {
                None: "Neutral",
                Negative: "Error",
                Critical: "Critical",
                Positive: "Good"
            }
        };

        var AnnotationType = {
            TEXT: "com.sap.vocabularies.Common.v1.Text",
            TEXT_ARRANGEMENT: "com.sap.vocabularies.UI.v1.TextArrangement"
        };

        var TextArrangementType = {
            TEXT_LAST: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast",
            TEXT_FIRST: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst",
            TEXT_ONLY: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly",
            TEXT_SEPARATE: "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"
        };

        //This object is responsive for devices
        //the id build by Type-ListType-flavor
        var ITEM_LENGTH = {
            "List_condensed": {
                phone: 5,
                tablet: 5,
                desktop: 5
            },
            "List_extended": {
                phone: 3,
                tablet: 3,
                desktop: 3
            },
            "List_condensed_bar": {
                phone: 5,
                tablet: 5,
                desktop: 5
            },
            "List_extended_bar": {
                phone: 3,
                tablet: 3,
                desktop: 3
            },
            "Table": {
                phone: 5,
                tablet: 5,
                desktop: 5
            },
            "Stack_simple": {
                phone: 20,
                tablet: 20,
                desktop: 20
            },
            "Stack_complex": {
                phone: 5,
                tablet: 5,
                desktop: 5
            }
        };

        // function formatterGeo(iContext, collection) {
        //     var longitude = collection.Longitude.Path;
        //     var latitude = collection.Latitude.Path;
        //     return "{path:'" + longitude + "'}; {path:'" + latitude + "'}" + ";0";
        // }

        // formatterGeo.requiresIContext = true;

        // function analyticRegions(iContext, collection) {
        //     return "{path:'" + collection.CountryCode.Path + "'}";
        // }

        // analyticRegions.requiresIContext = true;

        // function criticalityType(iContext, collection) {
        //     var criticality = collection.Criticality.Path;
        //     return "{path:'" + criticality + "', formatter: 'sap.ovp.cards.AnnotationHelper.getCriticalityStateFromValue' }";
        // }

        // criticalityType.requiresIContext = true;

        // // This method converts Vocabulary compliant values
        // // for EnumType CriticalityType into semantic values
        // // which are required by the sap.ui.vbm.Spot.
        // function getCriticalityStateFromValue(value) {
        //     var criticalityState;
        //     switch (value) {
        //         case "0":
        //             criticalityState = VbmLibrary.SemanticType.Default;
        //             break;
        //         case "1":
        //             criticalityState = VbmLibrary.SemanticType.Error;
        //             break;
        //         case "2":
        //             criticalityState = VbmLibrary.SemanticType.Warning;
        //             break;
        //         case "3":
        //             criticalityState = VbmLibrary.SemanticType.Success;
        //             break;
        //         default:
        //             criticalityState = VbmLibrary.SemanticType.None;
        //             break;
        //     }
        //     return criticalityState;
        // }

        function labelText(iContext, collection) {
            var oModel = iContext.getSetting('ovpCardProperties');
            var showText = oModel.getProperty('/showLabelText');

            if (showText === "true") {
                var option = collection.Address[0];
                if (typeof option.country !== "undefined") {
                    return "{path:'" + option.country.Path + "'}";
                } else if (typeof option.locality !== "undefined") {
                    return "{path:'" + option.locality.Path + "'}";
                } else if (typeof option.street !== "undefined") {
                    return "{path:'" + option.street.Path + "'}";
                } else if (typeof option.code !== "undefined") {
                    return "{path:'" + option.code.Path + "'}";
                }
            } else {
                return null;
            }
        }

        labelText.requiresIContext = true;

        /*This function takes a dataitem (can be Datafield or DatafieldForAnnotation) and returns the corresponding Label by
         * reading from that dataitem. If not present there, then pick sap:label from metadata for that particular
         * property from entity type*/
        function getLabelForDataItem(iContext, oDataItem) {
            if (!oDataItem) {
                return "";
            }
            if (oDataItem.Label) {
                return oDataItem.Label.String;
            }
            //If control reaches here, that means Label not defined at dataitem level
            //so check if there is any sap:label present at Entity property level
            //Property name should be present to extract sap:label

            var oModel = iContext.getSetting && iContext.getSetting('ovpCardProperties');
            //oModel is just a JSON model
            //oEntityType is the one associated with the card
            var oMetaModel = oModel && oModel.getProperty("/metaModel");
            var oEntityType = oModel && oModel.getProperty("/entityType");
            if (!oMetaModel || !oEntityType) {
                return "";
            }
            var sPropertyName;

            //For datafields, value is there
            if (oDataItem.Value) {
                sPropertyName = oDataItem.Value.Path;
            }
            //For DatafieldForAnnotation, target is there
            //Pick the property name by reading from target datapoint
            if (oDataItem.Target) {
                var sTargetPath = getTargetPathForDataFieldForAnnotation(oEntityType.$path, oDataItem);
                var oDataPoint = sTargetPath && oMetaModel.getProperty(sTargetPath);
                sPropertyName = oDataPoint && oDataPoint.Value.Path;
            }
            if (!sPropertyName || !sPropertyName.length > 0 || sPropertyName === " ") {
                return "";
            }

            var oProperty = oMetaModel.getODataProperty(oEntityType, sPropertyName);
            if (!oProperty) {
                return "";
            }
            //If sap:label found, return value from first condition
            //If first condition returns undefined or null, then  check if com.sap.vocabularies.Common.v1.Label found, if not, then
            //second condition returns "".String which is also undefined, then control flows to third condition
            //Finally return "" from third condition
            var sLabel = oProperty["sap:label"] || (oProperty["com.sap.vocabularies.Common.v1.Label"] || "").String || "";
            return sLabel;
        }

        getLabelForDataItem.requiresIContext = true;

        function getCacheEntry(iContext, sKey) {
            if (iContext.getSetting) {
                var oCache = iContext.getSetting("_ovpCache");
                // temp fix
                if (oCache) {
                    return oCache[sKey];
                }
            }
            return undefined;
        }

        function setCacheEntry(iContext, sKey, oValue) {
            if (iContext.getSetting) {
                var oCache = iContext.getSetting("_ovpCache");
                // temp fix
                if (oCache) {
                    oCache[sKey] = oValue;
                }
            }
        }

        function setFormatFunctionAndGetFunctionName(func, sNamePrefix) {
            if (!formatFunctions[sNamePrefix]) {
                formatFunctions[sNamePrefix] = 0;
            }
            formatFunctions[sNamePrefix]++;

            var sFuncName = sNamePrefix + formatFunctions[sNamePrefix];
            formatFunctions[sFuncName] = func;

            return "sap.ovp.cards.AnnotationHelper.formatFunctions." + sFuncName;
        }

        function criticality2state(criticality, oCriticalityConfigValues) {
            var sState;
            if (oCriticalityConfigValues) {
                sState = oCriticalityConfigValues.None;
                if (criticality && criticality.EnumMember) {
                    var val = criticality.EnumMember;
                    if (endsWith(val, 'Negative')) {
                        sState = oCriticalityConfigValues.Negative;
                    } else if (endsWith(val, 'Critical')) {
                        sState = oCriticalityConfigValues.Critical;
                    } else if (endsWith(val, 'Positive')) {
                        sState = oCriticalityConfigValues.Positive;
                    }
                }
            }
            return sState;
        }

        function criticalityState2Value(sState) {
            if (sState == "Error") {
                sState = 1;
            } else if (sState == "Warning") {
                sState = 2;
            } else if (sState == "Success") {
                sState = 3;
            } else {
                sState = 0;
            }
            return sState;
        }

        function endsWith(sString, sSuffix) {
            return sString && sString.indexOf(sSuffix, sString.length - sSuffix.length) !== -1;
        }

        function calculateCriticalityState(value, sImproveDirection, deviationLow, deviationHigh, toleranceLow, toleranceHigh,
                                           oCriticalityConfigValues) {

            var oCriticality = {};
            oCriticality.EnumMember = "None";

            //Consider fallback values for optional threshold values in criticality calculation
            //after considering fallback values if all the values required for calculation are not present then the criticality will be neutral

            /* example - in case of maximizing
            * if deviationLow is mentioned and toleranceLow not mentioned, then toleranceLow = deviationLow
            * if toleranceLow is mentioned and deviationLow not mentioned, then deviationLow = Number.NEGATIVE_INFINITY
            * if both values are not mentioned then there will not be any calculation and criticality will be neutral
            * */

            var nMinValue = Number.NEGATIVE_INFINITY;
            var nMaxValue = Number.POSITIVE_INFINITY;

            if ((!toleranceLow && toleranceLow !== 0) && (deviationLow || deviationLow === 0)) {
                toleranceLow = deviationLow;
            }
            if ((!toleranceHigh && toleranceHigh !== 0) && (deviationHigh || deviationHigh === 0)) {
                toleranceHigh = deviationHigh;
            }
            if (!deviationLow && deviationLow !== 0) {
                deviationLow = nMinValue;
            }
            if (!deviationHigh && deviationHigh !== 0) {
                deviationHigh = nMaxValue;
            }

            // number could be a zero number so check if it is not undefined
            if (value !== undefined) {
                value = Number(value);

                if (endsWith(sImproveDirection, "Minimize") || endsWith(sImproveDirection, "Minimizing")) {

                    if ((toleranceHigh || toleranceHigh === 0) && (deviationHigh || deviationHigh === 0)) {
                        if (value <= parseFloat(toleranceHigh)) {
                            oCriticality.EnumMember = "Positive";
                        } else if (value > parseFloat(deviationHigh)) {
                            oCriticality.EnumMember = "Negative";
                        } else {
                            oCriticality.EnumMember = "Critical";
                        }
                    }

                } else if (endsWith(sImproveDirection, "Maximize") || endsWith(sImproveDirection, "Maximizing")) {
                    if ((toleranceLow || toleranceLow === 0) && (deviationLow || deviationLow === 0)) {
                        if (value >= parseFloat(toleranceLow)) {
                            oCriticality.EnumMember = "Positive";
                        } else if (value < parseFloat(deviationLow)) {
                            oCriticality.EnumMember = "Negative";
                        } else {
                            oCriticality.EnumMember = "Critical";
                        }
                    }
                } else if (endsWith(sImproveDirection, "Target")) {
                    if ((toleranceHigh || toleranceHigh === 0) && (deviationHigh || deviationHigh === 0) && (toleranceLow || toleranceLow === 0) && (deviationLow || deviationLow === 0)) {
                        if (value >= parseFloat(toleranceLow) && value <= parseFloat(toleranceHigh)) {
                            oCriticality.EnumMember = "Positive";
                        } else if (value < parseFloat(deviationLow) || value > parseFloat(deviationHigh)) {
                            oCriticality.EnumMember = "Negative";
                        } else {
                            oCriticality.EnumMember = "Critical";
                        }
                    }
                }
            }
            return criticality2state(oCriticality, oCriticalityConfigValues);
        }

        /* Trend Direction for Header */
        function calculateTrendDirection(aggregateValue, referenceValue, downDifference, upDifference) {
            if (!aggregateValue || !referenceValue) {
                return;
            }

            aggregateValue = Number(aggregateValue);
            if (!upDifference && (aggregateValue - referenceValue >= 0)) {
                return "Up";
            }
            if (!downDifference && (aggregateValue - referenceValue <= 0)) {
                return "Down";
            }
            if (referenceValue && upDifference && (aggregateValue - referenceValue >= upDifference)) {
                return "Up";
            }
            if (referenceValue && downDifference && (aggregateValue - referenceValue <= downDifference)) {
                return "Down";
            }
        }

        /**
         * This function returns the dataField annotations in sorted order
         **/
        function getSortedDataFields(iContext, aCollection) {
            // we are sending index 0 to iContext.getPath(0) function
            // for composite binding - index 0 will be considered
            // for path - index 0 will be ignored
            var sCacheKey = iContext.getPath(0) + "-DataFields-Sorted";
            var aSortedFields = getCacheEntry(iContext, sCacheKey);
            if (!aSortedFields) {
                var aDataPoints = getSortedDataPoints(iContext, aCollection);
                var aDataPointsValues = aDataPoints.map(function (oDataPoint) {
                    return oDataPoint.Value.Path;
                });
                aDataPointsValues = aDataPointsValues.filter(function (element) {
                    return !!element;
                });
                aSortedFields = aCollection.filter(function (item) {
                    if (item.RecordType === "com.sap.vocabularies.UI.v1.DataField" && aDataPointsValues.indexOf(item.Value.Path) === -1) {
                        return true;
                    }
                    return false;
                });
                aSortedFields = sortCollectionByImportance(aSortedFields);
                setCacheEntry(iContext, sCacheKey, aSortedFields);
            }
            return aSortedFields;
        }

        getSortedDataFields.requiresIContext = true;

        function getSortedDataPoints(iContext, aCollection, sortForTableCard) {
            var sCacheKey = iContext.getPath(0) + "-DataPoints-Sorted";
            var aSortedFields = getCacheEntry(iContext, sCacheKey);
            if (!aSortedFields) {
                if (sortForTableCard) {
                    aSortedFields = aCollection.filter(isDataFieldForAnnotationWithDataPointOrContact);
                } else {
                    aSortedFields = aCollection.filter(isDataFieldForAnnotation);
                }
                aSortedFields = sortCollectionByImportance(aSortedFields);
                var sEntityTypePath;
                for (var i = 0; i < aSortedFields.length; i++) {
                    sEntityTypePath = iContext.getPath(0).substr(0, iContext.getPath(0).lastIndexOf("/") + 1);
                    aSortedFields[i] = iContext.getModel(0).getProperty(getTargetPathForDataFieldForAnnotation(sEntityTypePath, aSortedFields[i]));
                    sEntityTypePath = "";
                }
                setCacheEntry(iContext, sCacheKey, aSortedFields);
            }
            return aSortedFields;
        }

        getSortedDataPoints.requiresIContext = true;

        function isDataFieldForAnnotation(oItem) {
            if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
                oItem.Target.AnnotationPath.match(/@com.sap.vocabularies.UI.v1.DataPoint.*/)) {
                return true;
            }
            return false;
        }

        /**
         in case of table card check both data point and contact annotation property with data field property if they are same then remove the data field
         so only quick view with contact information shown and smartlink with  semantic object will be removed
         **/
        function isDataFieldForAnnotationWithDataPointOrContact(oItem) {
            if ((oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oItem.Target.AnnotationPath.match(/@com.sap.vocabularies.UI.v1.DataPoint.*/)) ||
                (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oItem.Target.AnnotationPath.match(/@com.sap.vocabularies.Communication.v1.Contact.*/))) {
                return true;
            }
            return false;
        }

        /**
         * This function returns formatted field for criticality path
         * @param oDataFieldForAnnotation
         * @returns {string}
         */
        function getCriticalityForDataPoint(oDataFieldForAnnotation) {
            if (!oDataFieldForAnnotation || !oDataFieldForAnnotation.Criticality || !oDataFieldForAnnotation.Criticality.Path) {
                return;
            }
            return "{path:'" + oDataFieldForAnnotation.Criticality.Path + "'}";
        }

        function getTargetPathForDataFieldForAnnotation(sEntityTypePath, oDataFieldForAnnotation) {
            if (sEntityTypePath && !endsWith(sEntityTypePath, '/')) {
                sEntityTypePath += '/';
            }
            return sEntityTypePath + oDataFieldForAnnotation.Target.AnnotationPath.slice(1);
        }

        function getImportance(oDataField) {
            var sImportance, iImportance;
            if (oDataField["com.sap.vocabularies.UI.v1.Importance"]) {
                sImportance = oDataField["com.sap.vocabularies.UI.v1.Importance"].EnumMember;
                switch (sImportance) {
                    case "com.sap.vocabularies.UI.v1.ImportanceType/High":
                        iImportance = 1;
                        break;
                    case "com.sap.vocabularies.UI.v1.ImportanceType/Medium":
                        iImportance = 2;
                        break;
                    case "com.sap.vocabularies.UI.v1.ImportanceType/Low":
                        iImportance = 3;
                        break;
                }
            } else {
                iImportance = 4;
            }
            return iImportance;
        }

        /**
         * Sorting the collection by importance. Using merge sort as the Javascript sort implementation behaves unexpectedly
         * for same elements - it is a known issue
         * @param aCollection
         * @returns [] - SortedArray
         */
        function sortCollectionByImportance(aCollection) {
            if (aCollection.length < 2) {
                return aCollection;
            }

            var middle = parseInt(aCollection.length / 2, 10);
            var left = aCollection.slice(0, middle);
            var right = aCollection.slice(middle, aCollection.length);

            return merge(sortCollectionByImportance(left), sortCollectionByImportance(right));
        }

        function merge(left, right) {
            var aSortedArray = [];
            while (left.length && right.length) {
                var aImportance = getImportance(left[0]),
                    bImportance = getImportance(right[0]);
                if (aImportance <= bImportance) {
                    aSortedArray.push(left.shift());
                } else {
                    aSortedArray.push(right.shift());
                }
            }
            while (left.length) {
                aSortedArray.push(left.shift());
            }
            while (right.length) {
                aSortedArray.push(right.shift());
            }

            return aSortedArray;
        }

        function formatDataField(iContext, aCollection, index) {
            var item = getSortedDataFields(iContext, aCollection)[index];
            if (item) {
                return formatField(iContext, item);
            }
            return "";
        }

        /*This function first picks a datafield from line item based on index and then
         * finds the label for that datafield*/
        function getDataFieldName(iContext, aCollection, index) {
            var oDataField = getSortedDataFields(iContext, aCollection)[index];
            return getLabelForDataItem(iContext, oDataField);
        }

        function getDataPointName(iContext, aCollection, index) {
            var item = getSortedDataPoints(iContext, aCollection)[index];

            if (item && item.Title) {
                return item.Title.String;
            }
            return "";
        }

        /*This function returns label for the datapoint mentioned by index*/
        function getLabelForDataPoint(iContext, aCollection, index) {
            var aSortedFields = aCollection.filter(isDataFieldForAnnotation);
            aSortedFields = sortCollectionByImportance(aSortedFields);
            if (!aSortedFields || !aSortedFields.length || !aSortedFields.length > 0) {
                return "";
            }
            return getLabelForDataItem(iContext, aSortedFields[0]);
        }

        function formatDataPoint(iContext, aCollection, index, dontIncludeUOM) {
            var item = getSortedDataPoints(iContext, aCollection)[index];
            if (!item) {
                return "";
            }

            var oModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");

            return _formatDataPoint(iContext, item, oEntityType, oMetaModel, dontIncludeUOM);
        }

        function criticalityConditionCheck(iContext, aCollection, index) {
            var item = getSortedDataPoints(iContext, aCollection)[index];
            if (item && item.Criticality) {
                return true;
            }
        }

        function getCriticality(iContext, aCollection, index) {
            var item = getSortedDataPoints(iContext, aCollection)[index];
            var criticalityStatus = item.Criticality.Path;
            return "{path:'" + criticalityStatus + "'}";
        }

        function _formatDataPoint(iContext, oItem, oEntityType, oMetaModel, dontIncludeUOM) {

            if (!oItem || !oItem.Value) {
                return "";
            }

            var oModel = iContext.getSetting('ovpCardProperties');
            var bIgnoreSapText = false;
            if (oModel) {
                var bExtractedIgnoreSapText = oModel.getProperty("/ignoreSapText");
                bIgnoreSapText = bExtractedIgnoreSapText == undefined ? bIgnoreSapText : bExtractedIgnoreSapText;
            }
            var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, oItem.Value.Path);

            //Support sap:aggregation-role=measure configuration
            var bMeasuresType = false;
            if (bIgnoreSapText == true) { //as part of supporting V4 annotation
                if (oEntityTypeProperty && (oEntityTypeProperty["com.sap.vocabularies.Analytics.v1.Measure"] || oEntityTypeProperty["sap:aggregation-role"] == "measure")) {
                    bMeasuresType = true;
                }
            }

            //Support sap:text attribute
            if (!bMeasuresType && oEntityTypeProperty) {
                var txtValue;
                if (oEntityTypeProperty["com.sap.vocabularies.Common.v1.Text"]) {  //as part of supporting V4 annotation
                    txtValue = oEntityTypeProperty["com.sap.vocabularies.Common.v1.Text"].String ? oEntityTypeProperty["com.sap.vocabularies.Common.v1.Text"].String : oEntityTypeProperty["com.sap.vocabularies.Common.v1.Text"].Path;
                } else if (oEntityTypeProperty["sap:text"]) {
                    txtValue = oEntityTypeProperty["sap:text"];
                }
                if (txtValue) {
                    oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, txtValue);
                    oItem = {
                        Value: {
                            Path: oEntityTypeProperty.name
                        }
                    };
                }
            }
            return formatField(iContext, oItem, dontIncludeUOM);
        }

        function formatField(iContext, item, bDontIncludeUOM, bIncludeOnlyUOM) {

            if (item.Value.Apply) {
                return OdataAnnotationHelper.format(iContext, item.Value);
            }

            var oModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");

            return _formatField(iContext, item, oEntityType, oMetaModel, bDontIncludeUOM, bIncludeOnlyUOM);
        }

        formatField.requiresIContext = true;

        /**
         * This function checks if the given property (oProperty)
         * has a text annotation associated with it, if yes it returns the appropriate binding
         * based on the textArrangement annotation, the default is TEXT_LAST
         * @param oEntityType  OPTIONAL
         * @param oProperty    MANDATORY
         * @param sIdBinding   MANDATORY
         * @returns String
         */
        function getTextArrangementBinding(iContext, oEntityType, oProperty, sIdBinding) {

            if ((!oProperty) || (typeof sIdBinding !== 'string')) {
                return sIdBinding;
            }
            //Get Text Arrangement annotation
            var oText = oProperty[AnnotationType.TEXT];
            //No Text found to be used in Text Arrangement
            if (!oText) {
                return sIdBinding;
            }
            var oTextArrangement, sTextArrangementType;
            //Text Arrangement annotation can be at property level, text level or entity level
            // 1. check TextArrangement definition for property - Priority 1 (max)
            oTextArrangement = oProperty[AnnotationType.TEXT_ARRANGEMENT];
            sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;

            // 2. check TextArrangement definition under property/text - Priority 2
            if (!sTextArrangementType) {
                oTextArrangement = oText && oText[AnnotationType.TEXT_ARRANGEMENT];
                sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;
            }
            // 3. check TextArrangement definition for entity type - Priority 3 (min)
            if (!sTextArrangementType) {
                oTextArrangement = oEntityType && oEntityType[AnnotationType.TEXT_ARRANGEMENT];
                sTextArrangementType = oTextArrangement && oTextArrangement.EnumMember;
            }
            //No Text Arrangement found
            if (!sTextArrangementType) {
                return sIdBinding;
            }
            var sDescriptionBinding = OdataAnnotationHelper.format(iContext, oText);
            //No Text Arrangement Binding found
            if (!sDescriptionBinding || sDescriptionBinding === " ") {
                return sIdBinding;
            }
            var sFinalBinding;
            switch (sTextArrangementType) {
                case TextArrangementType.TEXT_FIRST :
                    sFinalBinding = sDescriptionBinding + " (" + sIdBinding + ")";
                    break;
                case TextArrangementType.TEXT_LAST :
                    sFinalBinding = sIdBinding + " (" + sDescriptionBinding + ")";
                    break;
                case TextArrangementType.TEXT_ONLY :
                    sFinalBinding = sDescriptionBinding;
                    break;
                case TextArrangementType.TEXT_SEPARATE :
                    //Text Separate not supported, fallback to text last.
                    sFinalBinding = sIdBinding + " (" + sDescriptionBinding + ")";
                    break;
                default :
                    sFinalBinding = sIdBinding;
                    break;
            }
            return sFinalBinding;
        }

        function _formatField(iContext, oItem, oEntityType, oMetaModel, bDontIncludeUOM, bIncludeOnlyUOM, bUseSimplePath) {

            if (oItem.Value.Apply) {
                return OdataAnnotationHelper.format(iContext, oItem.Value);
            }

            var sProperty = oItem.Value.Path ? oItem.Value.Path : oItem.Value.String;
            var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, sProperty),
                result = "",
                functionName;
            var oCardProperties = iContext.getSetting("ovpCardProperties");
            var sContentFragment = oCardProperties && oCardProperties.getProperty("/contentFragment");

            if (!bIncludeOnlyUOM) {

                //Support association
                if (oItem.Value.Path && oItem.Value.Path.split("/").length > 1) {
                    oEntityTypeProperty = getNavigationSuffix(oMetaModel, oEntityType, oItem.Value.Path);
                }
                if (!oEntityTypeProperty) {
                    return "";
                }
                //Item has ValueFormat annotation
                if (oEntityTypeProperty["type"] === 'Edm.DateTime' || oEntityTypeProperty["type"] === 'Edm.DateTimeOffset') {
                    // Getting Parameter value from card properties
                    var showDateInRelativeFormat = oCardProperties && oCardProperties.getProperty("/showDateInRelativeFormat");
                    functionName = getDateFormatFunctionName("dateFormatFunction", showDateInRelativeFormat, oEntityTypeProperty["type"] === 'Edm.DateTime' ? true : false);
                    result = generatePathForField([oItem.Value.Path ? oItem.Value.Path : oEntityTypeProperty.name], functionName);
                } else if ((oItem.ValueFormat && oItem.ValueFormat.NumberOfFractionalDigits) || oEntityTypeProperty["scale"]) {

                    //By default no decimals would be shown
                    //If user specifies in Annotations then he can set 1 or 2 decimal places.
                    // If he provides a value beyond 2 then also it would be considered as 2.

                    var iScale = (oItem.ValueFormat && oItem.ValueFormat.NumberOfFractionalDigits) ? oItem.ValueFormat.NumberOfFractionalDigits.Int : 0, sUnitPath;
                    var iScaleFactor = (oItem.ValueFormat && oItem.ValueFormat.ScaleFactor && oItem.ValueFormat.ScaleFactor.Decimal);
                    if (oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"]) { //as part of supporting V4 annotation
                        sUnitPath = oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"].Path ? oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"].Path : oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"].String;
                    } else if (oEntityTypeProperty["Org.OData.Measures.V1.Unit"]) {
                        sUnitPath = oEntityTypeProperty["Org.OData.Measures.V1.Unit"].Path ? oEntityTypeProperty["Org.OData.Measures.V1.Unit"].Path : oEntityTypeProperty["Org.OData.Measures.V1.Unit"].String;
                    } else if (oEntityTypeProperty["sap:unit"]) {
                        sUnitPath = oEntityTypeProperty["sap:unit"];
                    }
                    var oUnitProperty = sUnitPath ? oMetaModel.getODataProperty(oEntityType, sUnitPath) : null,
                        aParts = [oItem.Value.Path ? oItem.Value.Path : oEntityTypeProperty.name];

                    //Default value for currency and number scale if scale is more than 2
                    if (iScale > 2) {
                        iScale = 2;
                    }
                    // check if currency is applicable and format the number based on currency or number
                    if (oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"]) {
                        var oCurrency = oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"];
                        if (oCurrency.Path) {
                            functionName = getCurrencyFormatFunctionName(iScale,iScaleFactor);
                            aParts.push(oCurrency.Path);
                        } else if (oCurrency.String) {
                            functionName = getCurrencyFormatFunctionName(iScale, oCurrency.String,iScaleFactor);
                        }  //as part of supporting V4 annotation
                    } else if (oUnitProperty && (oUnitProperty["Org.OData.Measures.V1.ISOCurrency"] || oUnitProperty["sap:semantics"] === "currency-code")) {
                        functionName = getCurrencyFormatFunctionName(iScale,iScaleFactor);
                        aParts.push(sUnitPath);
                    } else {
                        //If there is no value format annotation, we will use the metadata scale property
                        functionName = getNumberFormatFunctionName(iScale,iScaleFactor);
                    }
                    result = generatePathForField(aParts, functionName);

                } else {
                    if (bUseSimplePath) {
                        result = OdataAnnotationHelper.simplePath(iContext, oItem.Value);
                    } else {
                        var sFormattedResult = OdataAnnotationHelper.format(iContext.getModel() ? iContext : iContext.getInterface(0), oItem.Value);
                        var aResult = sFormattedResult.split(",");
                        var aForamttedFields = [];
                        if (aResult.length > 1) {
                            for (var i = 0; i < aResult.length; i++) {
                                if (aResult[i].indexOf("path:") >= 0 || aResult[i].indexOf("type:") >= 0) {
                                    aForamttedFields.push(aResult[i]);
                                }
                            }
                            if (aForamttedFields.length > 0) {
                                result = result + aForamttedFields.join(',');
                                if (result.substring(result.length - 1) !== "}") {
                                    result = result + "}";
                                }
                            }
                        } else {
                            result = sFormattedResult;
                        }
                    }
                }

                //Get text arrangement (if present) binding for the property
                if (sContentFragment) {
                    result = getTextArrangementBinding(iContext, oEntityType, oEntityTypeProperty, result);
                }

                //Add unit using path or string
                if (oEntityTypeProperty["Org.OData.Measures.V1.Unit"]) {
                    var oUnit = oEntityTypeProperty["Org.OData.Measures.V1.Unit"];
                    if (oUnit.Path) {
                        result += (" " + generatePathForField([oUnit.Path]));
                    } else if (oUnit.String) {
                        //If the unit string is percentage, then no space required
                        //Note that if % comes from path, then space will be there
                        if (oUnit.String !== "%") {
                            result += " ";
                        }
                        result += oUnit.String;
                    }
                }
            }

            if (!bDontIncludeUOM) {
                //Add currency using path or string
                if (oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"]) {
                    var oCurrency = oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"];
                    if (oCurrency.Path) {
                        result += (" " + generatePathForField([oCurrency.Path]));
                    } else if (oCurrency.String) {
                        result += (" " + oCurrency.String);
                    }
                }

            }

            if (result[0] === " ") {
                result = result.substring(1);
            }
            return result;
        }

        /**
         * Note:if passing parts, then formatter is mandatory
         * @param aParts
         * @param sFormatterName
         * @returns {string}
         */
        function generatePathForField(aParts, sFormatterName) {
            var sPath = "", iLength = aParts.length;
            if (iLength > 1) {
                sPath = "{parts:[";
                for (var i = 0; i < iLength; i++) {
                    sPath += ("{path: '" + aParts[i] + "'}" + ((i === iLength - 1) ? "]" : ", "));
                }
            } else {
                sPath = "{path: '" + aParts[0] + "'";
            }
            sPath += (sFormatterName ? (", formatter: '" + sFormatterName + "'") : "") + "}";
            return sPath;
        }

        function getNumberFormatFunctionName(numberOfFractionalDigits,iScaleFactor) {
            var functionName = "formatNumberCalculation" + numberOfFractionalDigits;
            if (!NumberFormatFunctions[functionName]) {
                NumberFormatFunctions[functionName] = generateNumberFormatFunc(Number(numberOfFractionalDigits),iScaleFactor);
            }
            return "sap.ovp.cards.AnnotationHelper.NumberFormatFunctions." + functionName;
        }

        function generateNumberFormatFunc(numOfFragmentDigit,iScaleFactor) {
            return function (value) {
                var formatNumber = NumberFormat.getFloatInstance({
                    style: 'short',
                    showMeasure: false,
                    shortRefNumber: iScaleFactor,
                    minFractionDigits: numOfFragmentDigit,
                    maxFractionDigits: numOfFragmentDigit
                });
                return formatNumber.format(Number(value));
            };
        }

        /**
         * Returns the date formatter function name
         * @param functionName
         * @param functionName
         * @param showDateInRelativeFormat
         * @returns {string}
         */
        function getDateFormatFunctionName(functionName, showDateInRelativeFormat,bUTC) {
            // generate date formatter function is not available
            // By default or if showDateInRelativeFormat is true relative Date Format is selected
            var dateFormat = {
                'relative': true,
                'relativeScale': 'auto'
            };
            // Otherwise if showDateInRelativeFormat is false then medium Date format is used
            if (showDateInRelativeFormat !== undefined && !showDateInRelativeFormat) {
                dateFormat = {
                    'style': 'medium'
                };
            }
            if (!DateFormatFunctions[functionName]) {
                DateFormatFunctions[functionName] = function (value) {
                    var oDateFormatter = DateFormat.getInstance(dateFormat);
                    if (!value) {
                        value = "";
                        return value;
                    }
                    // bUTC should be true to show time stamp in UTC
                    return oDateFormatter.format(new Date(value),bUTC);
                };
            }
            return "sap.ovp.cards.AnnotationHelper.DateFormatFunctions." + functionName;
        }

        /**
         * Returns the currency formatter function based on the scale and currency
         * @param iNumberOfFractionalDigits
         * @param sCurrency - optional parameter
         * @returns {string}
         */
        function getCurrencyFormatFunctionName(iNumberOfFractionalDigits, sCurrency,iScaleFactor) {
            var functionName = "formatCurrencyCalculation" + (sCurrency ? sCurrency + iNumberOfFractionalDigits : iNumberOfFractionalDigits);
            if (!CurrencyFormatFunctions[functionName]) {
                CurrencyFormatFunctions[functionName] = generateCurrencyFormatFunc(iNumberOfFractionalDigits, sCurrency,iScaleFactor);
            }
            return "sap.ovp.cards.AnnotationHelper.CurrencyFormatFunctions." + functionName;
        }

        /**
         * Generates the currency formatter function based on the currency and scale
         * @param iNumOfFragmentDigit
         * @param sCurrency
         * @returns {Function}
         */
        function generateCurrencyFormatFunc(iNumOfFragmentDigit, sCurrency,iScaleFactor) {
            return function (value, currency) {
                var sFormattedValue = "";
                var oCurrencyFormatter = NumberFormat.getCurrencyInstance({
                    style: 'short',
                    showMeasure: false,
                    shortRefNumber: iScaleFactor,
                    minFractionDigits: iNumOfFragmentDigit,
                    maxFractionDigits: iNumOfFragmentDigit
                });
                if (currency) {
                    sFormattedValue = oCurrencyFormatter.format(value, currency);
                } else {
                    sFormattedValue = sCurrency ? oCurrencyFormatter.format(value, sCurrency) : oCurrencyFormatter.format(value);
                }
                return sFormattedValue;
            };
        }

        function getNavigationSuffix(oMetaModel, oEntityType, sProperty) {
            var aParts = sProperty.split("/");

            if (aParts.length > 1) {
                for (var i = 0; i < (aParts.length - 1); i++) {
                    var oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, aParts[i]);
                    if (oAssociationEnd) {
                        oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type);
                    }
                }

                return oMetaModel.getODataProperty(oEntityType, aParts[aParts.length - 1]);
            }
        }

        function formatDataPointState(iContext, aCollection, index) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection);
            var oCriticalityConfigValues = criticalityConstants.StateValues;
            var oItem = aDataPoints[index];

            // return "None" if the item is not available in the sorted data points list
            if (!oItem) {
                return oCriticalityConfigValues.None;
            }

            // Format data points to criticality expression if criticality is available in the item, else format to value
            if (oItem.Criticality) {
                return buildExpressionForProgressIndicatorCriticality(iContext, oItem, oCriticalityConfigValues);
            }
            return formatDataPointToValue(iContext, oItem, oCriticalityConfigValues);
        }

        function hasCriticalityAnnotation(iContext, aCollection, index) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection);
            // aDataPoints is not Undefined and aDataPoints.length is not 0
            if (aDataPoints && aDataPoints.length) {
                var item = aDataPoints[0];
                if (item && (item.Criticality || item.CriticalityCalculation)) {
                    return true;
                }
            }
            return false;
        }

        function colorPaletteForComparisonMicroChart(iContext, aCollection, index) {
            if (hasCriticalityAnnotation(iContext, aCollection, index)) {
                return '';
            }
            //sapUiChartPaletteQualitativeHue1
            return '#5cbae6';
        }

        colorPaletteForComparisonMicroChart.requiresIContext = true;

        function formatDataPointColor(iContext, aCollection, index) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection),
                oCriticalityConfigValues = criticalityConstants.ColorValues;
            var sState = oCriticalityConfigValues.None;
            if (aDataPoints.length > index) {
                var item = aDataPoints[index];
                if (item && item.Criticality) {
                    sState = buildExpressionForProgressIndicatorCriticality(iContext, item, oCriticalityConfigValues);
                } else {
                    sState = formatDataPointToValue(iContext, item, oCriticalityConfigValues);
                }

            }
            return sState;
        }

        function buildExpressionForProgressIndicatorCriticality(oInterface, dataPoint, oCriticalityConfigValues) {
            var sFormatCriticalityExpression = oCriticalityConfigValues.None;
            var sExpressionTemplate;
            var oCriticalityProperty = dataPoint.Criticality;

            if (oCriticalityProperty) {
                sExpressionTemplate = "'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''"
                + oCriticalityConfigValues.Negative
                + "'' : "
                + "({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Critical'') || ({0} === ''2'') || ({0} === 2) ? ''"
                + oCriticalityConfigValues.Critical
                + "'' : "
                + "({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''"
                + oCriticalityConfigValues.Positive
                + "'' : "
                + "''"
                + oCriticalityConfigValues.None + "'' '}'";
                if (oCriticalityProperty.Path) {
                    var sCriticalitySimplePath = '$'
                        + OdataAnnotationHelper.simplePath(
                            oInterface, oCriticalityProperty);
                    sFormatCriticalityExpression = formatMessage(
                        sExpressionTemplate, sCriticalitySimplePath);
                } else if (oCriticalityProperty.EnumMember) {
                    var sCriticality = "'" + oCriticalityProperty.EnumMember + "'";
                    sFormatCriticalityExpression = formatMessage(
                        sExpressionTemplate, sCriticality);
                } else {
                    Log.warning("Case not supported, returning the default Neutral state");
                }
            } else {
                // Any other cases are not valid, the default value of 'None' will be returned
                Log.warning("Case not supported, returning the default Neutral state");
            }
            return sFormatCriticalityExpression;
        }

        function formatDataPointStateForSmartField(iContext, aCollection, index) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection);
            var sState = "None";
            if (aDataPoints.length > index) {
                var item = aDataPoints[index];
                if (item && item.Criticality && item.Criticality.Path) {
                    sState = getCriticality(iContext, aCollection, index);
                } else {
                    sState = formatDataPointToValue(iContext, item, criticalityConstants.StateValues);
                    sState = criticalityState2Value(sState);
                }
            }
            return sState;
        }


        function formatDataPointToValue(iContext, oDataPoint, oCriticalityConfigValues) {
            var sState = oCriticalityConfigValues.None;
            if (oDataPoint.Criticality) {
                sState = criticality2state(oDataPoint.Criticality, oCriticalityConfigValues);
            } else if (oDataPoint.CriticalityCalculation && oDataPoint.Value && oDataPoint.Value && oDataPoint.Value.Path) {
                sState = formThePathForCriticalityStateCalculation(iContext, oDataPoint, oCriticalityConfigValues);
            }

            return sState;
        }

        function formThePathForCriticalityStateCalculation(iContext, oDataPoint, oCriticalityConfigValues) {

            var value = getPathOrPrimitiveValue(oDataPoint.Value);
            var sImprovementDirection = oDataPoint.CriticalityCalculation.ImprovementDirection.EnumMember;

            var deviationLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeLowValue);
            var deviationHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.DeviationRangeHighValue);
            var toleranceLow = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeLowValue);
            var toleranceHigh = getPathOrPrimitiveValue(oDataPoint.CriticalityCalculation.ToleranceRangeHighValue);

            var bIsDeviationLowBinding = isBindingValue(deviationLow);
            var bIsDeviationHighBinding = isBindingValue(deviationHigh);
            var bIsToleranceLowBinding = isBindingValue(toleranceLow);
            var bIsToleranceHighBinding = isBindingValue(toleranceHigh);

            var sParts = "parts: [" + value;
            sParts += bIsDeviationLowBinding ? "," + deviationLow : "";
            sParts += bIsDeviationHighBinding ? "," + deviationHigh : "";
            sParts += bIsToleranceLowBinding ? "," + toleranceLow : "";
            sParts += bIsToleranceHighBinding ? "," + toleranceHigh : "";
            sParts += "]";

            var formatFunc = function () {
                var index = 1;
                return calculateCriticalityState(
                    arguments[0],
                    sImprovementDirection,
                    bIsDeviationLowBinding ? arguments[index++] : deviationLow,
                    bIsDeviationHighBinding ? arguments[index++] : deviationHigh,
                    bIsToleranceLowBinding ? arguments[index++] : toleranceLow,
                    bIsToleranceHighBinding ? arguments[index++] : toleranceHigh,
                    oCriticalityConfigValues
                );
            };

            var sFormatFuncName = setFormatFunctionAndGetFunctionName(formatFunc, "formatCriticalityCalculation");
            return "{" + sParts + ", formatter: '" + sFormatFuncName + "'}";
        }

        function isBindingValue(value) {
            return (typeof value === "string") && value.charAt(0) === "{";
        }

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

        function checkFilterPreference(oModel) {
            var mFilterPreference;
            if (oModel && typeof oModel.getData === 'function') {
                var oSettings = oModel.getData();
                if (oSettings.tabs) {
                    var iIndex = 0;
                    var iSelectedKey = oSettings.selectedKey;
                    if (iSelectedKey && oSettings.tabs.length >= iSelectedKey) {
                        iIndex = iSelectedKey - 1;
                    }
                    mFilterPreference = oSettings.tabs[iIndex].mFilterPreference;
                } else {
                    mFilterPreference = oSettings.mFilterPreference;
                }
            }
            return !!mFilterPreference;
        }

        /*
         * This formatter method parses the List-Card List's items aggregation path in the Model.
         * The returned path may contain also sorter definition (for the List) sorting is defined
         * appropriately via respected Annotations.
         *
         * @param iContext
         * @param itemsPath
         * @returns List-Card List's items aggregation path in the Model
         */
        function formatItems(iContext, oEntitySet) {
            var oModel = iContext.getSetting('ovpCardProperties');

            var bAddODataSelect = oModel.getProperty("/addODataSelect");
            var oMetaModel = oModel.getProperty("/metaModel");
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            var oSelectionVariant = oEntityType[oModel.getProperty('/selectionAnnotationPath')];
            var oPresentationVariant = oEntityType[oModel.getProperty('/presentationAnnotationPath')];
            var sEntitySetPath = "/" + oEntitySet.name;
            var aAnnotationsPath = Array.prototype.slice.call(arguments, 2);

            var ovpCardProperties = iContext.getSetting('ovpCardProperties'),
                aParameters = ovpCardProperties.getProperty('/parameters');

            //check if entity set needs parameters
            // if selection-annotations path is supplied - we need to resolve it in order to resolve the full entity-set path
            if (oSelectionVariant || !!aParameters) {
                if ((oSelectionVariant && oSelectionVariant.Parameters && oSelectionVariant.Parameters.length > 0) || !!aParameters) {
                    // in case we have UI.SelectionVariant annotation defined on the entityType including Parameters - we need to resolve the entity-set path to include it
                    sEntitySetPath = resolveParameterizedEntitySet(iContext.getSetting('dataModel'), oEntitySet,
                        oSelectionVariant, aParameters);
                }
            }

            if (oModel.getProperty("/cardLayout") && oModel.getProperty("/cardLayout/noOfItems")) {
                var result = "{path: '" + sEntitySetPath + "', length: " + +(oModel.getProperty("/cardLayout/noOfItems"));
            } else {
                var result = "{path: '" + sEntitySetPath + "', length: " + getItemsLength(oModel);
            }

            //prepare the select fields in case flag is on
            var aSelectFields = [];
            if (bAddODataSelect) {
                aSelectFields = getSelectFields(iContext, oMetaModel, oEntityType, aAnnotationsPath);
                var cardTemplate = oModel.getProperty("/template");
                if (cardTemplate != "sap.ovp.cards.charts.analytical" && cardTemplate != "sap.ovp.cards.charts.smart.chart") {
                    var aRequestFields = getRequestAtLeastFields(oPresentationVariant);
                    for (var i = 0; i < aRequestFields.length; i++) {
                        if (!aSelectFields.includes(aRequestFields[i])) {
                            aSelectFields.push(aRequestFields[i]);
                        }
                    }
                }
            }
            //prepare the expand list if navigation properties are used
            var aExpand = getExpandList(oMetaModel, oEntityType, aAnnotationsPath);

            var bCheckFilterPreference = checkFilterPreference(oModel);
            if (bCheckFilterPreference || aSelectFields.length > 0 || aExpand.length > 0) {
                result = result + ", parameters: {";
            }

            //add select and expand parameters to the binding info string if needed
            if (aSelectFields.length > 0 || aExpand.length > 0) {
                if (aSelectFields.length > 0) {
                    result = result + "select: '" + aSelectFields.join(',') + "'";
                }

                if (aExpand.length > 0) {
                    if (aSelectFields.length > 0) {
                        result = result + ", ";
                    }
                    result = result + "expand: '" + aExpand.join(',') + "'";
                }
                if (bCheckFilterPreference) {
                    result = result + ", ";
                }
            }

            // add card id as custom parameter
            if (bCheckFilterPreference) {
                result = result + "custom: {cardId: '" + oModel.getProperty("/cardId") + "'}";
            }

            if (bCheckFilterPreference || aSelectFields.length > 0 || aExpand.length > 0) {
                result = result + "}";
            }

            //apply sorters information
            var aSorters = getSorters(oModel, oPresentationVariant);
            if (aSorters.length > 0) {
                result = result + ", sorter:" + JSON.stringify(aSorters);
            }

            //apply filters information
            var aFilters = getFilters(oModel, oSelectionVariant);
            if (aFilters.length > 0) {
                result = result + ", filters:" + JSON.stringify(aFilters);
            }
            result = result + "}";

            // returning the parsed path for the Card's items-aggregation binding
            return result;
        }

        formatItems.requiresIContext = true;

        /**
         * returns an array of navigation properties prefixes to be used in an odata $expand parameter
         *
         * @param oMetaModel - metamodel to get the annotations to query
         * @param oEntityType - the relevant entityType
         * @param aAnnotationsPath - an array of annotation path to check
         * @returns {Array} of navigation properties prefixes to be used in an odata $expand parameter
         */
        function getExpandList(oMetaModel, oEntityType, aAnnotationsPath) {
            var aExpand = [];
            var sAnnotationPath, oBindingContext, aColl, sExpand;

            //loop over the annotation paths
            for (var i = 0; i < aAnnotationsPath.length; i++) {
                if (!aAnnotationsPath[i]) {
                    continue;
                }
                sAnnotationPath = oEntityType.$path + "/" + aAnnotationsPath[i];
                oBindingContext = oMetaModel.createBindingContext(sAnnotationPath);
                aColl = oBindingContext.getObject();
                //if the annotationPath does not exists there is no BindingContext
                aColl = aColl ? aColl : [];
                for (var j = 0; j < aColl.length; j++) {
                    if (aColl[j].Value && aColl[j].Value.Path) {
                        sExpand = getNavigationPrefix(oMetaModel, oEntityType, aColl[j].Value.Path);
                        if (sExpand && aExpand.indexOf(sExpand) === -1) {
                            aExpand.push(sExpand);
                        }
                    }
                }
            }
            return aExpand;
        }

        /**
         * returns an array of properties paths to be used in an odata $select parameter
         *
         * @param oMetaModel - metamodel to get the annotations to query
         * @param oEntityType - the relevant entityType
         * @param aAnnotationsPath - an array of annotation path to check
         * @returns {Array} of properties paths to be used in an odata $select parameter
         */
        function getSelectFields(iContext, oMetaModel, oEntityType, aAnnotationsPath) {

            var aSelectFields = [];
            var sAnnotationPath, oBindingContext, aColl;

            //loop over the annotation paths
            for (var i = 0; i < aAnnotationsPath.length; i++) {
                if (!aAnnotationsPath[i]) {
                    continue;
                }

                sAnnotationPath = oEntityType.$path + "/" + aAnnotationsPath[i];
                oBindingContext = oMetaModel.createBindingContext(sAnnotationPath);

                var oContext = {};

                // This is currently true for stack cards, we have sent a dummy iContext which we need to enrich in order to format fields correctly
                if (iContext && iContext.bDummyContext) {
                    jQuery.extend(oContext, iContext, oBindingContext, true);
                } else {
                    oContext = iContext;
                }

                aColl = oBindingContext.getObject();

                //if the annotationPath does not exists there is no BindingContext
                if (!aColl) {
                    aColl = [];
                } else if (isPlainObject(aColl)) {
                    // For the case of FieldGroups
                    if (aColl.Data) {
                        aColl = aColl.Data;
                    } else {
                        aColl = [];
                    }
                }

                var oItem;
                var aItemValue;
                var sFormattedField;
                var sRecordType;
                for (var j = 0; j < aColl.length; j++) {

                    aItemValue = [];
                    oItem = aColl[j];
                    sFormattedField = "";

                    sRecordType = oItem.RecordType;

                    if (sRecordType === "com.sap.vocabularies.UI.v1.DataField") {
                        // in case of a DataField we format the field to get biding string ; we use simple paths as we simply need select column names
                        sFormattedField = _formatField(oContext, oItem, oEntityType, oMetaModel, undefined, undefined, true);

                    } else if (sRecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {

                        // in case of DataFieldForAnnotation we resolve the DataPoint target path of the DataField and format the field to get biding string
                        var sTargetPath = getTargetPathForDataFieldForAnnotation(oEntityType.$path, oItem);
                        sFormattedField = _formatDataPoint(oContext, oMetaModel.getProperty(sTargetPath), oEntityType, oMetaModel);

                        var sCriticality = getCriticalityForDataPoint(oMetaModel.getProperty(sTargetPath));
                        if (sCriticality && sCriticality.length > 0) {
                            sFormattedField += sCriticality;
                        }

                    } else if (sRecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" && oItem.Url) {

                        // format the URL ONLY IN CASE NO UrlRef member resides under it
                        var sFormattedUrl;
                        if (!oItem.Url.UrlRef) {
                            sFormattedUrl = OdataAnnotationHelper.format(oContext, oItem.Url);
                        }

                        // meaning binding which needs to be evaluated at runtime
                        if (sFormattedUrl && sFormattedUrl.substring(0, 2) === "{=") {
                            sFormattedField = sFormattedUrl;
                        }
                    }

                    // if we have found a relevant binding-info-string this iteration then parse it to get binded properties
                    if (sFormattedField) {

                        var result = OdataAnnotationHelper.simplePath(oContext, oItem.Value);
                        //To handle select parameter for text only
                        if (sFormattedField.indexOf("(") < 0 && sFormattedField !== result) {
                            sFormattedField = [].concat(result , sFormattedField ).join(" ");
                        }
                        aItemValue = getPropertiesFromBindingString(sFormattedField);
                    }

                    if (aItemValue && aItemValue.length > 0) {
                        // for each property found we check if has sap:unit and sap:text
                        var sItemValue;
                        for (var k = 0; k < aItemValue.length; k++) {
                            sItemValue = aItemValue[k];

                            // if this property is found for the first time - look for its unit and text properties as well
                            if (!aSelectFields[sItemValue]) {

                                aSelectFields[sItemValue] = true;

                                // checking if we need to add also the sap:unit property of the field's value
                                var sUnitPropName = CommonUtils.getUnitColumn(sItemValue, oEntityType);
                                if (sUnitPropName && sUnitPropName !== sItemValue) {
                                    aSelectFields[sUnitPropName] = true;
                                }

                                // checking if we need to add also the sap:text property of the field's value
                                var sTextPropName = getTextPropertyForEntityProperty(oMetaModel, oEntityType, sItemValue);
                                if (sTextPropName && sTextPropName !== sItemValue) {
                                    aSelectFields[sTextPropName] = true;
                                }
                            }
                        }
                    }
                }
            }
            // return all relevant property names
            return Object.keys(aSelectFields);
        }

        function getPropertiesFromBindingString(sBinding) {

            //Remove direct values and keep only the bindings in sBinding
            //"{NetAmount} kg" would be converted to "{NetAmount}"
            //"{NetAmount} kg {Country}" would be converted to "{NetAmount}{Country}"
            //"{path: Customer, formatter: something.something}" will remain as is
            var i, iMatchCount = 0, len = sBinding.length, sBindingPathOnly = "", sCharAt;
            for (i = 0; i < len; i++) {
                sCharAt = sBinding.charAt(i);
                if (!sCharAt) {
                    return;
                }
                switch (sCharAt) {
                    case "{" :
                        iMatchCount++; //Add opening brace to stack
                        break; //from switch (not loop)
                    case "}" :
                        iMatchCount--; //Match and remove one opening brace from stack
                        break; //from switch (not loop)
                    default:
                        //No opening braces in stack, that means current character is outside braces
                        //and should be ignored
                        if (iMatchCount <= 0) {
                            continue; //to next loop ignoring next statements
                        }
                        break; //from switch (not loop)
                }
                sBindingPathOnly += sCharAt;
            }
            sBinding = sBindingPathOnly;
            /**
             * BCP: 1680241227
             * Regex expressions were not handling properties that included the '_' character.
             * With '\_' as part of [a-zA-Z0-9], they should be able to handle.
             */
            var regexBindingEvaluation = /\${([a-zA-Z0-9\_|\/]*)/g;
            var regexBindingNoPath = /[^[{]*[a-zA-Z0-9\_]/g;
            var regexBindingPath = /path *\: *\'([a-zA-Z0-9\_]+)*\'/g;

            var regex, index, matches = [];

            //in case the path consists of parts - replace it with empty string so that
            //'parts' does not appear as a property
            if (sBinding.indexOf("{parts:[") !== -1) {
                sBinding = sBinding.replace("{parts:[", "");
            }

            if (sBinding.substring(0, 2) === "{=") {
                /*
                 meaning binding string looks like "{= <rest of the binding string>}"
                 which is a binding which needs to be evaluated using some supported function
                 properties appear as ${propertyName} inside the string
                 */
                regex = regexBindingEvaluation;

                /* index is 1 as each match found by this regular expression (by invoking regex.exec(string) below) */
                /* is an array of 2 items, for example ["${Address}", "Address"] so we need the 2nd result each match found */
                index = 1;

            } else if (sBinding.indexOf("path") !== -1) {

                /* In a scenario where binding contains string like "{propertyName} {path:'propertyName'}" */
                /* Here we get the properties without path and add it to array matches*/
                var matchWithNoPath = regexBindingNoPath.exec(sBinding);
                while (matchWithNoPath) {
                    //i18n is also enclosed in braces, but that is not a property, so ignore them
                    if (matchWithNoPath[0].indexOf("path") === -1 && matchWithNoPath[0].indexOf("@i18n") !== 0) {
                        matches.push(matchWithNoPath[0]);
                    }
                    matchWithNoPath = regexBindingNoPath.exec(sBinding);
                }

                /* meaning binding contains string like "{path:'propertyName'}" */
                regex = regexBindingPath;

                /* index is 1 as each match found by this regular expression (by invoking regex.exec(string) below) */
                /* is an array of 2 items, for example ["{path: 'Address'}", "Address"] so we need the 2nd result each match found */
                index = 1;

            } else {
                /* meaning binding contains string like "{'propertyName'}" */
                regex = regexBindingNoPath;

                /* index is 0 as each match found by this regular expression (by invoking regex.exec(string) below) */
                /* is an array of one item, for example ["Address"] so we need the 1st result each match found */
                index = 0;
            }

            var match = regex.exec(sBinding);
            while (match) {
                //i18n is also enclosed in braces, but that is not a property, so ignore them
                if (match[index] && match[index].indexOf("@i18n") !== 0) {
                    matches.push(match[index]);
                }
                match = regex.exec(sBinding);
            }
            return matches;
        }

        /**
         * return the sorters that need to be applyed on an aggregation
         *
         * @param ovpCardProperties - card properties model which might contains sort configurations
         * @param oPresentationVariant - optional presentation variant annotation with SortOrder configuration
         * @returns {Array} of model sorters
         */
        function getSorters(ovpCardProperties, oPresentationVariant) {
            var aSorters = [];
            var oSorter, bDescending;

            //get the configured sorter if exist and append them to the sorters array
            var sPropertyPath = ovpCardProperties.getProperty("/sortBy");
            if (sPropertyPath) {
                // If sorting is enabled by card configuration
                var sSortOrder = ovpCardProperties.getProperty('/sortOrder');
                if (sSortOrder && sSortOrder.toLowerCase() !== 'descending') {
                    bDescending = false;
                } else {
                    bDescending = true;
                }
                oSorter = {
                    path: sPropertyPath,
                    descending: bDescending
                };
                aSorters.push(oSorter);
            }

            //get the sorters from the presentation variant annotations if exists
            var aSortOrder = oPresentationVariant && oPresentationVariant.SortOrder || undefined;
            var oSortOrder, sPropertyPath;
            if (aSortOrder) {
                for (var i = 0; i < aSortOrder.length; i++) {
                    oSortOrder = aSortOrder[i];
                    sPropertyPath = oSortOrder.Property.PropertyPath;
                    bDescending = getBooleanValue(oSortOrder.Descending, true);
                    oSorter = {
                        path: sPropertyPath,
                        descending: bDescending
                    };
                    aSorters.push(oSorter);
                }
            }

            return aSorters;
        }

        function getRequestAtLeastFields(oPresentationVariant) {
            var aRequest = [];
            var aRequestFields = oPresentationVariant && oPresentationVariant.RequestAtLeast || undefined;
            if (aRequestFields) {
                for (var i = 0; i < aRequestFields.length; i++) {
                    if (aRequestFields[i].PropertyPath) {
                        aRequest.push(aRequestFields[i].PropertyPath);
                    }

                }
            }
            return aRequest;
        }

        function getCardSelections(ovpCardProperties) {
            var oEntityType = ovpCardProperties.getProperty('/entityType');
            var oSelectionVariant = oEntityType[ovpCardProperties.getProperty('/selectionAnnotationPath')];
            return {
                filters: getFilters(ovpCardProperties, oSelectionVariant),
                parameters: getParameters(oSelectionVariant)
            };
        }

        /**
         * This function is called during navigation to get the card sorters in a format
         * accepted by presentation variant
         * @param ovpCardProperties
         * @returns Object of type {SortOrder: Array}
         */
        function getCardSorters(ovpCardProperties) {
            if (!ovpCardProperties) {
                return;
            }
            var oEntityType = ovpCardProperties.getProperty('/entityType');
            var oPresentationVariant = oEntityType[ovpCardProperties.getProperty('/presentationAnnotationPath')];
            var aSorters = getSorters(ovpCardProperties, oPresentationVariant);

            //Convert aSorters to a format accepted by presentation variant during navigation
            //"SortOrder":[{"Property":"FiscalPeriod","Descending":false}],
            var aCardSorters = [];
            var i, iLength = aSorters.length;
            for (i = 0; i < iLength; i++) {
                if (!aSorters[i].path) {
                    continue;
                }
                aCardSorters.push({
                    Property: aSorters[i].path,
                    Descending: aSorters[i].descending
                });
            }
            if (aCardSorters.length > 0) {
                return {
                    SortOrder: aCardSorters
                };
            }
        }

        /**
         * return the card level parameters defined in selection annotation
         *
         * @param oSelectionVariant - optional selection variant annotation with SelectOptions configuration
         * @returns {Array} of parameters
         */
        function getParameters(oSelectionVariant) {

            var oParameter, aParameters = [];

            //If selection variant or parameters do not exist in annotations
            if (!oSelectionVariant || !oSelectionVariant.Parameters) {
                return aParameters;
            }

            var iLength = oSelectionVariant.Parameters.length;
            for (var i = 0; i < iLength; i++) {
                oParameter = oSelectionVariant.Parameters[i];

                //If parameter property name or path not present
                if (!oParameter.PropertyName || !oParameter.PropertyName.PropertyPath) {
                    continue;
                }

                //Property name is there but value annotation is not there, then give error
                if (!oParameter.PropertyValue) {
                    Log.error("Missing value for parameter " + oParameter.PropertyName.PropertyPath);
                    continue;
                }

                aParameters[aParameters.length] = {
                    path: oParameter.PropertyName.PropertyPath,
                    value: getPrimitiveValue(oParameter.PropertyValue)
                };
            }

            return aParameters;
        }

        /**
         * return the filters that need to be applyed on an aggregation
         *
         * @param ovpCardProperties - card properties model which might contains filters configurations
         * @param oSelectionVariant - optional selection variant annotation with SelectOptions configuration
         * @returns {Array} of model filters
         */
        function getFilters(ovpCardProperties, oSelectionVariant) {
            var aFilters = [];
            var aSelectOptions;
            //get the configured filters if exist and append them to the filter array
            var aConfigFilters = ovpCardProperties.getProperty("/filters");
            if (aConfigFilters) {
                aFilters = aFilters.concat(aConfigFilters);
            }

            //get the filters from the selection variant annotations if exists
            if (oSelectionVariant && oSelectionVariant.SelectOptions) {
                aSelectOptions = oSelectionVariant.SelectOptions;
            } else {
                aSelectOptions = oSelectionVariant;
            }
            var oSelectOption, sPropertyPath, oRange;
            if (aSelectOptions) {
                for (var i = 0; i < aSelectOptions.length; i++) {
                    oSelectOption = aSelectOptions[i];
                    sPropertyPath = oSelectOption.PropertyName.PropertyPath;
                    //a select option might contains more then one filter in the Ranges array
                    for (var j = 0; j < oSelectOption.Ranges.length; j++) {
                        oRange = oSelectOption.Ranges[j];
                        if (oRange.Sign.EnumMember) {
                            //create the filter. the Low value is mandatory
                            var oFilter = {
                                path: sPropertyPath,
                                operator: oRange.Option.EnumMember.split("/")[1],
                                value1: getPrimitiveValue(oRange.Low),
                                value2: getPrimitiveValue(oRange.High),
                                sign: oRange.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" ? "I" : "E"
                            };
                            // exclude sign is supported only with EQ operator
                            if (oFilter.sign === "E" && oFilter.operator !== FilterOperator.EQ) {
                                Log.error("Exclude sign is supported only with EQ operator");
                                continue;
                            }
                            // aFilters will be used later in the flow to create filter object. (sap.ui.model.Filter),
                            // that does not support sign property, so the sign property will be ignored later in the flow.

                            // This getFilters will also be called during navigation to create selection variant.
                            // for selection variant sign property is supported but NE operator is not supported
                            // This case will be handled by the calling function in card.controller
                            if (oFilter.sign === "E" && oFilter.operator === FilterOperator.EQ) {
                                oFilter.operator = FilterOperator.NE;
                                oFilter.sign = "I";
                            }

                            // contains operation is supported only in includes case by the smartFilter
                            if (oFilter.operator === "CP" && oFilter.sign === "I") {
                                var sInternalOperation = FilterOperator.Contains;
                                var sValue = oFilter.value1;
                                if (sValue) {
                                    var nIndexOf = sValue.indexOf('*');
                                    var nLastIndex = sValue.lastIndexOf('*');

                                    // only when there are '*' at all
                                    if (nIndexOf > -1) {
                                        if ((nIndexOf === 0) && (nLastIndex !== (sValue.length - 1))) {
                                            sInternalOperation = FilterOperator.EndsWith;
                                            sValue = sValue.substring(1, sValue.length);
                                        } else if ((nIndexOf !== 0) && (nLastIndex === (sValue.length - 1))) {
                                            sInternalOperation = FilterOperator.StartsWith;
                                            sValue = sValue.substring(0, sValue.length - 1);
                                        } else {
                                            sValue = sValue.substring(1, sValue.length - 1);
                                        }
                                    }
                                }
                                oFilter.operator = sInternalOperation;
                                oFilter.value1 = sValue;
                            }

                            //append the filter to the filters array
                            aFilters.push(oFilter);
                        }
                    }
                }
            }

            return aFilters;
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

        function getNumberValue(oValue) {
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

            return value;
        }

        function getPrimitiveValue(oValue) {
            var value;

            if (oValue) {
                if (oValue.String || oValue.String === "") {
                    value = oValue.String;
                } else if (oValue.Boolean || oValue.Bool) {
                    value = getBooleanValue(oValue);
                } else if (oValue.DateTime) {
                    value = oValue.DateTime;
                } else if (oValue.DateTimeOffset) {
                    value = oValue.DateTimeOffset;
                } else {
                    value = getNumberValue(oValue);
                }
            }

            return value;
        }

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

        function getItemsLength(oOvpCardPropertiesModel) {
            var type = oOvpCardPropertiesModel.getProperty('/contentFragment');
            var listType = oOvpCardPropertiesModel.getProperty('/listType');
            var flavor = oOvpCardPropertiesModel.getProperty('/listFlavor');
            var oItemSizes;

            var device = "desktop";

            //get current device
            if (Device.system.phone) {
                device = "phone";
            } else if (Device.system.tablet) {
                device = "tablet";
            }

            //check the current card type and get the sizes objects
            if (type == "sap.ovp.cards.list.List") {
                if (listType == "extended") {
                    if (flavor == "bar") {
                        oItemSizes = ITEM_LENGTH["List_extended_bar"];
                    } else {
                        oItemSizes = ITEM_LENGTH["List_extended"];
                    }
                } else if (flavor == "bar") {
                    oItemSizes = ITEM_LENGTH["List_condensed_bar"];
                } else {
                    oItemSizes = ITEM_LENGTH["List_condensed"];
                }
            } else if (type == "sap.ovp.cards.table.Table") {
                oItemSizes = ITEM_LENGTH["Table"];
            } else if (type == "sap.ovp.cards.stack.Stack") {

                if (oOvpCardPropertiesModel.getProperty('/objectStreamCardsNavigationProperty')) {
                    oItemSizes = ITEM_LENGTH["Stack_complex"];
                } else {
                    oItemSizes = ITEM_LENGTH["Stack_simple"];
                }
            }

            if (oItemSizes) {
                return oItemSizes[device];
            }

            return 5;
        }

        //Function to remove the datafield if there is a datapoint with same target as datafield
        function removeDuplicateDataField(oContext) {
            var aCollection = oContext.getObject();
            var aDataPoints = getSortedDataPoints(oContext, aCollection, true);
            var aDataPointsValues = aDataPoints.map(function (oDataPoint) {
                if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
                    return oDataPoint.Value.Path;
                } else if (oDataPoint && oDataPoint.fn && oDataPoint.fn.Path) {
                    return oDataPoint.fn.Path;
                }
            });
            aCollection.filter(function (item, index) {
                if (item.RecordType === "com.sap.vocabularies.UI.v1.DataField" && aDataPointsValues.indexOf(item.Value.Path) > -1) {
                    aCollection.splice(index, 1);
                }
            });
        }

        removeDuplicateDataField.requiresIContext = true;

        function formatUrl(iContext, sUrl) {
            if (sUrl.charAt(0) === '/' || sUrl.indexOf("http") === 0) {
                return sUrl;
            }
            var sBaseUrl = iContext.getModel(0).getProperty("/baseUrl");
            if (sBaseUrl) {
                return sBaseUrl + "/" + sUrl;
            }
            return sUrl;
        }

        formatUrl.requiresIContext = true;

        function getDataPointsCount(iContext, aCollection) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection);
            return aDataPoints.length;
        }

        getDataPointsCount.requiresIContext = true;

        function getFirstDataPointValue(iContext, aCollection) {
            return getDataPointValue(iContext, aCollection, 0);
        }

        getFirstDataPointValue.requiresIContext = true;

        function getSecondDataPointValue(iContext, aCollection) {
            return getDataPointValue(iContext, aCollection, 1);
        }

        getSecondDataPointValue.requiresIContext = true;

        function getDataPointValue(iContext, aCollection, index) {
            var aDataPoints = getSortedDataPoints(iContext, aCollection),
                oDataPoint = aDataPoints[index];

            if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
                return oDataPoint.Value.Path;
            }
            return "";
        }

        function getFirstDataFieldName(iContext, aCollection) {
            return getDataFieldName(iContext, aCollection, 0);
        }

        getFirstDataFieldName.requiresIContext = true;

        function getSecondDataFieldName(iContext, aCollection) {
            return getDataFieldName(iContext, aCollection, 1);
        }

        getSecondDataFieldName.requiresIContext = true;

        function getThirdDataFieldName(iContext, aCollection) {
            return getDataFieldName(iContext, aCollection, 2);
        }

        getThirdDataFieldName.requiresIContext = true;

        function getFourthDataFieldName(iContext, aCollection) {
            return getDataFieldName(iContext, aCollection, 3);
        }

        getFourthDataFieldName.requiresIContext = true;

        function getFifthDataFieldName(iContext, aCollection) {
            return getDataFieldName(iContext, aCollection, 4);
        }

        getFifthDataFieldName.requiresIContext = true;

        function formatDataFieldValueOnIndex(iContext, aCollection, index) {
            return formatDataField(iContext, aCollection, index);
        }

        formatDataFieldValueOnIndex.requiresIContext = true;

        function formatDataPointValueOnIndex(iContext, aCollection, index) {
            return formatDataPoint(iContext, aCollection, index);
        }

        formatDataPointValueOnIndex.requiresIContext = true;

        /**
         * This function checks the count of the data points for a particular line item and returns the data point or data field based on the index passed from the XML fragment
         * Data point takes the priority over the data field
         * @param iContext
         * @param aCollection
         * @param iDataPointIndex
         * @param iDataFieldIndex
         * @returns {*}
         */
        function formatDataPointOrField(iContext, aCollection, iDataPointIndex, iDataFieldIndex) {
            var iDataPointCount = getDataPointsCount(iContext, aCollection);
            if (iDataPointCount > 0) {
                return formatDataPointValueOnIndex(iContext, aCollection, iDataPointIndex);
            } else {
                return formatDataFieldValueOnIndex(iContext, aCollection, iDataFieldIndex);
            }
        }

        formatDataPointOrField.requiresIContext = true;

        function formatsemanticObjectOfDataFieldGeneric(iContext, oEntitySet, aCollection) {
            return semanticObjectOfDataField(iContext, oEntitySet, aCollection);
        }

        formatsemanticObjectOfDataFieldGeneric.requiresIContext = true;

        function getFirstDataPointName(iContext, aCollection) {
            return getDataPointName(iContext, aCollection, 0);
        }

        getFirstDataPointName.requiresIContext = true;

        function getSecondDataPointName(iContext, aCollection) {
            return getDataPointName(iContext, aCollection, 1);
        }

        getSecondDataPointName.requiresIContext = true;

        function getThirdDataPointName(iContext, aCollection) {
            return getDataPointName(iContext, aCollection, 2);
        }

        getThirdDataPointName.requiresIContext = true;

        function getLabelForFirstDataPoint(iContext, aCollection) {
            return getLabelForDataPoint(iContext, aCollection, 0);
        }

        getLabelForFirstDataPoint.requiresIContext = true;

        /**
         * This function returns the binding for the first dataField which contains
         * an iconURL property
         * @param iContext
         * @param aCollection
         * @returns a binding or a URL based on what has been defined in the annotations
         */
        function formatImageUrl(iContext, aCollection) {
            for (var i = 0; i < aCollection.length; i++) {
                var oItem = aCollection[i];
                if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataField") {
                    if (oItem.IconUrl && oItem.IconUrl.String) {
                        return oItem.IconUrl.String;
                    }
                    if (oItem.IconUrl && oItem.IconUrl.Path) {
                        return OdataAnnotationHelper.simplePath(iContext, oItem.IconUrl);
                    }
                }
            }
        }

        formatImageUrl.requiresIContext = true;

        /**
         * this function returns the formatted unit for a particular object number
         * returns blank if there is no entity type of currency is available
         * @param iContext
         * @param aCollection
         * @param index
         * @returns {string}
         */
        function formatUnit(iContext, aCollection, index) {
            var result = "";
            var oItem;

            if (Array.isArray(aCollection)) {
                oItem = getSortedDataPoints(iContext, aCollection)[index];
            } else { // it will be a plain object
                var oCopyOfCollection = jQuery.extend({}, aCollection);
                var oCopyOfContext = jQuery.extend({}, iContext);
                oItem = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);
            }
            if (!oItem || !oItem.Value) {
                return result;
            }
            var oModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oModel && oModel.getProperty("/entityType");
            var oMetaModel = oModel && oModel.getProperty("/metaModel");

            var oEntityTypeProperty = oMetaModel && oMetaModel.getODataProperty(oEntityType, oItem.Value.Path);
            var oCurrency = oEntityTypeProperty && oEntityTypeProperty["Org.OData.Measures.V1.ISOCurrency"]; // TODO: need to check for the unit as well
            if (oCurrency && oCurrency.Path) {
                result += (" " + generatePathForField([oCurrency.Path]));
            } else if (oCurrency && oCurrency.String) {
                result += (" " + oCurrency.String);
            }
            return result;
        }

        formatUnit.requiresIContext = true;

        /**
         * Function takes care of the formatting of the controls that need to display the number and the corresponding units
         * this function is getting called from the xml view and the data from the ovpConstants model is passed to the function
         * this calls the same function with different index based on the values passed from the xmml views
         * this method inturn calls the format data point function with the recieved parameters
         * @param iContext
         * @param aCollection
         * @param index
         * @param dontIncludeUOM - this field will always be true for object numbers and the unit of measure will not be appended to the actual value
         * @returns {*}
         */
        function formatObjectNumber(iContext, aCollection, index, dontIncludeUOM) {
            return formatDataPoint(iContext, aCollection, index, dontIncludeUOM);
        }

        formatObjectNumber.requiresIContext = true;

        function formatFirstDataPointState(iContext, aCollection) {
            return formatDataPointState(iContext, aCollection, 0);
        }

        formatFirstDataPointState.requiresIContext = true;

        function formatFirstDataPointColor(iContext, aCollection) {
            return formatDataPointColor(iContext, aCollection, 0);
        }

        formatFirstDataPointColor.requiresIContext = true;

        function formatSecondDataPointState(iContext, aCollection) {
            return formatDataPointState(iContext, aCollection, 1);
        }

        formatSecondDataPointState.requiresIContext = true;

        function formatThirdDataPointState(iContext, aCollection) {
            return formatDataPointState(iContext, aCollection, 2);
        }

        formatThirdDataPointState.requiresIContext = true;

        function formatFirstDataPointStateForSmartField(iContext, aCollection) {
            return formatDataPointStateForSmartField(iContext, aCollection, 0);
        }

        formatFirstDataPointStateForSmartField.requiresIContext = true;

        //To support criticality with path for kpi value
        function kpiValueCriticality(nCriticality) {
            var oCriticality = {};
            oCriticality.EnumMember = "None";

            if (Number(nCriticality) === 1) {
                oCriticality.EnumMember = "Negative";
            } else if (Number(nCriticality) === 2) {
                oCriticality.EnumMember = "Critical";
            } else if (Number(nCriticality) === 3) {
                oCriticality.EnumMember = "Positive";
            }
            return criticality2state(oCriticality, criticalityConstants.ColorValues);
        }

        function formatKPIHeaderState(iContext, oDataPoint) {
            if (oDataPoint && oDataPoint.Criticality && oDataPoint.Criticality.Path) {
                return "{parts: [{path:'" + oDataPoint.Criticality.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.kpiValueCriticality'}";
            } else {
                return formatDataPointToValue(iContext, oDataPoint, criticalityConstants.ColorValues);
            }
        }

        formatKPIHeaderState.requiresIContext = true;

        function isFirstDataPointCriticality(iContext, aCollection) {
            return criticalityConditionCheck(iContext, aCollection, 0);
        }

        isFirstDataPointCriticality.requiresIContext = true;

        //check data point criticality for center alignment in table easy scan layout
        function isFirstDataPointCriticalityForTableStatus(iContext, aCollection) {
            var item = getSortedDataPoints(iContext, aCollection)[0];
            if (item && (item.Criticality || item.CriticalityCalculation)) {
                return true;
            }
            return false;
        }

        isFirstDataPointCriticalityForTableStatus.requiresIContext = true;

        function isSecondDataPointCriticality(iContext, aCollection) {
            return criticalityConditionCheck(iContext, aCollection, 1);
        }

        isSecondDataPointCriticality.requiresIContext = true;

        function isThirdDataPointCriticality(iContext, aCollection) {
            return criticalityConditionCheck(iContext, aCollection, 2);
        }

        isThirdDataPointCriticality.requiresIContext = true;

        //Generic formatting functions

        function formatValueFromTarget(oContext, aCollection) {
            var sContextPath = oContext.getPath(0);
            var sEntityTypePath = sContextPath.slice(0, sContextPath.lastIndexOf("/"));
            sEntityTypePath = sEntityTypePath.slice(0, sEntityTypePath.lastIndexOf("/"));
            var sPath = getTargetPathForDataFieldForAnnotation(sEntityTypePath, aCollection);
            aCollection = oContext.getModel(0).getProperty(sPath);

            return aCollection;
        }

        function formatDataFieldValueGeneric(iContext, aCollection) {
            if (!aCollection) {
                return "";
            }
            return formatField(iContext, aCollection);
        }

        formatDataFieldValueGeneric.requiresIContext = true;

        function semanticObjectOfDataField(iContext, oEntitySet, aCollection, index) {
            var semanticObjectOfDF;
            var item = index == undefined ? aCollection : getSortedDataFields(iContext, aCollection)[index];
            var oModel = iContext.getSetting('ovpCardProperties');
            var oMetaModel = oModel.getProperty("/metaModel");
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            var oEntityTypeProps = oEntityType.property;
            if (oEntityTypeProps) {
                for (var i = 0; i < oEntityTypeProps.length; i++) {
                    if (item.Value.Path === oEntityTypeProps[i].name) {
                        semanticObjectOfDF = oEntityTypeProps[i]["com.sap.vocabularies.Common.v1.SemanticObject"];
                        if (semanticObjectOfDF) {
                            return OdataAnnotationHelper.format(iContext, semanticObjectOfDF);
                        } else {
                            return "";
                        }
                    }
                }
            }
        }

        function checkNavTargetForContactAnno(iContext, item, index) {
            var path = index === undefined ? item.Value.Path : item[index].Value.Path;
            var navTarget = (path.indexOf("/") != -1) ? path.split('/')[0] : "";
            return navTarget;
        }

        checkNavTargetForContactAnno.requiresIContext = true;

        function checkForContactAnnotation(iContext, oEntitySet) {
            var oModel = iContext.getSetting('ovpCardProperties');
            var oMetaModel = oModel.getProperty("/metaModel");
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            if (oEntityType["com.sap.vocabularies.Communication.v1.Contact"]) {
                return true;
            }
            return false;
        }

        checkForContactAnnotation.requiresIContext = true;

        function formatDataPointValue(iContext, aCollection, dontIncludeUOM) {
            if (!aCollection) {
                return "";
            }
            var oModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");
            var oCopyOfCollection = jQuery.extend({}, aCollection);
            var oCopyOfContext = jQuery.extend({}, iContext);
            aCollection = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);

            return _formatDataPoint(iContext, aCollection, oEntityType, oMetaModel, dontIncludeUOM);
        }

        formatDataPointValue.requiresIContext = true;

        function formatDataPointStateGeneric(iContext, aCollection) {
            var oCopyOfCollection = jQuery.extend({}, aCollection);
            var oCopyOfContext = jQuery.extend({}, iContext);
            var sState = "None",
                oCriticalityConfigValues = criticalityConstants.StateValues;
            aCollection = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);

            if (aCollection && aCollection.Criticality) {
                sState = buildExpressionForProgressIndicatorCriticality(iContext, aCollection, oCriticalityConfigValues);
            } else {
                sState = formatDataPointToValue(iContext, aCollection, oCriticalityConfigValues);
            }
            return sState;
        }

        formatDataPointStateGeneric.requiresIContext = true;

        function checkCriticalityGeneric(iContext, aCollection) {
            var oCopyOfCollection = jQuery.extend({}, aCollection);
            var oCopyOfContext = jQuery.extend({}, iContext);
            aCollection = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);

            if (aCollection && aCollection.Criticality) {
                return true;
            }
        }

        checkCriticalityGeneric.requiresIContext = true;

        //check data point criticality for center alignment of property with type Edm.String in table dashboard layout
        function checkCriticalityGenericForTableStatus(iContext, aCollection) {
            var oCopyOfCollection = jQuery.extend({}, aCollection);
            var oCopyOfContext = jQuery.extend({}, iContext);
            var oModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");
            aCollection = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);
            if (!aCollection) {
                return;
            }
            var oProperty = oMetaModel.getODataProperty(oEntityType, aCollection.Value.Path);

            if (aCollection && oProperty && oProperty.type == "Edm.String" && (aCollection.Criticality || aCollection.CriticalityCalculation)) {
                return 'Center';
            }

            if (oProperty && ((oProperty.type == "Edm.DateTime") || (oProperty.type == "Edm.DateTimeOffset"))) {
                return 'Right';
            }
        }

        checkCriticalityGenericForTableStatus.requiresIContext = true;


        function formatDataPointStateForSmartFieldGeneric(iContext, aCollection) {
            var oCopyOfCollection = jQuery.extend({}, aCollection);
            var oCopyOfContext = jQuery.extend({}, iContext);
            aCollection = formatValueFromTarget(oCopyOfContext, oCopyOfCollection);
            var sState = "None";
            if (aCollection && aCollection.Criticality && aCollection.Criticality.Path) {
                sState = "{path:'" + aCollection.Criticality.Path + "'}";
            } else {
                sState = formatDataPointToValue(iContext, aCollection, criticalityConstants.StateValues);
                sState = criticalityState2Value(sState);
            }
            return sState;
        }

        formatDataPointStateForSmartFieldGeneric.requiresIContext = true;

        /*
         * @param iContext
         * @returns 0 for false - there are no actions for this context
         *          1 for true - there are actions for this context
         *          does not return actual boolean - so we won't need to parse the result in the xml
         */
        function hasActions(iContext, aCollection) {
            var oItem;
            for (var i = 0; i < aCollection.length; i++) {
                oItem = aCollection[i];
                if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
                    oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
                    oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
                    return 1;
                }
            }
            return 0;
        }

        hasActions.requiresIContext = true;

        function isFirstDataPointPercentageUnit(iContext, aCollection) {
            var oDataPoint = getSortedDataPoints(iContext, aCollection)[0];
            // we are sending index 0 to iContext.getPath() function
            // if we pass the default index to this method, it works for both composite path as well as parts
            // in case of parts, we need only the path from the first path in the parts
            if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
                var sEntityTypePath = iContext.getPath(0).substr(0, iContext.getPath(0).lastIndexOf("/") + 1);
                var oModel = iContext.getModel(0);
                var oEntityType = oModel.getProperty(sEntityTypePath);
                var oProperty = oModel.getODataProperty(oEntityType, oDataPoint.Value.Path);
                if (oProperty && oProperty["Org.OData.Measures.V1.Unit"]) {
                    return oProperty["Org.OData.Measures.V1.Unit"].String === "%";
                }
            }
            return false;
        }

        isFirstDataPointPercentageUnit.requiresIContext = true;

        function resolveEntityTypePath(oAnnotationPathContext) {
            var sAnnotationPath = oAnnotationPathContext.getObject();
            var oModel = oAnnotationPathContext.getModel();
            var oMetaModel = oModel.getProperty("/metaModel");
            var oEntitySet = oMetaModel.getODataEntitySet(oModel.getProperty("/entitySet"));
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
            sAnnotationPath = oEntityType.$path + "/" + sAnnotationPath;
            return oMetaModel.createBindingContext(sAnnotationPath);
        }

        function resolveParameterizedEntitySet(oDataModel, oEntitySet, oSelectionVariant, aParameters, oGlobalFilter) {

            var path = "";
            var o4a = new odata4analytics.Model(odata4analytics.Model.ReferenceByModel(oDataModel));
            var queryResult = o4a.findQueryResultByName(oEntitySet.name);

            if (!queryResult) {
                path = "/" + oEntitySet.name;
                return path;
            }
            var queryResultRequest = new odata4analytics.QueryResultRequest(queryResult);
            var parameterization = queryResult.getParameterization();

            if (!parameterization) {
                 path = "/" + oEntitySet.name;
                 return path;
            }

            if (oGlobalFilter) {
                var aFilterParams = oGlobalFilter.getAnalyticalParameters();
            }

            if (parameterization) {
                var param;
                queryResultRequest.setParameterizationRequest(new odata4analytics.ParameterizationRequest(parameterization));
                if (oSelectionVariant && oSelectionVariant.Parameters) {
                    each(oSelectionVariant.Parameters, function () {
                        if (this.RecordType === "com.sap.vocabularies.UI.v1.IntervalParameter") {
                            param = this.PropertyNameFrom.PropertyPath.split("/");
                            queryResultRequest.getParameterizationRequest().setParameterValue(
                                param[param.length - 1],
                                this.PropertyValueFrom.String,
                                this.PropertyValueTo.String
                            );
                        } else {
                            param = this.PropertyName.PropertyPath.split("/");
                            queryResultRequest.getParameterizationRequest().setParameterValue(
                                param[param.length - 1],
                                this.PropertyValue.String
                            );
                        }
                    });
                } else if (aParameters) {
                    each(aParameters, function () {
                        queryResultRequest.getParameterizationRequest().setParameterValue(
                            this.path,
                            this.value
                        );
                    });
                } else if (aFilterParams && aFilterParams.length > 0) {
                    /*
                     * If there is no selectionvariant defined with parameters but the global filter has a default parameter, resolve the entitySet path here
                     * */
                    var oUiState = oGlobalFilter && oGlobalFilter.getUiState({
                         allFilters: false
                    });
                    var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
                    var oSelectionVariant = new SelectionVariant(sSelectionVariant);
                    /*
                     * From parameterization object, retrieve the parameters set.
                     * For each parameter in the parameter set, check if it is present in the filterparams.
                     * */
                    for (var sKey in parameterization.getAllParameters()) {
                        for (var i = 0; i < aFilterParams.length; i++) {
                             if (aFilterParams[i] && (aFilterParams[i].name == sKey)){
                                var sParameterName = aFilterParams[i].name;
                                //To get the current value of the parameter
                                var sValue = oSelectionVariant.getParameter(sParameterName);
                                if (!sValue) {
                                    var oSelectOption = oSelectionVariant.getSelectOption(sParameterName);
                                    sValue = oSelectOption && oSelectOption[0] && oSelectOption[0].Low;
                                }
                                 queryResultRequest.getParameterizationRequest().setParameterValue(
                                   sKey,
                                   sValue
                                 );
                             }
                        }
                     }
                } else {
                    path = "/" + oEntitySet.name;
                    Log.error("SelectionParameters", "There are no parameters to resolve");
                    return path;
                }
            }

            try {
                path = queryResultRequest.getURIToQueryResultEntitySet();
            } catch (exception) {
                queryResult = queryResultRequest.getQueryResult();
                path = "/" + queryResult.getEntitySet().getQName();
                Log.error("getEntitySetPathWithParameters", "binding path with parameters failed - " + exception || exception.message);
            }
            return path;
        }

        function getAssociationObject(oModel, sAssociation, ns) {
            // find a nicer way of getting association set entry in meta model
            var aAssociations = oModel.getServiceMetadata().dataServices.schema[0].association;
            for (var i = 0; i < aAssociations.length; i++) {
                if (ns + "." + aAssociations[i].name === sAssociation) {
                    return aAssociations[i];
                }
            }
        }

        /*
         Generic function to get com.sap.vocabularies.UI.v1.DataField record type from lineitem with index
         */
        function getDataFieldGeneric(aCollection, index) {
            var aDataFields = aCollection.filter(function (oItem) {
                if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataField") {
                    return true;
                }
                return false;
            });
            var aDataFieldsSorted = sortCollectionByImportance(aDataFields);
            if (aDataFieldsSorted) {
                return aDataFieldsSorted[index];
            }
            return;
        }

        /*
         function to check com.sap.vocabularies.Common.v1.SemanticObject for first data field to show smart link in list card
         */
        function semanticObjectOfFirstDataField(iContext, oEntitySet, aCollection) {
            if (!aCollection || !aCollection.length || aCollection.length === 0) {
                return false;
            }
            aCollection = getDataFieldGeneric(aCollection, 0);
            return semanticObjectOfDataField(iContext, oEntitySet, aCollection);
        }

        semanticObjectOfFirstDataField.requiresIContext = true;

        /*
         function to check com.sap.vocabularies.Common.v1.SemanticObject for second data field to show smart link in list card
         */
        function semanticObjectOfSecondDataField(iContext, oEntitySet, aCollection) {
            if (!aCollection || !aCollection.length || aCollection.length === 0) {
                return false;
            }
            aCollection = getDataFieldGeneric(aCollection, 1);
            return semanticObjectOfDataField(iContext, oEntitySet, aCollection);
        }

        semanticObjectOfSecondDataField.requiresIContext = true;

        /*
         Generic function to check com.sap.vocabularies.Communication.v1.Contact record type from lineitem with index
         */

        function getContactAnnotation(aCollection, index) {
            var aContactFields = aCollection.filter(function (oItem) {
                if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oItem.Target.AnnotationPath.indexOf("@com.sap.vocabularies.Communication.v1.Contact") !== -1) {
                    return true;
                }
                return false;
            });
            var aContactFieldsSorted = sortCollectionByImportance(aContactFields);
            if (aContactFieldsSorted) {
                return aContactFieldsSorted[index];
            }
            return;
        }

        /*
         check if first contact annotation is available or not in lineitem
         */
        function isFirstContactAnnotation(aCollection) {
            if (!aCollection || !aCollection.length || aCollection.length === 0) {
                return false;
            }
            var oFirstContactAnnotation = getContactAnnotation(aCollection, 0);
            if (oFirstContactAnnotation) {
                return true;
            }
            return false;
        }

        /**************************** Formatters & Helpers for KPI-Header logic  ****************************/

        /* Returns binding path for singleton */
        function getAggregateNumber(iContext, oEntitySet, oDataPoint, oSelectionVariant) {
            var measure, dataPointDescription, dataPointTitle;
            if (oDataPoint && oDataPoint.Value && oDataPoint.Value.Path) {
                measure = oDataPoint.Value.Path;
            } else if (oDataPoint && oDataPoint.Description && oDataPoint.Description.Value && oDataPoint.Description.Value.Path) {
                measure = oDataPoint.Description.Value.Path;
            }
            if (oDataPoint && oDataPoint.Description && oDataPoint.Description.Path) {
                dataPointDescription = oDataPoint.Description.Path;
            } else if (oDataPoint && oDataPoint.Title && oDataPoint.Title.Path) {
                dataPointTitle = oDataPoint.Title.Path;
            }
            var ret = "";
            var bParams = oSelectionVariant && oSelectionVariant.Parameters;
            var filtersString = "";

            var ovpCardProperties = iContext.getSetting('ovpCardProperties'),
                aParameters = ovpCardProperties.getProperty('/parameters');

            bParams = bParams || !!aParameters;

            if (bParams) {
                var dataModel = iContext.getSetting("dataModel");
                var path = resolveParameterizedEntitySet(dataModel, oEntitySet, oSelectionVariant, aParameters);
                ret += "{path: '" + path + "'";
            } else {
                ret += "{path: '/" + oEntitySet.name + "'";
            }

            ret += ", length: 1";
            var oOvpCardSettings = iContext.getSetting('ovpCardProperties');
            var oEntityType = oOvpCardSettings.getProperty("/entityType");
            var unitColumn = CommonUtils.getUnitColumn(measure, oEntityType);
            var aFilters = getFilters(oOvpCardSettings, oSelectionVariant);

            if (aFilters.length > 0) {
                filtersString += ", filters: " + JSON.stringify(aFilters);
            }

            var selectArr = [];
            selectArr.push(measure);
            if (dataPointDescription) {
                selectArr.push(dataPointDescription);
            } else if (dataPointTitle) {
                selectArr.push(dataPointTitle);
            }
            if (oDataPoint && oDataPoint.Criticality && oDataPoint.Criticality.Path) {
                selectArr.push(oDataPoint.Criticality.Path);
            }
            // if DeviationRangeLowValue and ToleranceRangeLowValue read from Path instead of string
            if (oDataPoint && oDataPoint.CriticalityCalculation && oDataPoint.CriticalityCalculation.DeviationRangeLowValue && oDataPoint.CriticalityCalculation.DeviationRangeLowValue.Path) {
                selectArr.push(oDataPoint.CriticalityCalculation.DeviationRangeLowValue.Path);
            }
            if (oDataPoint && oDataPoint.CriticalityCalculation && oDataPoint.CriticalityCalculation.ToleranceRangeLowValue && oDataPoint.CriticalityCalculation.ToleranceRangeLowValue.Path) {
                selectArr.push(oDataPoint.CriticalityCalculation.ToleranceRangeLowValue.Path);
            }

            // if DeviationRangeHighValue and ToleranceRangeHighValue read from Path instead of string
            if (oDataPoint && oDataPoint.CriticalityCalculation && oDataPoint.CriticalityCalculation.DeviationRangeHighValue && oDataPoint.CriticalityCalculation.DeviationRangeHighValue.Path) {
                selectArr.push(oDataPoint.CriticalityCalculation.DeviationRangeHighValue.Path);
            }
            if (oDataPoint && oDataPoint.CriticalityCalculation && oDataPoint.CriticalityCalculation.ToleranceRangeHighValue && oDataPoint.CriticalityCalculation.ToleranceRangeHighValue.Path) {
                selectArr.push(oDataPoint.CriticalityCalculation.ToleranceRangeHighValue.Path);
            }

            if (unitColumn) {
                selectArr.push(unitColumn);
            }
            if (oDataPoint && oDataPoint.TrendCalculation && oDataPoint.TrendCalculation.ReferenceValue && oDataPoint.TrendCalculation.ReferenceValue.Path) {
                selectArr.push(oDataPoint.TrendCalculation.ReferenceValue.Path);
            }

            var bCheckFilterPreference = checkFilterPreference(ovpCardProperties);
            var sCustomParameter = bCheckFilterPreference ? ", custom: {cardId: '" + ovpCardProperties.getProperty("/cardId") + "'}" : "";
            return ret + ", parameters:{select:'" + selectArr.join(",") + "'" + sCustomParameter + "}" + filtersString + "}";
        }

        getAggregateNumber.requiresIContext = true;

        /* ----- format KPi value as per scale factor------ */
        function KpiValueFormatter(kpiValue) {
            if (isNaN(kpiValue)) {
                return kpiValue;
            }
            var fractionalDigits, scaleFactor, percentageFlag = false;
            if (this.oPropagatedProperties.oModels.ovpCardProperties.oData.NumberOfFractionalDigits) {
                fractionalDigits = Number(this.oPropagatedProperties.oModels.ovpCardProperties.oData.NumberOfFractionalDigits);
            }
            if (this.oPropagatedProperties.oModels.ovpCardProperties.oData.percentageAvailable) {
                percentageFlag = true;
            }
            if (!fractionalDigits || fractionalDigits < 0) {
                fractionalDigits = 0;
            } else if (fractionalDigits > 2) {
                fractionalDigits = 2;
            }
            scaleFactor = kpiValue;
            if (kpiValue) {
                var numberFormat = NumberFormat.getFloatInstance({
                    minFractionDigits: fractionalDigits,
                    maxFractionDigits: fractionalDigits,
                    style: "short",
                    showScale: true,
                    shortRefNumber: scaleFactor
                });
                if (percentageFlag) {
                    return numberFormat.format(Number(kpiValue)) + " %";
                } else {
                    return numberFormat.format(Number(kpiValue));
                }

            }
        }

        /* Creates binding path for NumericContent value */
        function formThePathForAggregateNumber(dataPoint) {
            if (!dataPoint || !dataPoint.Value || !dataPoint.Value.Path) {
                return "";
            }
            if (dataPoint && dataPoint.ValueFormat && dataPoint.ValueFormat.NumberOfFractionalDigits && dataPoint.ValueFormat.NumberOfFractionalDigits.Int) {
                this.getModel("ovpCardProperties").oData.NumberOfFractionalDigits = dataPoint.ValueFormat.NumberOfFractionalDigits.Int;
            }
            var oModel = this.getModel('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");
            var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, dataPoint.Value.Path);
            if (oEntityTypeProperty["Org.OData.Measures.V1.Unit"]) {
                var oUnit = oEntityTypeProperty["Org.OData.Measures.V1.Unit"];
                if (oUnit.String == "%") {
                    this.getModel("ovpCardProperties").oData.percentageAvailable = true;
                }
            }
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.KpiValueFormatter'}";
        }

        /* Creates binding path for trend icon */
        function formThePathForTrendIcon(iContext, oDataPoint) {
            if (!oDataPoint || !oDataPoint.Value || !oDataPoint.Value.Path || !oDataPoint.TrendCalculation) {
                return "";
            }

            var value = getPathOrPrimitiveValue(oDataPoint.Value);
            var referenceValue = getPathOrPrimitiveValue(oDataPoint.TrendCalculation.ReferenceValue);
            var downDifference = getPathOrPrimitiveValue(oDataPoint.TrendCalculation.DownDifference);
            var upDifference = getPathOrPrimitiveValue(oDataPoint.TrendCalculation.UpDifference);

            var bIsRefValBinding = isBindingValue(referenceValue);
            var bIsDownDiffBinding = isBindingValue(downDifference);
            var bIsUpDiffBinding = isBindingValue(upDifference);

            var sParts = "parts: [" + value;
            sParts += bIsRefValBinding ? "," + referenceValue : "";
            sParts += bIsDownDiffBinding ? "," + downDifference : "";
            sParts += bIsUpDiffBinding ? "," + upDifference : "";
            sParts += "]";

            var formatFunc = function () {
                var index = 1;
                return calculateTrendDirection(
                    arguments[0],
                    bIsRefValBinding ? arguments[index++] : referenceValue,
                    bIsDownDiffBinding ? arguments[index++] : downDifference,
                    bIsUpDiffBinding ? arguments[index++] : upDifference
                );
            };

            var sFormatFuncName = setFormatFunctionAndGetFunctionName(formatFunc, "formatTrendDirection");
            return "{" + sParts + ", formatter: '" + sFormatFuncName + "'}";
        }

        formThePathForTrendIcon.requiresIContext = true;

        /* Creates binding path for % change */
        function formPathForPercentageChange(dataPoint) {
            if (!dataPoint || !dataPoint.TrendCalculation || !dataPoint.TrendCalculation.ReferenceValue) {
                return "";
            }
            if (dataPoint && dataPoint.ValueFormat && dataPoint.ValueFormat.NumberOfFractionalDigits && dataPoint.ValueFormat.NumberOfFractionalDigits.Int) {
                this.getModel("ovpCardProperties").oData.NumberOfFractionalDigits = dataPoint.ValueFormat.NumberOfFractionalDigits.Int;
            }
            if (dataPoint.TrendCalculation.ReferenceValue.Path) {
                return "{parts: [{path:'" + dataPoint.Value.Path + "'}, {path:'" + dataPoint.TrendCalculation.ReferenceValue.Path +
                    "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnPercentageChange'}";
            } else {
                return "{parts: [{path:'" + dataPoint.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.returnPercentageChange'}";
            }
        }

        /**
         *  function to format target value as per scalefactor, NumberOfFractionalDigits, with or without %
         *
         *  @method {private} TargetValueFormatter
         *  @param {number} iKpiValue - kpi value
         *  @param {number} iTargetValue - target/reference value
         *  @return {number} formatted target value
         *
         */
        function TargetValueFormatter(iKpiValue, iTargetValue) {
            var iValue, oOvpCardProperties, iFractionalDigits, iScaleFactor, bPercentageFlagForTarget = false;
            if (isNaN(+iKpiValue)) {
                return "";
            }

            if (iKpiValue == 0) {
                iScaleFactor = iTargetValue;
            } else {
                iScaleFactor = iKpiValue;
            }
            oOvpCardProperties = this.getModel('ovpCardProperties');
            if (oOvpCardProperties.getProperty("/iNumberOfFractionalDigits")) {
                iFractionalDigits = +(oOvpCardProperties.getProperty("/iNumberOfFractionalDigits"));
            }
            if (oOvpCardProperties.getProperty("/bPercentageAvailableForTarget")) {
                bPercentageFlagForTarget = true;
            }
            if (iTargetValue) {
                iValue = iTargetValue;
            } else {
                if (oOvpCardProperties.getProperty("/sManifestTargetValue")) {
                    iValue = oOvpCardProperties.getProperty("/sManifestTargetValue");
                }

            }

            if (!iFractionalDigits || iFractionalDigits < 0) {
                iFractionalDigits = 0;
            } else if (iFractionalDigits > 2) {
                iFractionalDigits = 2;
            }

            if (iValue) {
                var fnNumberFormat = NumberFormat.getFloatInstance({
                    minFractionDigits: iFractionalDigits,
                    maxFractionDigits: iFractionalDigits,
                    style: "short",
                    showScale: true,
                    shortRefNumber: iScaleFactor
                });
                if (bPercentageFlagForTarget) {
                    return fnNumberFormat.format(+(iValue)) + " %";
                } else {
                    return fnNumberFormat.format(+(iValue));
                }
            }
        }


        /**
         *  function to return binding path for target value
         *
         *  @method {private} formPathForTargetValue
         *  @param {object} oDataPointAnnotation - data point annotation
         *  @return {string} returns TargetValueFormatter with binding paths
         *
         */

        function formPathForTargetValue(oDataPointAnnotation) {
            if (!oDataPointAnnotation || !oDataPointAnnotation.TrendCalculation || !oDataPointAnnotation.TrendCalculation.ReferenceValue) {
                return "";
            }
            if (!oDataPointAnnotation || !oDataPointAnnotation.Value || !oDataPointAnnotation.Value.Path) {
                return "";
            }
            var oModel = this.getModel('ovpCardProperties');
            var oEntityType = oModel.getProperty("/entityType");
            var oMetaModel = oModel.getProperty("/metaModel");
            if (oDataPointAnnotation && oDataPointAnnotation.ValueFormat && oDataPointAnnotation.ValueFormat.NumberOfFractionalDigits && oDataPointAnnotation.ValueFormat.NumberOfFractionalDigits.Int) {
                oModel.setProperty("/iNumberOfFractionalDigits", oDataPointAnnotation.ValueFormat.NumberOfFractionalDigits.Int);
            }
            if (oDataPointAnnotation.TrendCalculation.ReferenceValue) {
                if (oDataPointAnnotation.TrendCalculation.ReferenceValue.String) {
                    oModel.setProperty("/sManifestTargetValue", oDataPointAnnotation.TrendCalculation.ReferenceValue.String);
                    return "{parts: [{path:'" + oDataPointAnnotation.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.TargetValueFormatter'}";
                }
                if (oDataPointAnnotation.TrendCalculation.ReferenceValue.Path) {
                    var oEntityTypeProperty = oMetaModel.getODataProperty(oEntityType, oDataPointAnnotation.TrendCalculation.ReferenceValue.Path);
                    if (oEntityTypeProperty["Org.OData.Measures.V1.Unit"]) {
                        var oUnit = oEntityTypeProperty["Org.OData.Measures.V1.Unit"];
                        if (oUnit.String == "%") {
                            oModel.setProperty("/bPercentageAvailableForTarget", true);
                        }
                    }
                    return "{parts: [{path:'" + oDataPointAnnotation.Value.Path + "'},{path:'" + oDataPointAnnotation.TrendCalculation.ReferenceValue.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.TargetValueFormatter'}";
                }
            }
        }

        /**
         *  function to calculate Percentage change/deviation
         *
         *  @method {private} returnPercentageChange
         *  @param {number} iKpiValue - kpi value
         *  @param {number} iTargetValue - target/reference value
         *  @return {number} formatted deviation value
         *
         */
        function returnPercentageChange(iKpiValue, iTargetValue) {
            var iFractionalDigits, iReferenceValue, oOvpCardProperties;
            if (isNaN(+iKpiValue)) {
                return "";
            }
            iKpiValue = +(iKpiValue);
            oOvpCardProperties = this.getModel('ovpCardProperties');
            if (oOvpCardProperties.getProperty("/iNumberOfFractionalDigits")) {
                iFractionalDigits = +(oOvpCardProperties.getProperty("/iNumberOfFractionalDigits"));
            }
            if (iTargetValue) {
                iReferenceValue = +(iTargetValue);
            } else {
                if (oOvpCardProperties.getProperty("/sManifestTargetValue")) {
                    iReferenceValue = +(oOvpCardProperties.getProperty("/sManifestTargetValue"));
                }
            }

            if (!iFractionalDigits || iFractionalDigits < 0) {
                iFractionalDigits = 0;
            } else if (iFractionalDigits > 2) {
                iFractionalDigits = 2;
            }

            if (iReferenceValue) {
                var iPercentNumber = ((iKpiValue - iReferenceValue) / iReferenceValue);
                var fnPercentFormatter = NumberFormat.getPercentInstance({
                    style: 'short',
                    minFractionDigits: iFractionalDigits,
                    maxFractionDigits: iFractionalDigits,
                    showScale: true
                });
                return fnPercentFormatter.format(iPercentNumber);
            }
        }

        function isPresentationVarientPresent(oPresentationVariant) {
            if (oPresentationVariant && oPresentationVariant.GroupBy && !(jQuery.isEmptyObject(oPresentationVariant.GroupBy)) && oPresentationVariant.GroupBy[0].hasOwnProperty('PropertyPath')) {
                return true;
            } else {
                return false;
            }
        }

        function getLabelFromKey(aItems, sKey) {
            var oItem;
            for (var i = 0; aItems && i < aItems.length; i++) {
                if (aItems[i].value == sKey) {
                    oItem = aItems[i];
                    break;
                }
            }
            return oItem ? oItem.name : null;
        }

        function getAnnotationLabel(aItems, sKey) {
            return getLabelFromKey(aItems, sKey);
        }

        function getApplicationName(aItems, sKey) {
            var sLabel = getLabelFromKey(aItems, sKey);
            return sLabel ? sLabel : OvpResources.getText("OVP_KEYUSER_LABEL_NO_NAVIGATION");
        }

        /*
         * Reads groupBy from annotation and prepares comma separated list
         */
        function listGroupBy(oPresentationVariant) {
            var result = "";
            var bPV = oPresentationVariant && oPresentationVariant.GroupBy;
            if (!bPV) {
                return result;
            }

            var metaModel = this.getModel('ovpCardProperties').getProperty("/metaModel");
            var oEntityType = this.getModel('ovpCardProperties').getProperty("/entityType");
            var groupByList;

            if (oPresentationVariant.GroupBy.constructor === Array) {
                groupByList = oPresentationVariant.GroupBy;
            } else if (!oPresentationVariant.GroupBy.Collection) {
                return result;
            } else {
                groupByList = oPresentationVariant.GroupBy.Collection;
            }

            var propVal;
            each(groupByList, function () {

                propVal = getLabelForEntityProperty(metaModel, oEntityType, this.PropertyPath);
                if (!propVal) {
                    return;
                }

                result += propVal;
                result += ", ";
            });
            if (result[result.length - 1] === " " && result[result.length - 2] === ",") {
                result = result.substring(0, result.length - 2);
            }
            return result == "" ? "" : OvpResources.getText("By", [result]);
        }

        /*
         * returns the string for the filter-by values of the KPI Header
         * */
        function formTheFilterByString(iContext, oSelectionVariant, aAllSelVar) {
            var bAppend = true;
            var lastFilterIndex = aAllSelVar["SelectOptions"].length - 1;
            if (oSelectionVariant.PropertyName.PropertyPath === aAllSelVar["SelectOptions"][lastFilterIndex].PropertyName.PropertyPath) {
                bAppend = false;
            }

            oSelectionVariant = [oSelectionVariant];
            var oCardPropsModel = iContext.getSetting('ovpCardProperties');
            var oEntityType = oCardPropsModel.getProperty("/entityType");
            var oMetaModel = oCardPropsModel.getProperty("/metaModel");
            var aFilters = getFilters(oCardPropsModel, oSelectionVariant);
            if (aFilters.length == 0) {
                return "";
            }
            var sProp;
            var sTextPropKey;

            //Clean from Filter array all the filters with sap-text that the filter array contains there sap-text
            sProp = aFilters[0].path;
            sTextPropKey = getTextPropertyForEntityProperty(oMetaModel, oEntityType, sProp);

            //Check if there is sap-text, in case there is checks that the Filter array contains it
            if (sTextPropKey !== sProp) {
                return "";
            }

            // check the datatype of filter
            var propertyType = oMetaModel.getODataProperty(oEntityType, oSelectionVariant[0].PropertyName.PropertyPath)["type"];
            // build the filter string
            var sFilter = generateStringForFilters(aFilters, propertyType);
            if (bAppend === true) {
                return sFilter + ", ";
            }
            return sFilter;
        }

        formTheFilterByString.requiresIContext = true;

        function formTheFilterByStringNotFromSelVar(iContext, oFilter, aFilters) {
            var bAppend = !(oFilter.index === (aFilters.length - 1));
            var oCardPropsModel = iContext.getSetting('ovpCardProperties');
            var oMetaModel = oCardPropsModel.getProperty("/metaModel");
            var oEntityType = oCardPropsModel.getProperty("/entityType");
            var propertyType = oMetaModel.getODataProperty(oEntityType, aFilters[oFilter.index].path)["type"];
            // build the filter string
            var sFilter = generateStringForFilters([aFilters[oFilter.index]], propertyType);
            if (bAppend === true) {
                return sFilter + ", ";
            }
            return sFilter;
        }

        formTheFilterByStringNotFromSelVar.requiresIContext = true;

        function formTheIdForFilter(oSelectionVariant) {
            return oSelectionVariant.id;
        }

        function formTheIdForFilterNotFromSelVar(oFilter) {
            return oFilter.id;
        }

        /************************ METADATA PARSERS ************************/

        function generateStringForFilters(aFilters, propertyType) {
            var aFormatterFilters = [];

            for (var i = 0; i < aFilters.length; i++) {
                aFormatterFilters.push(generateSingleFilter(aFilters[i], propertyType));
            }

            return aFormatterFilters.join(', ');
        }

        function generateSingleFilter(oFilter, propertyType) {
            var bNotOperator = false;
            var sFormattedFilter, dateFormatInstance = DateFormat.getInstance({'style': 'medium'});

            if (propertyType === 'Edm.DateTime') {
                sFormattedFilter = dateFormatInstance.format(new Date(oFilter.value1));
            } else if (propertyType === 'Edm.DateTimeOffset') {
                sFormattedFilter = dateFormatInstance.format(new Date(oFilter.value1), true);
            } else {
                sFormattedFilter = oFilter.value1;
            }
            if (oFilter.operator[0] === "N") {
                bNotOperator = true;
            }

            if (oFilter.value2) {
                if (propertyType === 'Edm.DateTime') {
                    sFormattedFilter += " - " + dateFormatInstance.format(new Date(oFilter.value1));
                } else if (propertyType === 'Edm.DateTimeOffset') {
                    sFormattedFilter += " - " + dateFormatInstance.format(new Date(oFilter.value1), true);
                } else {
                    sFormattedFilter += " - " + oFilter.value1;
                }
            }

            if (bNotOperator) {
                sFormattedFilter = OvpResources.getText("kpiHeader_Filter_NotOperator", [sFormattedFilter]);
            }

            return sFormattedFilter;
        }

        /* Returns column name that contains the unit for the measure */
        // function getUnitColumn(measure, oEntityType) {
        // 	var tempUnit, properties = oEntityType.property;
        // 	for (var i = 0, len = properties.length; i < len; i++) {
        // 		if (properties[i].name == measure) {
        //               if (properties[i].hasOwnProperty("Org.OData.Measures.V1.ISOCurrency")) { //as part of supporting V4 annotation
        //                   return properties[i]["Org.OData.Measures.V1.ISOCurrency"].Path ? properties[i]["Org.OData.Measures.V1.ISOCurrency"].Path : properties[i]["Org.OData.Measures.V1.ISOCurrency"].String;
        //               } else if (properties[i].hasOwnProperty("Org.OData.Measures.V1.Unit")) {
        //                   tempUnit = properties[i]["Org.OData.Measures.V1.Unit"].Path ? properties[i]["Org.OData.Measures.V1.Unit"].Path : properties[i]["Org.OData.Measures.V1.Unit"].String;
        //                   if (tempUnit && tempUnit != "%") {
        //                       return tempUnit;
        //                   } else {
        //                       return null;
        //                   }
        //               } else if (properties[i].hasOwnProperty("sap:unit")) {
        //                   return properties[i]["sap:unit"];
        //               }
        // 			break;
        // 		}
        // 	}
        // 	return null;
        // }

        function getLabelForEntityProperty(oMetadata, oEntityType, sPropertyName) {
            return getAttributeValueForEntityProperty(oMetadata, oEntityType,
                sPropertyName, "com.sap.vocabularies.Common.v1.Label");
        }

        function getTextPropertyForEntityProperty(oMetamodel, oEntityType, sPropertyName) {
            return getAttributeValueForEntityProperty(oMetamodel, oEntityType,
                sPropertyName, "sap:text");
        }

        function getAttributeValueForEntityProperty(oMetamodel, oEntityType, sPropertyName, sAttributeName) {
            var oProp = oMetamodel.getODataProperty(oEntityType, sPropertyName);
            if (!oProp) {
                Log.error("No Property Found for with Name '" + sPropertyName + " For Entity-Type '" + oEntityType.name + "'");
                return;
            }
            var oPropAttVal = oProp[sAttributeName];
            if (oPropAttVal) {
                if (sAttributeName === "com.sap.vocabularies.Common.v1.Label") {
                    return oPropAttVal.String;
                }
                return oPropAttVal;
            }

            return oProp.name;
        }

        // Get Aggregation number for aria-label in the KPI cards
        function getKPIHeaderAggregateNumber(dataPoint) {
            if (!dataPoint || !dataPoint.Value || !dataPoint.Value.Path) {
                return "";
            }
            return "{parts: [{path:'" + dataPoint.Value.Path + "'}], formatter: 'sap.ovp.cards.AnnotationHelper.KpiValueFormatter'}";
        }

        //The returned attributes can be used outside this file using namespace sap.ovp.cards.Annotationhelper
        return {
            NumberFormatFunctions: NumberFormatFunctions,
            DateFormatFunctions: DateFormatFunctions,
            CurrencyFormatFunctions: CurrencyFormatFunctions,
            formatFunctions: formatFunctions,
            criticalityConstants: criticalityConstants,
            TextArrangementType: TextArrangementType,
            // formatterGeo: formatterGeo,
            // criticalityType: criticalityType,
            // getCriticalityStateFromValue: getCriticalityStateFromValue,
            getLabelForDataItem: getLabelForDataItem,
            colorPaletteForComparisonMicroChart: colorPaletteForComparisonMicroChart,
            formatField: formatField,
            checkFilterPreference: checkFilterPreference,
            formatItems: formatItems,
            getCardSelections: getCardSelections,
            getCardSorters: getCardSorters,
            getFilters: getFilters,
            getPrimitiveValue: getPrimitiveValue,
            getAnnotationLabel: getAnnotationLabel,
            getApplicationName: getApplicationName,
            removeDuplicateDataField: removeDuplicateDataField,
            formatUrl: formatUrl,
            getDataPointsCount: getDataPointsCount,
            getFirstDataPointValue: getFirstDataPointValue,
            getFirstDataFieldName: getFirstDataFieldName,
            getSecondDataFieldName: getSecondDataFieldName,
            getRequestFields: getRequestAtLeastFields,
            getThirdDataFieldName: getThirdDataFieldName,
            formatDataFieldValueOnIndex: formatDataFieldValueOnIndex,
            formatDataPointValueOnIndex: formatDataPointValueOnIndex,
            formatDataPointOrField: formatDataPointOrField,
            formatsemanticObjectOfDataFieldGeneric: formatsemanticObjectOfDataFieldGeneric,
            getLabelForFirstDataPoint: getLabelForFirstDataPoint,
            formatImageUrl: formatImageUrl,
            formatUnit: formatUnit,
            formatObjectNumber: formatObjectNumber,
            formatFirstDataPointState: formatFirstDataPointState,
            formatFirstDataPointColor: formatFirstDataPointColor,
            formatSecondDataPointState: formatSecondDataPointState,
            formatThirdDataPointState: formatThirdDataPointState,
            formatFirstDataPointStateForSmartField: formatFirstDataPointStateForSmartField,
            formatKPIHeaderState: formatKPIHeaderState,
            isFirstDataPointCriticality: isFirstDataPointCriticality,
            isFirstDataPointCriticalityForTableStatus: isFirstDataPointCriticalityForTableStatus,
            getSortedDataFields: getSortedDataFields,
            getSortedDataPoints: getSortedDataPoints,
            formatDataFieldValueGeneric: formatDataFieldValueGeneric,
            formatDataPointValue: formatDataPointValue,
            formatDataPointStateGeneric: formatDataPointStateGeneric,
            checkCriticalityGeneric: checkCriticalityGeneric,
            checkCriticalityGenericForTableStatus: checkCriticalityGenericForTableStatus,
            formatDataPointStateForSmartFieldGeneric: formatDataPointStateForSmartFieldGeneric,
            hasActions: hasActions,
            isFirstDataPointPercentageUnit: isFirstDataPointPercentageUnit,
            resolveEntityTypePath: resolveEntityTypePath,
            resolveParameterizedEntitySet: resolveParameterizedEntitySet,
            getAssociationObject: getAssociationObject,
            semanticObjectOfFirstDataField: semanticObjectOfFirstDataField,
            semanticObjectOfSecondDataField: semanticObjectOfSecondDataField,
            isFirstContactAnnotation: isFirstContactAnnotation,
            getAggregateNumber: getAggregateNumber,
            KpiValueFormatter: KpiValueFormatter,
            kpiValueCriticality: kpiValueCriticality,
            formThePathForAggregateNumber: formThePathForAggregateNumber,
            formThePathForTrendIcon: formThePathForTrendIcon,
            formPathForPercentageChange: formPathForPercentageChange,
            TargetValueFormatter: TargetValueFormatter,
            formPathForTargetValue: formPathForTargetValue,
            returnPercentageChange: returnPercentageChange,
            isPresentationVarientPresent: isPresentationVarientPresent,
            listGroupBy: listGroupBy,
            formTheFilterByString: formTheFilterByString,
            formTheFilterByStringNotFromSelVar: formTheFilterByStringNotFromSelVar,
            formTheIdForFilter: formTheIdForFilter,
            formTheIdForFilterNotFromSelVar: formTheIdForFilterNotFromSelVar,
            _criticality2state: criticality2state,
            _calculateCriticalityState: calculateCriticalityState,
            _calculateTrendDirection: calculateTrendDirection,
            _getPropertiesFromBindingString: getPropertiesFromBindingString,
            sortCollectionByImportance: sortCollectionByImportance,
            checkNavTargetForContactAnno: checkNavTargetForContactAnno,
            checkForContactAnnotation: checkForContactAnnotation,
            getKPIHeaderAggregateNumber: getKPIHeaderAggregateNumber
        };
    },
    /* bExport= */true);
