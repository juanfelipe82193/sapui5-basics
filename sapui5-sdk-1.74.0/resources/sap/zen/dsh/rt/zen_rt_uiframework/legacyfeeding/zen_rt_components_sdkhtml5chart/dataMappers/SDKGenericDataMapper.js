/*global _, $, sap */

define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKGenericDataMapper",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKChartDataMapper",
     "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException"],
    function(SDKChartDataMapper, ChartException) {


function SDKGenericDataMapper () {
    "use strict";

    SDKChartDataMapper.apply(this, arguments);

    this.createAnalysisAxis = function (data) {

        var expandedRowTuples = new ExpandedTuples(this, data, false);
        var expandedColumnTuples = new ExpandedTuples(this, data, true);
        var rowAxisData = expandedRowTuples.toAnalysisAxisData();
        var columnAxisData = expandedColumnTuples.toAnalysisAxisData();

        var emptyAxisData = [
            {
                "name": "",
                "type": "Dimension",
                "values": [""]
            }
        ];


        var analysisAxis = [];

        var aaDimensionInfo = getAaDimensionInfo(this, data);

        if (!aaDimensionInfo.isAa1DimensionRequired) {

            //These cases cover Scatter / Bubble chart types
            analysisAxis = [];
            if (rowAxisData.length) {
                analysisAxis.push({
                    index: 1,
                    data: rowAxisData
                });
            }
            if (columnAxisData.length) {
                analysisAxis.push({
                    index: analysisAxis.length + 1,
                    data: columnAxisData
                });
            }

            if (analysisAxis.length === 0) {
                analysisAxis = [
                    {
                        index: 1,
                        data: emptyAxisData
                    }
                ];
            }

        } else if (columnAxisData.length === 0 && this.getMeasureAxis() === "COLUMNS") {
            // Special case to move the rows to the columns axis
            analysisAxis = [
                {
                    index: 1,
                    data: rowAxisData.length ? rowAxisData : emptyAxisData
                }
            ];
        } else {
            analysisAxis = [
                {
                    index: 1,
                    data: columnAxisData.length ? columnAxisData : emptyAxisData
                }
            ];

            if (rowAxisData.length) {
                analysisAxis.push({
                    index: 2,
                    data: rowAxisData
                });
            } else if (aaDimensionInfo.isAa2DimensionRequired) {
                //If there is an aa2 dimension required, but no aa2 data exists in the data set, put in empty data.
                analysisAxis.push({
                    index: 2,
                    data: emptyAxisData
                });
            }
        }

        return analysisAxis;
    };


    this.createMeasureValues = function (data, analysisAxis) {
        var measureObjects = [];
        var utilsHelper = this.getUtilsHelper();
        var measuresDimensionIndex = this.indexOfMeasuresDimension(data.dimensions);
        var measuresDimension = data.dimensions[measuresDimensionIndex];
        var newChartOptionsProperties = data.newChartOptionsProperties;
        var that = this;

        if (data.externalDimensions !== undefined && this.indexOfMeasuresDimension(data.externalDimensions) !== -1) {

            var externalMeasuresDimension = data.externalDimensions[this.indexOfMeasuresDimension(data.externalDimensions)];
            measureObjects.push({
                type: "Measure",
                name: externalMeasuresDimension.members[0].text,
                values: to2dArray(data.data.slice(0), analysisAxis[0].data[0].values.length),
                key: externalMeasuresDimension.members[0].key
            });
        } else if (data.data && data.data.length > 0 && measuresDimension.isFake) {
            measureObjects.push({
                type: "Measure",
                name: "",
                values: to2dArray(data.data.slice(0), analysisAxis[0].data[0].values.length),
                key: ""
            });
        } else {
            var measuresDimensionMembers = createMeasuresDimensionMembers(data, measuresDimension, measuresDimensionIndex);
            var measureKeys = measuresDimensionMembers.map(function (mdm) {
                return mdm.key;
            });
            var allChartOptionsMeasures = utilsHelper.allChartOptionsMeasures(newChartOptionsProperties);


            for (var i = 0; i < allChartOptionsMeasures.length; i++) {
                if (($.inArray(allChartOptionsMeasures[i], measureKeys) <= -1)) {
                    throw new ChartException(data.messages.feedingerror, "");
                }
            }


            measuresDimensionMembers.forEach(function (member) {
                measureObjects.push({
                    type: "Measure",
                    name: member.text,
                    values: [],
                    key: member.key,
                    initialIndex: member.initialIndex
                });
            });

            var expandedRowTuples = new ExpandedTuples(this, data, false);
            var expandedColumnTuples = new ExpandedTuples(this, data, true);
            var aaDimensionInfo = getAaDimensionInfo(this, data);

            var maxRowWidth = 0;
            data.data.forEach(function (value, i) {
                var tuple = data.tuples[i];
                var rowIndex = expandedRowTuples.getIndexOnAxis(tuple);
                var columnIndex = expandedColumnTuples.getIndexOnAxis(tuple);
                var measureIndex = tuple[measuresDimensionIndex];
                var measureObject = _.findWhere(measureObjects, { "initialIndex": measureIndex });
                var tmpRowIndex;

                if (expandedColumnTuples.isEmpty() && that.getMeasureAxis() === "COLUMNS") {
                    /*
                     * Special case.
                     * If there are no column dimensions then the measures go on the rows.
                     * XXX: This feels like a hack.
                     */
                    columnIndex = rowIndex;
                    rowIndex = 0;
                } else if (!aaDimensionInfo.isAa1DimensionRequired && !expandedRowTuples.isEmpty()) {
                    // Special case for bubble and scatter
                    tmpRowIndex = rowIndex;
                    rowIndex = columnIndex;
                    columnIndex = tmpRowIndex;
                }

                measureObject.values[rowIndex] =
                    measureObject.values[rowIndex] || [];
                measureObject.values[rowIndex][columnIndex] = value;

                maxRowWidth = Math.max(maxRowWidth, measureObject.values[rowIndex].length);
            });

            // Make sure all measure arrays are the same length
            _.forEach(measureObjects, function (measureObject) {
                measureObject.values = _.map(measureObject.values, function (valArr) {
                    var populatedArray = valArr || [];
                    for (var i = 0; i < maxRowWidth; i++) {
                        if (populatedArray.length <= i) {
                            populatedArray.push(null);
                        } else if (populatedArray[i] === undefined) {
                            populatedArray[i] = null;
                        }
                    }
                    return populatedArray;
                });
            });
        }

        var feedsArray = utilsHelper.getMetadataFeedsArray(data.cvomType, "Measure");

        //sort & filter measures based on user's selection
        //get the feeds and loop over measures picked
        //Add each in order user specified
        var userSelectedMeasures = [];
        if (allChartOptionsMeasures && !utilsHelper.isChartFeedsEmpty(newChartOptionsProperties)) {
            for (i = 0; i < allChartOptionsMeasures.length; i++) {
                var measureIdx = $.inArray(allChartOptionsMeasures[i], measureKeys);
                userSelectedMeasures.push(measureObjects[measureIdx]);
            }
            if (userSelectedMeasures.length > 0) {
                measureObjects = userSelectedMeasures;
            }
        }

        var measureAxis = this.getMeasureAxis();
        var shortMsg = this.getMessages().chart_mapping_error + "."; // Full-stop is expected
        if (data.cvomType === "viz/scatter" && measureObjects.length < 2) {
            // Scatter chart must have at least two measures
            if (measureAxis === "COLUMNS")
                throw new ChartException(shortMsg, this.getMessages().scatter_datamapping_cmd);
            else
                throw new ChartException(shortMsg, this.getMessages().scatter_datamapping_rmd);
        }
        if (data.cvomType === "viz/bubble" && measureObjects.length < 3) {
            // Bubble chart must have at least three measures
            if (measureAxis === "COLUMNS")
                throw new ChartException(shortMsg, this.getMessages().bubble_datamapping_cmd);
            else
                throw new ChartException(shortMsg, this.getMessages().bubble_datamapping_rmd);
        }

        var axisMapping;
        if (data.dualAxis) {
            //check measures are on rows
            var longMsg;
            if (this.getMeasureAxis() == "COLUMNS") {
                var chartType = data.cvomType;
                if (chartType == "viz/dual_line")
                    longMsg = this.getMessages().dualline_datamapping_tmd;
                if (chartType == "viz/dual_column" || chartType == "viz/dual_combination")
                    longMsg = this.getMessages().dualcolumn_datamapping_tmd;
                if (chartType == "viz/dual_horizontal_combination")
                    longMsg = this.getMessages().dualhorizontal_datamapping_tmd;
                if (chartType == "viz/dual_bar")
                    longMsg = this.getMessages().dualbar_datamapping_tmd;
            }
            if ((longMsg !== undefined) && (!data.newChartOptionsProperties || !data.newChartOptionsProperties.feeds)) {
                throw new ChartException(shortMsg, longMsg);
            }

            axisMapping = data.dualAxis;
        } else if (data.newChartOptionsProperties && data.newChartOptionsProperties.feeds) {
            axisMapping = this.generateAxisMapping(data.newChartOptionsProperties.feeds, feedsArray);
        }

        var deleteInitialIndex = _.partial(_.omit, _, "initialIndex");
        measureObjects = _.map(measureObjects, deleteInitialIndex);

        if (axisMapping) {
            return this.groupMeasureObjectsByAxisMapping(measureObjects, axisMapping, feedsArray);
        } else {
            return this.groupMeasureObjectsAutomatically(measureObjects, feedsArray);
        }
    };

    this.groupMeasureObjectsAutomatically = function (measureObjects, feedsArray) {
        var mvgGroup = [];
        for (var i = 0; i < feedsArray.length; i++) {
            var mvgData = [];
            if (feedsArray.length !== i + 1) {
                //in all but the last feed that needs to be filled, fill with the minimum number of values, or 1 if the minimum is zero
                while (measureObjects.length && mvgData.length < (feedsArray[i].min || 1)) {
                    mvgData.push(measureObjects.shift());
                }
            } else {
                //in the last feed, fill all of the rest of the measures until the feed has hit the max number of measures, or the measure runs out;
                while (measureObjects.length && mvgData.length < (feedsArray[i].max)) {
                    mvgData.push(measureObjects.shift());
                }
            }
            mvgGroup.push({index: i + 1, data: mvgData});
        }
        return mvgGroup;
    };

    this.groupMeasureObjectsByAxisMapping = function (measureObjects, axisMapping, feedsArray) {

        //
        // use feeding to define how many axis there are
        //
        var measureValuesGroup = [];
        for (var x = 0; x < feedsArray.length; x++) {
            measureValuesGroup[feedsArray[x].mgIndex - 1] = {index: feedsArray[x].mgIndex, data: []};
        }

        //This code depends on the measureValuesGroup list being ordered by the mgIndex property
        for (var i = 0; i < axisMapping.length && i < measureObjects.length; i++) {

            var member = measureObjects[i];
            var currentAxisMapping = axisMapping[i];

            if (typeof currentAxisMapping !== "string") {
                currentAxisMapping = currentAxisMapping[1];
            }
            var index = currentAxisMapping.slice(currentAxisMapping.length - 1);
            index = index - 1; //zero based for the mvg array...
            measureValuesGroup[index].data.push(
                {name: member.name, type: member.type, values: member.values});
        }
        return measureValuesGroup;
    };

    this.indexOfMeasuresDimension = function (dimensions) {
        for (var i = 0; i < dimensions.length; i++) {
            var dimension = dimensions[i];
            if (dimension.containsMeasures === true) {
                return i;
            }
        }
        return -1;
    };

    this.generateAxisMapping = function (genericFeeds, feedsArray) {
        var axisObjectsArray = [];
        var axisObjectsBins = [];

        for (var feeds in genericFeeds) {
            for (var i = 0; i < genericFeeds[feeds].length; i++) {
                for (var j = 0; j < feedsArray.length; j++) {
                    if (feedsArray[j].id == feeds || feedsArray[j].id == feeds.replace(/_/g, ".")) {
                        axisObjectsBins.push(
                            {index : feedsArray[j].mgIndex,
                            axisArray : ["stub", "axis" + feedsArray[j].mgIndex, genericFeeds[feeds][i]]
                        });
                    }
                }
            }
        }

        axisObjectsBins = _.sortBy(axisObjectsBins, 'index');
        _.forEach(axisObjectsBins, function (axisObj){
           axisObjectsArray.push(axisObj.axisArray); 
        });

        return axisObjectsArray;
    };

    function createMeasuresDimensionMembers(data, measuresDimension, measuresDimensionIndex) {
        var measuresDimensionMembers = [],
            alreadySeenMembers = {},
            axisKeys;

        if (measuresDimension.axis === "ROWS") {
            axisKeys = data.axis_rows;
        } else {
            axisKeys = data.axis_columns;
        }

        axisKeys.forEach(function (axisKey) {
            var member = measuresDimension.members[axisKey[measuresDimensionIndex]],
                memberClone;
            if (!alreadySeenMembers[member.key]) {
                memberClone = _.clone(member);
                memberClone.initialIndex = axisKey[measuresDimensionIndex];
                measuresDimensionMembers.push(memberClone);
                alreadySeenMembers[member.key] = true;
            }
        });
        return measuresDimensionMembers;
    }

    function to2dArray(arr, width) {
        var splitValues = [];
        while (arr.length) {
            splitValues.push(arr.splice(0, width));
        }
        return splitValues;
    }

    function getAaDimensionInfo(mapper, data) {
        var dimensionFeedsArray = mapper.getUtilsHelper().getMetadataFeedsArray(data.cvomType, "Dimension");
        var aa1Dimension;
        var aa2Dimension;

        for (var i = 0; i < dimensionFeedsArray.length; i++) {
            if (dimensionFeedsArray[i].aaIndex === 1) {
                aa1Dimension = dimensionFeedsArray[i];
            }

            if (dimensionFeedsArray[i].aaIndex === 2) {
                aa2Dimension = dimensionFeedsArray[i];
            }

            if (aa1Dimension !== undefined && aa2Dimension !== undefined) {
                break;
            }
        }


        return {
            "isAa1DimensionRequired": !(aa1Dimension && aa1Dimension.min === 0),
            "isAa2DimensionRequired": aa2Dimension && aa2Dimension.min > 0 // Strange different logic!
        };
    }

    /**
     * Object to store the tuples for an axis and provide convenience
     * methods for accessing them.
     *
     * This will also add in missing measures as null values so that
     * there is the same number of measures for each row/column
     *
     * @param data - The data containing the tuplea
     * @param useColumnTuples - Flag indicating if column or row tuples
     * should be used.
     */
    function ExpandedTuples(mapper, data, useColumnTuples) {
        var axisTuples = useColumnTuples ? data.axis_columns : data.axis_rows;
        var dimensions = data.dimensions;
        var measuresDimensionIndex = mapper.indexOfMeasuresDimension(dimensions);
        var usedMeasures = [];
        var axisDimensions = [];

        if (axisTuples.length) {
            _.forEach(axisTuples[0], function (dimValue, i) {
                if (dimValue != -1 && i != measuresDimensionIndex) {
                    axisDimensions.push(i);
                }
            });
        }

        // Convert the axis tuples to objects that are easier to reason about
        var readableAxisTuples = _.map(axisTuples, toExpandedTuple);

        // Each row or col should have these measures
        usedMeasures = _.uniq(usedMeasures);

        if (usedMeasures.length && readableAxisTuples.length && readableAxisTuples[0].length) {
            var rowColToMeasures = {};

            _.forEach(readableAxisTuples, function (readableAxisTuple) {
                var key = _.pluck(readableAxisTuple, "dimensionIndex");
                rowColToMeasures[key] = rowColToMeasures[key] || [];
                rowColToMeasures[key].push(readableAxisTuple[0].measureIndex);
            });

            // Add in missing measures
            _.forEach(rowColToMeasures, function (measures, rowCol) {
                var diff = _.difference(usedMeasures, measures);
                _.forEach(diff, function (measure) {
                    appendReadableTuple(rowCol, measure);
                });
            });
        }

        /*
         * Sort by dimension index.This would make it more efficient to get rid of duplicates
         * but get rid of the order of the tuples.
         */
        // readableAxisTuples.sort(tupleCompare);

        // Get rid of duplicates
        readableAxisTuples = _.uniq(readableAxisTuples, false /* isSorted */, function (readableAxisTuple) {
            var values = _.pluck(readableAxisTuple, "value");
            return values.toString();
        });

        this.toAnalysisAxisData = function () {
            var data = [];
            _.forEach(readableAxisTuples, function (readableAxisTuple) {
                _.forEach(readableAxisTuple, function (tupleDimensionValue, i) {
                    data[i] = data[i] || {
                        "type": "Dimension",
                        "name": tupleDimensionValue.name,
                        "values": []
                    };
                    data[i].values.push(tupleDimensionValue.dimensionValue.text);
                });
            });
            return data;
        };

        this.getIndexOnAxis = function (rawTuple) {
            // TODO Create a map to prevent this search every time
            var readableTuple = toExpandedTuple(rawTuple);
            var index = -1;
            for (var i = 0; i < readableAxisTuples.length && index === -1; i++) {
                if (tupleEquals(readableTuple, readableAxisTuples[i])) {
                    index = i;
                }
            }
            return index;
        };

        this.isEmpty = function () {
            return !readableAxisTuples.length || !readableAxisTuples[0].length;
        };

        function appendReadableTuple(dimensionIndices, measureIndex) {
            var readableTuple = [];
            _.forEach(dimensionIndices, function (dimensionIndex) {
                readableTuple.push(createReadableTupleValue(null, dimensionIndex, measureIndex));
            });
        }

        function createReadableTupleValue(tupleValue, dimensionIndex, measureIndex) {
            return {
                "dimensionIndex": dimensionIndex,
                "dimensionValue": dimensions[dimensionIndex].members[tupleValue],
                "measureIndex": measureIndex, // TODO Move up
                "name": dimensions[dimensionIndex].text,
                "value": tupleValue
            };
        }

        function tupleEquals(t1, t2) {
            return t1 && t2 && tupleCompare(t1, t2) === 0;
        }

        function tupleCompare(t1, t2) {
            var compare = 0;
            for (var i = 0; i < t1.length && compare === 0; i++) {
                if (t1[i].value < t2[i].value) {
                    compare = -1;
                } else if (t1[i].value > t2[i].value) {
                    compare = 1;
                }
            }
            return compare;
        }

        function toExpandedTuple(rawTuple) {
            var measureIndex = rawTuple[measuresDimensionIndex];
            if (measureIndex >= 0) {
                usedMeasures.push(measureIndex);
            }
            return _.chain(rawTuple)
                .map(function (tupleValue, i) {
                    return createReadableTupleValue(tupleValue, i, measureIndex);
                })
                .filter(function (tupleValue, i) {
                    return _.contains(axisDimensions, i);
                })
                .value();
        }
        }

};

return SDKGenericDataMapper;

});
