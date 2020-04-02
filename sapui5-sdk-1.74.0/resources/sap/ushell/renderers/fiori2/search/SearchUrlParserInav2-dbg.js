// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['./SearchHelper'], function (SearchHelper) {
    "use strict";

    var SearchInav2UrlParser = function () {
        this.init.apply(this, arguments);
    };

    SearchInav2UrlParser.prototype = {

        init: function (properties) {
            this.model = properties.model;
        },

        parseUrlParameters: function (oParametersLowerCased) {

            // top
            if (oParametersLowerCased.top) {
                var top = parseInt(oParametersLowerCased.top, 10);
                this.model.setTop(top, false);
            }

            // datasource
            var dataSource = this.model.sinaNext.allDataSource;
            if (oParametersLowerCased.datasource) {
                var dataSourceJson = JSON.parse(oParametersLowerCased.datasource);
                var dataSourceId = dataSourceJson.ObjectName.value;
                switch (dataSourceJson.Type) {
                case 'Category':
                    if (dataSourceId === '$$ALL$$') {
                        dataSource = this.model.sinaNext.allDataSource;
                    } else {
                        dataSource = this.model.sinaNext.getDataSource(dataSourceId);
                        if (!dataSource) {
                            dataSource = this.model.sinaNext._createDataSource({
                                type: this.model.sinaNext.DataSourceType.Category,
                                id: dataSourceId,
                                label: dataSourceJson.label,
                                labelPlural: dataSourceJson.labelPlural
                            });
                        }
                    }
                    break;
                case 'BusinessObject':
                    dataSource = this.model.sinaNext.getDataSource(dataSourceId);
                    if (!dataSource) {
                        dataSource = this.model.sinaNext.allDataSource;
                        delete oParametersLowerCased.filter;
                        sap.m.MessageBox.show(sap.ushell.resources.i18n.getText('searchUrlParsingErrorLong') + '\n(Unknow datasource ' + dataSourceId + ')', {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: sap.ushell.resources.i18n.getText('searchUrlParsingError'),
                            actions: [sap.m.MessageBox.Action.OK]
                        });
                    }
                    break;
                default:
                    throw 'unknown datasource type ' + dataSourceJson.Type;
                }

            }

            return SearchHelper.convertPromiseTojQueryDeferred(this.model.sinaNext.loadMetadata(dataSource)).then(function () {

                // root condition
                var context = {
                    dataSource: dataSource
                };
                var rootCondition;
                if (oParametersLowerCased.filter) {
                    var filterJson = JSON.parse(oParametersLowerCased.filter);
                    rootCondition = this.parseCondition(context, filterJson);
                } else {
                    rootCondition = this.model.sinaNext.createComplexCondition();
                }

                // filter
                var filter = this.model.sinaNext.createFilter({
                    dataSource: dataSource,
                    searchTerm: oParametersLowerCased.searchterm,
                    rootCondition: rootCondition
                });
                this.model.setProperty("/uiFilter", filter);
                this.model.setDataSource(filter.dataSource, false); // explicitely updata datasource (for categories: update ds list in model)

            }.bind(this));

        },

        parseCondition: function (context, conditionJson) {
            if (conditionJson.conditions) {
                return this.parseComplexCondition(context, conditionJson);
            }
            return this.parseSimpleCondition(context, conditionJson);

        },

        parseComplexCondition: function (context, conditionJson) {
            var subConditions = [];
            for (var i = 0; i < conditionJson.conditions.length; ++i) {
                var subConditionJson = conditionJson.conditions[i];
                subConditions.push(this.parseCondition(context, subConditionJson));
            }
            return this.model.sinaNext.createComplexCondition({
                operator: conditionJson.operator,
                conditions: subConditions,
                valueLabel: conditionJson.label
            });
        },

        parseSimpleCondition: function (context, conditionJson) {
            context.attribute = conditionJson.attribute;
            return this.model.sinaNext.createSimpleCondition({
                attribute: conditionJson.attribute,
                attributeLabel: conditionJson.attributeLabel,
                value: this.parseValue(context, conditionJson.value),
                valueLabel: conditionJson.valueLabel || conditionJson.label,
                operator: this.parseOperator(context, conditionJson.operator)
            });
        },

        parseValue: function (context, value) {
            var metadata = context.dataSource.getAttributeMetadata(context.attribute);
            return this.model.sinaNext.inav2TypeConverter.ina2Sina(metadata.type, value);
        },

        parseOperator: function (context, operator) {
            switch (operator) {
            case '=':
                return this.model.sinaNext.ComparisonOperator.Eq;
            case '>':
                return this.model.sinaNext.ComparisonOperator.Gt;
            case '>=':
                return this.model.sinaNext.ComparisonOperator.Ge;
            case '<':
                return this.model.sinaNext.ComparisonOperator.Lt;
            case '<=':
                return this.model.sinaNext.ComparisonOperator.Le;
            default:
                throw 'Unknown operator ' + operator;
            }
        }

    };

    return SearchInav2UrlParser;

});
