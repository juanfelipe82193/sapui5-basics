// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', '../core/util', './Condition', './ConditionType'], function (core, util, Condition, ConditionType) {
    "use strict";

    return Condition.derive({

        _meta: {
            properties: {
                operator: {
                    required: false,
                    default: function () {
                        return this.sina.ComparisonOperator.Eq;
                    }
                },
                attribute: {
                    required: true
                },
                value: {
                    required: true
                }
            }
        },

        type: ConditionType.Simple,

        _initClone: function (other) {
            this.operator = other.operator;
            this.attribute = other.attribute;
            this.value = other.value;
        },

        _equals: function (other) {
            if (this.attribute !== other.attribute ||
                this.operator !== other.operator) {
                return false;
            }
            if (this.value.equals) {
                return this.value.equals(other.value.equals);
            }
            if (this.value instanceof Date && other.value instanceof Date) {
                return this.value.getTime() === other.value.getTime();
            }
            return this.value === other.value;
        },

        _getAttribute: function () {
            return this.attribute;
        },

        toJson: function () {
            var jsonValue;
            if (this.value instanceof Date) {
                jsonValue = util.dateToJson(this.value);
            } else {
                jsonValue = this.value;
            }
            var result = {
                type: 'Simple',
                operator: this.operator,
                attribute: this.attribute,
                value: jsonValue,
                valueLabel: this.valueLabel,
                attributeLabel: this.attributeLabel
            };
            if (this.userDefined) {
                result.userDefined = true;
            }
            return result;
        }

    });

});
