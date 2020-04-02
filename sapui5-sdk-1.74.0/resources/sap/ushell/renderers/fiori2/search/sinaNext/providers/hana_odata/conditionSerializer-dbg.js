// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../sina/ComplexCondition', '../../sina/ComparisonOperator', './typeConverter', '../../sina/AttributeType'], function (core, ComplexCondition, ComparisonOperator, typeConverter, AttributeType) {
    "use strict";

    var ConditionSerializer = core.defineClass({

        _init: function (dataSource) {
            this.dataSource = dataSource;
        },

        convertSinaToOdataOperator: function (sinaOperator) {
            switch (sinaOperator) {
            case ComparisonOperator.Eq:
                return ':EQ(S)';
            case ComparisonOperator.Lt:
                return ':LT';
            case ComparisonOperator.Gt:
                return ':GT';
            case ComparisonOperator.Le:
                return ':LE';
            case ComparisonOperator.Ge:
                return ':GE';
            case ComparisonOperator.Co:
                return ':EQ';
            case ComparisonOperator.Bw:
                return ':EQ';
            case ComparisonOperator.Ew:
                return ':EQ';
            case 'And':
                return "AND";
            case 'Or':
                return "OR";
            default:
                throw new core.Exception('unknow comparison operator ' + sinaOperator);
            }
        },

        serializeComplexCondition: function (condition) {
            var result = {
                "Id": 1,
                "OperatorType": this.convertSinaToOdataOperator(condition.operator),
                "SubFilters": []
            };
            var subConditions = condition.conditions;
            for (var i = 0; i < subConditions.length; ++i) {
                var subCondition = subConditions[i];
                result.SubFilters.push(this.serialize(subCondition));
            }

            var resultStr = "";
            if (result.SubFilters.length > 1) {
                resultStr = result.SubFilters.join(' ' + result.OperatorType + ' ');
            } else if (result.SubFilters.length === 1) {
                resultStr = result.SubFilters[0];
            }

            if (result.SubFilters.length > 1) {
                resultStr = '(' + resultStr + ')';
            }
            return resultStr;
        },

        serializeSimpleCondition: function (condition) {
            var metadata;
            var type;
            var conditionObj;

            metadata = this.dataSource.getAttributeMetadata(condition.attribute);
            type = metadata.type;

            var conditionValue = typeConverter.sina2Odata(type, condition.value, {
                operator: condition.operator
            });

            var conditionOperator = this.convertSinaToOdataOperator(condition.operator);

            conditionObj = {
                "ConditionAttribute": condition.attribute,
                "ConditionOperator": conditionOperator,
                "ConditionValue": conditionValue
            };

            // In attribute filters quotemark is necessary for the case string or text contains spaces
            var quotemark4String = '';
            if (type === AttributeType.String || type === AttributeType.Timestamp) {
                quotemark4String = '"';
            }

            var result = '';
            // Attribute value "*" can only be used without EQ part
            // this will be changed on serverside later
            if (type === AttributeType.String && conditionValue.match(/^[*\s]+$/g) !== null && conditionOperator === ':EQ') {
                result += '(' + conditionObj.ConditionAttribute + ':' + quotemark4String + conditionObj.ConditionValue + quotemark4String + ')';
            } else {
                result += '(' + conditionObj.ConditionAttribute + conditionObj.ConditionOperator + ':' + quotemark4String + conditionObj.ConditionValue + quotemark4String + ')';
            }
            return result;
        },

        serializeBetweenCondition: function (condition) {
            var metadata;
            var type;
            // var conditionObj;
            // var valueLow;
            // var valueHigh;

            metadata = this.dataSource.getAttributeMetadata(condition.conditions[0].attribute);
            type = metadata.type;

            // if (condition.conditions[0].operator === "Ge") {
            //     valueLow = condition.conditions[0].value;
            //     valueHigh = condition.conditions[1].value;
            // } else {
            //     valueLow = condition.conditions[1].value;
            //     valueHigh = condition.conditions[0].value;
            // }
            // conditionObj = {
            //     "ConditionAttribute": condition.conditions[0].attribute,
            //     "ConditionOperator": "BT",
            //     "ConditionValue": typeConverter.sina2Odata(type, valueLow),
            //     "ConditionValueHigh": typeConverter.sina2Odata(type, valueHigh)
            // };

            // In attribute filters quotemark is necessary for the case string or text contains spaces
            var quotemark4String = '';
            if (type === AttributeType.Date || type === AttributeType.Time || type === AttributeType.Timestamp) {
                quotemark4String = '"';
            }
            var result = condition.conditions[0].attribute + this.convertSinaToOdataOperator(condition.conditions[0].operator) + ':' + quotemark4String + typeConverter.sina2Odata(type, condition.conditions[0].value, {
                operator: condition.conditions[0].operator
            }) + quotemark4String;
            result += " AND ";
            result += condition.conditions[1].attribute + this.convertSinaToOdataOperator(condition.conditions[1].operator) + ":" + quotemark4String + typeConverter.sina2Odata(type, condition.conditions[1].value, {
                operator: condition.conditions[1].operator
            }) + quotemark4String;
            result = "(" + result + ")";
            return result;
        },

        serialize: function (condition) {
            if (condition instanceof ComplexCondition) {
                if (condition.operator === "And" && condition.conditions.length > 1 && condition.conditions[0] && (condition.conditions[0].operator === "Ge" || condition.conditions[0].operator === "Gt" || condition.conditions[0].operator === "Le" || condition.conditions[0].operator === "Lt")) {
                    return this.serializeBetweenCondition(condition);
                }
                return this.serializeComplexCondition(condition);

            }
            return this.serializeSimpleCondition(condition);

        }

    });

    return {
        serialize: function (dataSource, condition) {
            var serializer = new ConditionSerializer(dataSource);
            return serializer.serialize(condition);
        }
    };

});
