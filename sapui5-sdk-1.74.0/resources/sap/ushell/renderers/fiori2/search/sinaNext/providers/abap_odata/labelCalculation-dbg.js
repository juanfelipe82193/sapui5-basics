// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/LabelCalculator'], function (core, LabelCalculator) {
    "use strict";

    var module = {};

    module.createLabelCalculator = function () {
        return new LabelCalculator({
            key: function (dataSource) {
                return [dataSource.labelPlural, dataSource._private.system, dataSource._private.client];
            },
            data: function (dataSource) {
                return {
                    label: dataSource.label,
                    labelPlural: dataSource.labelPlural
                };
            },
            setLabel: function (dataSource, labels, data) {
                labels[0] = data.label;
                dataSource.label = labels.join(' ');
                labels[0] = data.labelPlural;
                dataSource.labelPlural = labels.join(' ');
            },
            setFallbackLabel: function (dataSource, data) {
                dataSource.label = data.label + ' duplicate ' + dataSource.id;
                dataSource.labelPlural = dataSource.label;
            }
        });
    };

    return module;
});
