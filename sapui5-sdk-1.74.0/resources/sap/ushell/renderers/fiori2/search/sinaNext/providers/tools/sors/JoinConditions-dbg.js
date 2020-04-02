// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */


sinaDefine([
    '../../../core/core',
    './NavigationTargetTemplate'
], function (core, NavigationTargetTemplate) {
    "use strict";

    return core.defineClass({
        _init: function (properties) {
            this.sina = properties.sina;
            this.navigationTargetGenerator = properties.navigationTargetGenerator;
            this.sourceObjectType = properties.sourceObjectType;
            this.targetObjectType = properties.targetObjectType;
            this.conditions = [];
        },
        add: function (condition) {
            this.conditions.push(condition);
        },
        hasDuplicateSemanticObject: function () {
            var map = {};
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                if (map[condition.semanticObjectType]) {
                    return true;
                }
                map[condition.semanticObjectType] = true;
            }
            return false;
        },
        hasDistinctValue: function (semanticObjectType, property) {
            var value;
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                if (condition.semanticObjectType !== semanticObjectType) {
                    continue;
                }
                if (!value) {
                    value = condition[property];
                    continue;
                }
                if (value !== condition[property]) {
                    return false;
                }
            }
            return true;
        },
        generateNavigationTargetTemplates: function () {
            if (this.hasDuplicateSemanticObject()) {
                return this.createSingleConditionsTemplates();
            }
            return this.createMultipleConditionsTemplates();

        },
        createSingleConditionsTemplates: function () {
            var navigationTargetTemplates = [];
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var sourcePropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, 'sourcePropertyName');
                var targetPropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, 'targetPropertyName');
                if (!sourcePropertyNameDistinct && !targetPropertyNameDistinct) {
                    continue;
                }
                var navigationTargetTemplate = new NavigationTargetTemplate({
                    sina: this.sina,
                    navigationTargetGenerator: this.navigationTargetGenerator,
                    label: 'dummy',
                    sourceObjectType: this.sourceObjectType,
                    targetObjectType: this.targetObjectType,
                    conditions: [condition]
                });
                navigationTargetTemplate._condition = condition;
                navigationTargetTemplates.push(navigationTargetTemplate);
            }
            this.assembleSingleConditionTemplateLabels(navigationTargetTemplates);
            return navigationTargetTemplates;
        },
        createMultipleConditionsTemplates: function () {
            return [new NavigationTargetTemplate({
                sina: this.sina,
                navigationTargetGenerator: this.navigationTargetGenerator,
                label: this.navigationTargetGenerator.objectTypeMap[this.targetObjectType].label,
                sourceObjectType: this.sourceObjectType,
                targetObjectType: this.targetObjectType,
                conditions: this.conditions
            })];
        },
        assembleSingleConditionTemplateLabels: function (navigationTargets) {
            // assemble label based on target object and target property
            // collect in navigation target in map with label key
            var targetMap = {};
            var targets, labelKey, navigationTarget, metadata;
            for (var i = 0; i < navigationTargets.length; ++i) {
                navigationTarget = navigationTargets[i];
                metadata = this.navigationTargetGenerator.objectTypeMap[this.targetObjectType];
                labelKey = metadata.label + ' to:' + metadata.propertyMap[navigationTarget._condition.targetPropertyName].label;
                navigationTarget.label = labelKey;
                targets = targetMap[labelKey];
                if (!targets) {
                    targets = [];
                    targetMap[labelKey] = targets;
                }
                targets.push(navigationTarget);
            }
            // assemble final label
            metadata = this.navigationTargetGenerator.objectTypeMap[this.sourceObjectType];
            for (labelKey in targetMap) {
                targets = targetMap[labelKey];
                if (targets.length > 1) {
                    for (var j = 0; j < targets.length; ++j) {
                        navigationTarget = targets[j];
                        navigationTarget.label += ' from:' + metadata.propertyMap[navigationTarget._condition.sourcePropertyName].label;
                    }
                }
            }
        }
    });

});
