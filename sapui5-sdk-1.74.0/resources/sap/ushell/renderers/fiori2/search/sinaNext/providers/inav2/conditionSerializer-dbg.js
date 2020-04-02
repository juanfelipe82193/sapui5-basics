// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../sina/ComplexCondition', '../../sina/ComparisonOperator', './typeConverter'], function (core, ComplexCondition, ComparisonOperator, typeConverter) {
    "use strict";

    var ConditionSerializer = core.defineClass({

        _init: function (dataSource) {
            this.dataSource = dataSource;
        },

        convertSinaToInaOperator: function (sinaOperator) {
            switch (sinaOperator) {
            case ComparisonOperator.Eq:
                return '=';
            case ComparisonOperator.Lt:
                return '<';
            case ComparisonOperator.Gt:
                return '>';
            case ComparisonOperator.Le:
                return '<=';
            case ComparisonOperator.Ge:
                return '>=';
            case ComparisonOperator.Co:
                return '=';
            case ComparisonOperator.Bw:
                return '=';
            case ComparisonOperator.Ew:
                return '=';
            default:
                throw new core.Exception('unknow comparison operator ' + sinaOperator);
            }
        },

        serializeComplexCondition: function (condition) {
            var result = {
                Selection: {
                    Operator: {
                        Code: condition.operator,
                        SubSelections: []
                    }
                }
            };
            var subConditions = condition.conditions;
            for (var i = 0; i < subConditions.length; ++i) {
                var subCondition = subConditions[i];
                result.Selection.Operator.SubSelections.push(this.serialize(subCondition));
            }
            return result;
        },

        serializeSimpleCondition: function (condition) {

            if (!condition.value) {
                return undefined;
            }

            // get type of attribute in condition
            var attributeId = condition.attribute;
            var type;
            if (attributeId.slice(0, 2) === '$$') {
                type = this.dataSource.sina.AttributeType.String;
            } else {
                var metadata = this.dataSource.getAttributeMetadata(attributeId);
                type = metadata.type;
            }

            // set operand
            var operand = 'MemberOperand';
            if (attributeId === '$$SuggestionTerms$$' || attributeId === '$$SearchTerms$$') {
                operand = 'SearchOperand';
            }

            // assemble condition
            var result = {};
            result[operand] = {
                AttributeName: attributeId,
                Comparison: this.convertSinaToInaOperator(condition.operator),
                Value: typeConverter.sina2Ina(type, condition.value, {
                    operator: condition.operator
                })
            };
            return result;
        },

        serialize: function (condition) {
            if (condition instanceof ComplexCondition) {
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
