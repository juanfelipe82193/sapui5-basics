/*global define*/

define("zen.rt.components.infochart/js/utils/sdk_data", [
    "underscore",
    "zen.rt.components.infochart/js/utils/info_chart_exception"], function (_, InfoChartException) {

    "use strict";

    function SdkData(rawSdkResultSet) {
        if (!rawSdkResultSet) {
            throw new InfoChartException("mapper.nodata");
        }
        var mergedData = mergeExternalDimensionsAndStructs(rawSdkResultSet);
        this._dimensions = mergedData.dimensions;
        this._measureMembers = mergedData.measureMembers;

        // Store the tuples internally as a tree
        this._tupleTree = _.reduce(mergedData.tuples, function(tree, tuple, tupleIndex) {
            var conditionalFormatValue = rawSdkResultSet.conditionalFormatValues &&
                    rawSdkResultSet.conditionalFormatValues[tupleIndex],
                measureValue = rawSdkResultSet.data[tupleIndex],
                measureMemberKey = mergedData.measureMembers[tuple[mergedData.measureIndex]].key,
                tupleWithoutMeasures = removeIndex(tuple, mergedData.measureIndex),
                dimensionMembers = getDimensionMembers(mergedData.dimensions, tupleWithoutMeasures),
                leaf = {
                    "isLeaf": true,
                    "measures": {}
                };

            leaf.measures[measureMemberKey] = {
                "value": measureValue,
                "index": tupleIndex
            };
            if (conditionalFormatValue) {
                leaf.measures[measureMemberKey].conditionalFormat = _.values(conditionalFormatValue)[0];
            }
            updateLeaf(tree, dimensionMembers, leaf);
            return tree;
        }, {});
    }

    SdkData.prototype.keepDimensions = function(dimensionKeys) {
       var that = this;
       function removeDimensionIfNecessary(dimensionIndex, tupleTree) {
            var levelDimension = that._dimensions[dimensionIndex],
                shouldRemoveDimension = !tupleTree.isLeaf && !_.contains(dimensionKeys, levelDimension.key),
                memberToKeep,
                newTree;
            if (tupleTree.isLeaf) {
                newTree = tupleTree;
            } else if (shouldRemoveDimension) {
                memberToKeep = findFirstPropertyInObject(tupleTree, _.pluck(levelDimension.members, "key"));
                newTree = removeDimensionIfNecessary(dimensionIndex + 1, memberToKeep);
            } else {
                newTree = mapObject(tupleTree, _.partial(removeDimensionIfNecessary, dimensionIndex + 1));
            }
            return newTree;
       }
       // Need to keep the first member of each unused dimension // :S
       this._tupleTree = removeDimensionIfNecessary(0, this._tupleTree);
       // Removed the unused dimensions
       this._dimensions = _.filter(this._dimensions, function(dimension) {
            return _.contains(dimensionKeys, dimension.key);
       });
    };

    function mapObject(obj, mappingFn) {
        var copy = {};
        _.forEach(obj, function(value, name) {
            copy[name] = mappingFn(value);
        });
        return copy;
    }

    function findFirstPropertyInObject(obj, propertyNames) {
        var key = _.find(propertyNames, _.partial(_.has, obj));
        /* 
         * not sure why this statement includes the && for checking the key
         * but if the key is empty then it does not work and the key can be empty for # (undefined in BW)
         */
        //return key && obj[key];
        return obj[key];
    }

    SdkData.prototype.getConditionalFormatValues = function() {
        var that = this,
            conditionalFormatMap = {};
        _.forEach(getTupleArray(this._tupleTree, this._dimensions), function(leaf) {
            _.forEach(leaf.measures, function(measure, measureName) {
                if (measure.conditionalFormat) {
                    var dimensionKeys = _.pluck(that._dimensions, "key"),
                        memberKeys = _.pluck(leaf.tuple, "key"),
                        conditionalFormatValue = _.object(dimensionKeys, memberKeys);
                    conditionalFormatValue[measureName] = measure.value;
                    conditionalFormatMap[measure.conditionalFormat] = conditionalFormatMap[measure.conditionalFormat] || [];
                    conditionalFormatMap[measure.conditionalFormat].push(conditionalFormatValue);
                }
            });
        });
        return conditionalFormatMap;
    };

    SdkData.prototype.toFlatData = function(removeTotals) {
        // XXX We could cache this result
        return {
            "metadata": { "fields": toFlatMetadata(this._dimensions, this._measureMembers) },
            "data": toFlatTupleData(this, !!removeTotals)
        };
    };

    SdkData.prototype.getSDKFormatStrings = function () {
        return _.reduce(this._measureMembers, function (formatStrings, member) {
            if (member.formatString)
                formatStrings[member.key] = member.formatString;
            return formatStrings;
        }, {});
    };

    SdkData.prototype.getMeasuresArray = function(){
        return this._measureMembers;
    };

    function toFlatMetadata(dimensions, measureMembers) {
       var dimensionMetadata = _.map(dimensions, function(d) {
                return {
                    "id": d.key,
                    "name": d.text,
                    "type": "Dimension",
                    "semanticType": "Dimension",
                    "dataType": "String"
                };
            }),
            measuresMetadata = _.map(measureMembers, function(m) {
                return {
                    "id": m.key,
                    "name": m.text,
                    "type": "Measure",
                    "semanticType": "Measure",
                    "dataType": "Number" // XXX Is this always the case?
                };
            });
        return dimensionMetadata.concat(measuresMetadata);
    }

    function toFlatTupleData(sdkData, removeTotals) {
        var flatTupleData = _.map(getTupleArray(sdkData._tupleTree, sdkData._dimensions, removeTotals), function(leaf) {
            var tupleDimensionData = _.map(leaf.tuple, function(dimensionMember) {
                    return {
                        "v": dimensionMember.key,
                        "d": dimensionMember.text
                    };
                }),
                tupleMeasureData = _.map(sdkData._measureMembers, function(measureMember) {
                    var measure = leaf.measures[measureMember.key];
                    if (measure) {
                    	return measure.value;
                    } else {
                    	return null;
                    }
                });
            return tupleDimensionData.concat(tupleMeasureData);
        });
        return flatTupleData;
    }

    /*
     * [{
            isLeaf: true,
            measures: [ {m1: { value: 23 }, m2: {value: 47, conditionalFormat: 2} }],
            tuple: [ {text:t1, key: k1}, {text: t2, key: k2}]
        }]
     */
    function getTupleArray(tupleTree, dimensions, removeTotals) {
        var tupleArray = [],
            currentTuplePath = [],
            addTuples = function(tupleTree, tupleArray, currentTuplePath) {
                if (tupleTree.isLeaf) {
                    tupleTree.tuple = _.map(currentTuplePath, function(memberKey, dimensionIndex) {
                        var member = _.findWhere(dimensions[dimensionIndex].members, { "key": memberKey });
                        tupleTree.containsTotal = tupleTree.containsTotal || member.type === "RESULT";
                        return {
                            "key": memberKey,
                            "text": member.text
                        };
                    });
                    if (!removeTotals || (removeTotals && !tupleTree.containsTotal)) {
                        tupleArray.push(tupleTree);
                    }
                } else {
                    _.forEach(tupleTree, function(childTree, dimensionMemberKey) {
                        addTuples(childTree, tupleArray, currentTuplePath.concat([dimensionMemberKey]));
                    });
                }
            };

        addTuples(tupleTree, tupleArray, currentTuplePath);
        return _.sortBy(tupleArray, function(tuple) {
            var indices = _.pluck(tuple.measures, "index");
            return _.min(indices);
        });
    }

    function updateLeaf(tree, path, leafUpdate) {
        if (path.length === 0) { // We've hit the leaf
            tree.isLeaf = true;
            tree.measures = tree.measures || {};
            _.extend(tree.measures, leafUpdate.measures);
        } else {
            tree[_.head(path)] = tree[_.head(path)] || {};
            updateLeaf(tree[_.head(path)], _.tail(path), leafUpdate);
        }
    }

    function mergeExternalDimensionsAndStructs(rawSdkResultSet) {
        var allDimensions = cloneArray(rawSdkResultSet.dimensions) || [],
            tuples = cloneArray(rawSdkResultSet.tuples) || [],
            externalMeasuresDimension,
            measuresAndDimensions,
            measureIndex,
            measureMembers;
        if(rawSdkResultSet.externalDimensions) {
            // Let's just append the external measures to the standard dimensions
            externalMeasuresDimension = _.findWhere(rawSdkResultSet.externalDimensions, _.property("containsMeasures"));
            if (externalMeasuresDimension) {
                allDimensions = allDimensions.concat(externalMeasuresDimension);
                tuples = _.map(tuples, append0);
            }
        }
        measuresAndDimensions = _.partition(allDimensions, _.property("containsMeasures"));
        measureMembers = measuresAndDimensions[0][0] && measuresAndDimensions[0][0].members;
        // Create the implied measure if none are specified
        if (!measureMembers) {
            measureMembers = [ {"key": " ", "text": " " } ];
            tuples = _.map(tuples, append0);
            measureIndex = allDimensions.length;
        } else {
            measureIndex = findIndex(allDimensions, _.property("containsMeasures"));
        }

        return {
            "dimensions": measuresAndDimensions[1],
            "measureMembers": measureMembers,
            "measureIndex": measureIndex,
            "tuples": tuples
        };
    }

    function getDimensionMembers(dimensions, tupleWithoutMeasures) {
        if (dimensions.length !== tupleWithoutMeasures.length) {
            throw new Error("Tuples do not match dimensions");
        }
        return _.map(tupleWithoutMeasures, function(dimensionMemberIndex, dimensionIndex) {
            return dimensions[dimensionIndex].members[dimensionMemberIndex].key;
        });
    }

    function findIndex(collection, predicate) {
        for (var i = 0; collection && collection.length && i < collection.length; i++) {
            if (predicate(collection[i])) {
                return i;
            }
        }
        return -1;
    }

    function removeIndex(arr, index) {
        var clone = arr.slice(0);
        clone.splice(index, 1);
        return clone;
    }

    function cloneArray(arr) {
        return (arr && arr.slice(0)) || [];
    }

    function append0(arr) {
        return arr.concat(0);
    }

    return SdkData;
});