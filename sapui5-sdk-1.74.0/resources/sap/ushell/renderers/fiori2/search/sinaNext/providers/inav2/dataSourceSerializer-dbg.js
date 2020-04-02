// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../sina/ComplexCondition', '../../sina/ComparisonOperator'], function (core, ComplexCondition, ComparisonOperator) {
    "use strict";

    return {

        serialize: function (dataSource) {

            // handle all ds
            //            if (dataSource === dataSource.sina.getAllDataSource()) {
            if (dataSource.id === 'All' && dataSource.type === dataSource.sina.DataSourceType.Category) {
                return {
                    ObjectName: '$$ALL$$',
                    PackageName: 'ABAP',
                    SchemaName: '',
                    Type: 'Category'
                };
            }

            // convert sina type to ina type
            var type;
            switch (dataSource.type) {
            case dataSource.sina.DataSourceType.Category:
                type = 'Category';
                break;
            case dataSource.sina.DataSourceType.BusinessObject:
                type = 'Connector';
                break;
            }

            // assemble ina ds
            return {
                ObjectName: dataSource.id,
                PackageName: 'ABAP',
                SchemaName: '',
                Type: type
            };
        }

    };

});
