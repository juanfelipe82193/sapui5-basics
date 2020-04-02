// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './Condition', './ConditionType'], function (core, Condition, ConditionType) {
    "use strict";

    return Condition.derive({

        _meta: {
            properties: {
                operator: {
                    required: false,
                    default: function () {
                        return this.sina.LogicalOperator.And;
                    }
                },
                conditions: {
                    required: false,
                    default: function () {
                        return [];
                    }
                }
            }
        },

        type: ConditionType.Complex,

        _initClone: function (other) {
            this.operator = other.operator;
            this.conditions = [];
            for (var i = 0; i < other.conditions.length; ++i) {
                this.conditions.push(other.conditions[i].clone());
            }
        },

        _equals: function (other) {
            if (this.operator !== other.operator) {
                return false;
            }
            if (this.conditions.length !== other.conditions.length) {
                return false;
            }
            var matchedOtherConditions = {};
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var match = false;
                for (var j = 0; j < other.conditions.length; ++j) {
                    if (matchedOtherConditions[j]) {
                        continue;
                    }
                    var otherCondition = other.conditions[j];
                    if (condition.equals(otherCondition)) {
                        match = true;
                        matchedOtherConditions[j] = true;
                        break;
                    }
                }
                if (!match) {
                    return false;
                }
            }
            return true;
        },

        addCondition: function (condition) {
            if (!(condition instanceof Condition)) {
                condition = this.sina.createSimpleCondition(condition);
            }
            this.conditions.push(condition);
        },

        removeConditionAt: function (index) {
            this.conditions.splice(index, 1);
        },

        hasFilters: function () {
            return this.conditions.length >= 1;
        },

        removeAttributeConditions: function (attribute) {
            var result = {
                deleted: false,
                attribute: '',
                value: ''
            };
            for (var i = 0; i < this.conditions.length; ++i) {
                var subCondition = this.conditions[i];
                switch (subCondition.type) {
                case ConditionType.Complex:
                    result = subCondition.removeAttributeConditions(attribute);
                    break;
                case ConditionType.Simple:
                    if (subCondition.attribute === attribute) {
                        result = {
                            deleted: true,
                            attribute: subCondition.attribute,
                            value: subCondition.value
                        };
                        this.removeConditionAt(i);
                        i--;
                    }
                    break;
                }
            }
            this.cleanup();
            return result;
        },

        cleanup: function () {
            var removed = false;
            var doCleanup = function (condition) {
                for (var i = 0; i < condition.conditions.length; ++i) {
                    var subCondition = condition.conditions[i];
                    switch (subCondition.type) {
                    case ConditionType.Complex:
                        doCleanup(subCondition);
                        if (subCondition.conditions.length === 0) {
                            removed = true;
                            condition.removeConditionAt(i);
                            i--;
                        }
                        break;
                    case ConditionType.Simple:
                        break;
                    }
                }
            };
            do {
                removed = false;
                doCleanup(this);
            } while (removed);
        },

        resetConditions: function () {
            this.conditions.splice(0, this.conditions.length);
        },

        _getAttribute: function () {
            if (this.conditions.length === 0) {
                return null;
            }
            // just use first condition
            return this.conditions[0]._getAttribute();
        },

        toJson: function () {
            var result = {
                type: 'Complex',
                operator: this.operator,
                conditions: [],
                valueLabel: this.valueLabel,
                attributeLabel: this.attributeLabel
            };
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                result.conditions.push(condition.toJson());
            }
            if (this.userDefined) {
                result.userDefined = true;
            }
            return result;
        }

    });

});
