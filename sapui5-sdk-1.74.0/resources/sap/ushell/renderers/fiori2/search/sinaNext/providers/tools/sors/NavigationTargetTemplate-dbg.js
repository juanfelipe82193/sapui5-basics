// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */


sinaDefine([
    '../../../core/core'
], function (core) {
    "use strict";

    return core.defineClass({

        _init: function (properties) {
            this.sina = properties.sina;
            this.navigationTargetGenerator = properties.navigationTargetGenerator;
            this.label = properties.label;
            this.sourceObjectType = properties.sourceObjectType;
            this.targetObjectType = properties.targetObjectType;
            this.conditions = properties.conditions;
        },

        generate: function (data) {
            var dataSource = this.sina.getDataSource(this.targetObjectType);
            var filter = this.sina.createFilter({
                dataSource: dataSource,
                searchTerm: '*'
            });
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var filterCondition = this.sina.createSimpleCondition({
                    attribute: condition.targetPropertyName,
                    attributeLabel: dataSource.getAttributeMetadata(condition.targetPropertyName).label,
                    operator: this.sina.ComparisonOperator.Eq,
                    value: data[condition.sourcePropertyName].value,
                    valueLabel: data[condition.sourcePropertyName].valueFormatted
                });
                filter.autoInsertCondition(filterCondition);
            }
            return this.sina._createNavigationTarget({
                label: this.label,
                targetUrl: this.navigationTargetGenerator.urlPrefix + encodeURIComponent(JSON.stringify(filter.toJson()))
            });
        }

    });

});
