// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject', './SimpleCondition', './ComplexCondition'], function (core, SinaObject, SimpleCondition, ComplexCondition) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                dataSource: {
                    required: false,
                    default: function () {
                        return this.sina.getAllDataSource();
                    }
                },
                searchTerm: {
                    required: false,
                    default: '',
                    setter: true
                },
                rootCondition: {
                    required: false,
                    default: function () {
                        return this.sina.createComplexCondition();
                    },
                    setter: true
                }
            }
        },

        _initClone: function (other) {
            this.dataSource = other.dataSource;
            this.searchTerm = other.searchTerm;
            this.rootCondition = other.rootCondition.clone();
        },

        _equals: function (other) {
            return this.dataSource === other.dataSource &&
                this.searchTerm === other.searchTerm &&
                this.rootCondition.equals(other.rootCondition);
        },

        _getAttribute: function (condition) {
            if (condition instanceof SimpleCondition) {
                return condition.attribute;
            }
            for (var i = 0; i < condition.conditions.length; ++i) {
                var attribute = this._getAttribute(condition.conditions[i]);
                if (attribute) {
                    return attribute;
                }
            }
        },

        setDataSource: function (dataSource) {
            if (this.dataSource === dataSource) {
                return;
            }
            this.dataSource = dataSource;
            this.resetConditions();
        },

        resetConditions: function () {
            this.rootCondition.resetConditions();
        },

        autoInsertCondition: function (condition) {

            // consistency check
            if (!(this.rootCondition instanceof ComplexCondition)) {
                throw new core.Exception('cannot auto insert condition - condition is not a complex condition');
            }

            // identify complex condition which is responsible for the attribute -> matchCondition
            var attribute = this._getAttribute(condition);
            var matchCondition, currentCondition;
            for (var i = 0; i < this.rootCondition.conditions.length; ++i) {
                currentCondition = this.rootCondition.conditions[i];
                var currentAttribute = this._getAttribute(currentCondition);
                if (currentAttribute === attribute) {
                    matchCondition = currentCondition;
                    break;
                }
            }

            // if there is no matchCondition -> create
            if (!matchCondition) {
                matchCondition = this.sina.createComplexCondition({
                    operator: this.sina.LogicalOperator.Or
                });
                this.rootCondition.addCondition(matchCondition);
            }

            // prevent duplicate conditions
            for (var j = 0; j < matchCondition.conditions.length; ++j) {
                currentCondition = matchCondition.conditions[j];
                if (currentCondition.equals(condition)) {
                    return;
                }
            }

            // add condition
            matchCondition.addCondition(condition);

        },

        autoRemoveCondition: function (condition) {

            // helper
            var removeCondition = function (complexCondition, condition) {
                for (var i = 0; i < complexCondition.conditions.length; ++i) {
                    var subCondition = complexCondition.conditions[i];

                    if (subCondition.equals(condition)) {
                        complexCondition.removeConditionAt(i);
                        i--;
                        continue;
                    }

                    if (subCondition instanceof ComplexCondition) {
                        removeCondition(subCondition, condition);
                        if (subCondition.conditions.length === 0) {
                            complexCondition.removeConditionAt(i);
                            i--;
                            continue;
                        }
                    }
                }
            };

            // remove
            removeCondition(this.rootCondition, condition);

        },

        toJson: function () {
            return {
                dataSource: this.dataSource.toJson(),
                searchTerm: this.searchTerm,
                rootCondition: this.rootCondition.toJson()
            };
        }

    });

});
