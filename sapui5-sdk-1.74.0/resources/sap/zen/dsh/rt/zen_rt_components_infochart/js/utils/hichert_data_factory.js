/* global define */

define("zen.rt.components.infochart/js/utils/hichert_data_factory", ["underscore"],
    function(_) {

        "use strict";

        function transformData(flatData, enrichData) {
            if (!enrichData) {
                return flatData;
            }

            var hichertfallTypeData = {
                data: [],
                metadata: []
            };

            hichertfallTypeData.metadata = flatData.metadata;
            hichertfallTypeData.metadata.fields.push({
                "id" : "Version",
                "name" : "Version",
                "semanticType" : "Dimension",
                "type" : "Dimension",
                "dataType" : "String"
            });

            withEnrichDataTransform(flatData, enrichData, hichertfallTypeData);

            return hichertfallTypeData;
        }

        function withEnrichDataTransform(flatData, enrichData, hichertfallTypeData) {
            var isForecast = false,
                checkDimIndex;

            _.find(flatData.metadata.fields,function(field, index){
                if(field.id === enrichData.dimension) {
                    checkDimIndex = index;
                    return true;
                }
            });

            _.each(flatData.data, function(data) {
                var newData = _.clone(data);

                //if delimiter has been found, don't go through this loop.
                if(!isForecast) {
                    isForecast = _.some(data, function(value, index) {
                        return findMemberDelimiter(value, index, checkDimIndex, enrichData.member);
                    });
                }

                if(!isForecast) {
                    newData.push({"v":"AC","d":"ACTUALS"});
                }
                else {
                    newData.push("FC");
                }
                hichertfallTypeData.data.push(newData);
            });
        }

        //found delimiter separate position.
        function findMemberDelimiter(memberValue, dimIndex, delimiterDimIndex, delimiterMemberValue) {
            var checkedValue = _.isObject(memberValue) ? memberValue.v : memberValue;

            //if the data dimension index is same to delimiter index, and
            //delimiter member not set or it equals to current dimension member
            //set isForecast to true.

            return (dimIndex === delimiterDimIndex
                    && (!delimiterMemberValue || checkedValue === delimiterMemberValue));
        }


        function isNeeded(chartType) {
            var allowedTypes = ["info/hichert_bar", "info/hichert_column"];

            return _.indexOf(allowedTypes, chartType) >= 0;
        }

        return {
            "transformData": transformData,
            "isNeeded": isNeeded
        };
    });
