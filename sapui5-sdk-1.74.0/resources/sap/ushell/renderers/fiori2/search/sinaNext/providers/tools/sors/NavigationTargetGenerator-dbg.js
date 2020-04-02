// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */

sinaDefine([
    '../../../core/core',
    '../../../core/util',
    '../../../sina/SinaObject',
    './JoinConditions'
], function (core, util, SinaObject, JoinConditions) {
    "use strict";

    return SinaObject.derive({

        _init: function (properties) {
            this.active = this.checkActive();
            this.getPropertyMetadata = properties.getPropertyMetadata;
            this.urlPrefix = properties.urlPrefix;
            this.navigationTargetTemplatesInitialized = false;
            this.navigationTargetTemplatesMap = {};
            this.objectTypeMap = {};
            this.ignoredSemanticObjectTypes = {
                LastChangedByUser: true,
                CreationDate: true,
                CreatedByUser: true
            };
        },

        checkActive: function () {
            var sors = util.getUrlParameter('sors');
            if (sors === 'true') {
                return true;
            }
            return false;
        },

        cleanup: function () {
            this.objectTypeMap = null;
        },

        registerObjectType: function (objectTypeMetadata) {
            if (!this.active) {
                return;
            }
            var metadata = {
                type: objectTypeMetadata.type,
                label: objectTypeMetadata.label,
                propertyMap: {}
            };
            this.objectTypeMap[objectTypeMetadata.type] = metadata;
            for (var i = 0; i < objectTypeMetadata.properties.length; ++i) {
                var property = objectTypeMetadata.properties[i];
                var propertyMetadata = this.getPropertyMetadata(property);
                this.filterSemanticObjectType(propertyMetadata);
                metadata.propertyMap[propertyMetadata.name] = propertyMetadata;
            }
        },

        filterSemanticObjectType: function (property) {
            if (this.ignoredSemanticObjectTypes[property.semanticObjectType]) {
                delete property.semanticObjectType;
            }
        },

        finishRegistration: function () {
            if (!this.active) {
                return;
            }
            this.calculateNavigationTargetTemplates();
        },

        calculateNavigationTargetTemplates: function () {
            if (this.navigationTargetTemplatesInitialized) {
                return;
            }
            var joinConditionsMap = this.collectJoinConditions();
            this.navigationTargetTemplatesMap = this.createNavTargetTemplatesFromJoinConditions(joinConditionsMap);
            this.cleanup();
            this.navigationTargetTemplatesInitialized = true;
        },

        createNavTargetTemplatesFromJoinConditions: function (joinConditionsMap) {
            var navigationTargetTemplatesMap = {};
            for (var sourceObjectType in joinConditionsMap) {
                var objectTypeJoinConditionsMap = joinConditionsMap[sourceObjectType];
                var navigationTargets = [];
                for (var targetObjectType in objectTypeJoinConditionsMap) {
                    var joinConditions = objectTypeJoinConditionsMap[targetObjectType];
                    if (!joinConditions) {
                        continue;
                    }
                    navigationTargets.push.apply(navigationTargets, joinConditions.generateNavigationTargetTemplates());
                }
                if (navigationTargets.length !== 0) {
                    navigationTargetTemplatesMap[sourceObjectType] = navigationTargets;
                }
            }
            return navigationTargetTemplatesMap;
        },

        collectJoinConditions: function () {
            var semanticObjectTypeMap = this.createIndex();
            var joinConditionsMap = {};
            for (var objectType in this.objectTypeMap) {
                var objectTypeJoinConditionsMap = this.collectJoinConditionsForObjectType(semanticObjectTypeMap, objectType);
                if (!core.isEmptyObject(objectTypeJoinConditionsMap)) {
                    joinConditionsMap[objectType] = objectTypeJoinConditionsMap;
                }
            }
            return joinConditionsMap;
        },

        collectJoinConditionsForObjectType: function (semanticObjectTypeMap, objectType) {

            var objectTypeJoinConditionsMap = {};
            var objectTypeMetadata = this.objectTypeMap[objectType];
            var getJoinConditions = function (targetObjectType) {
                var joinConditions = objectTypeJoinConditionsMap[targetObjectType];
                if (!joinConditions) {
                    joinConditions = new JoinConditions({
                        sina: this.sina,
                        navigationTargetGenerator: this,
                        sourceObjectType: objectType,
                        targetObjectType: targetObjectType
                    });
                    objectTypeJoinConditionsMap[targetObjectType] = joinConditions;
                }
                return joinConditions;
            }.bind(this);

            for (var propertyName in objectTypeMetadata.propertyMap) {

                var property = objectTypeMetadata.propertyMap[propertyName];
                var semanticObjectType = property.semanticObjectType;

                if (!property.response) {
                    continue;
                }

                if (!semanticObjectType) {
                    continue;
                }

                var targetObjectTypeMap = semanticObjectTypeMap[semanticObjectType];
                for (var targetObjectType in targetObjectTypeMap) {
                    if (targetObjectType === objectTypeMetadata.type) {
                        continue;
                    }
                    var targetObjectTypeMetadata = this.objectTypeMap[targetObjectType];
                    var targetPropertyNameMap = targetObjectTypeMap[targetObjectType];
                    for (var targetPropertyName in targetPropertyNameMap) {
                        var targetProperty = targetObjectTypeMetadata.propertyMap[targetPropertyName];
                        if (!targetProperty.request) {
                            continue;
                        }
                        var joinConditions = getJoinConditions(targetObjectType);
                        joinConditions.add({
                            sourcePropertyName: propertyName,
                            targetPropertyName: targetPropertyName,
                            semanticObjectType: semanticObjectType
                        });
                    }
                }
            }

            return objectTypeJoinConditionsMap;
        },

        createIndex: function () {
            var semanticObjectTypeMap = {}; // semantic object type / business object type / property name
            for (var objectType in this.objectTypeMap) {
                this.createIndexForObjectType(semanticObjectTypeMap, objectType);
            }
            return semanticObjectTypeMap;
        },

        createIndexForObjectType: function (semanticObjectTypeMap, objectType) {

            var objectTypeMetadata = this.objectTypeMap[objectType];

            for (var propertyName in objectTypeMetadata.propertyMap) {

                var property = objectTypeMetadata.propertyMap[propertyName];
                var semanticObjectType = property.semanticObjectType;

                if (!semanticObjectType) {
                    continue;
                }

                var objectTypeMap = semanticObjectTypeMap[semanticObjectType];
                if (!objectTypeMap) {
                    objectTypeMap = {};
                    semanticObjectTypeMap[semanticObjectType] = objectTypeMap;
                }

                var propertyNameMap = objectTypeMap[objectTypeMetadata.type];
                if (!propertyNameMap) {
                    propertyNameMap = {};
                    objectTypeMap[objectTypeMetadata.type] = propertyNameMap;
                }

                var propertyFlag = propertyNameMap[propertyName];
                if (!propertyFlag) {
                    propertyFlag = true;
                    propertyNameMap[propertyName] = true;
                }

            }
        },

        formatItem: function (item) {
            var collectAttributes = function (data, attributes) {
                for (var i = 0; i < attributes.length; ++i) {
                    var attribute = attributes[i];
                    data[attribute.id] = attribute;
                }
            };
            var data = {};
            collectAttributes(data, item.detailAttributes);
            collectAttributes(data, item.titleAttributes);
            return data;
        },

        generateNavigationTargetsForItem: function (item) {
            var navigationTargetTemplates = this.navigationTargetTemplatesMap[item.dataSource.id];
            if (!navigationTargetTemplates) {
                return undefined;
            }
            var formattedItem = this.formatItem(item);
            var navigationTargets = [];
            for (var i = 0; i < navigationTargetTemplates.length; ++i) {
                var navigationTargetTemplate = navigationTargetTemplates[i];
                var navigationTarget = navigationTargetTemplate.generate(formattedItem);
                if (!navigationTarget) {
                    continue;
                }
                navigationTargets.push(navigationTarget);
            }
            return navigationTargets;
        },

        generateNavigationTargets: function (searchResultSet) {
            if (!this.active) {
                return;
            }
            for (var i = 0; i < searchResultSet.items.length; ++i) {
                var item = searchResultSet.items[i];
                var navigationTargets = this.generateNavigationTargetsForItem(item);
                item.navigationTargets = item.navigationTargets || [];
                item.navigationTargets.push.apply(item.navigationTargets, navigationTargets);
            }
        }
    });

});
