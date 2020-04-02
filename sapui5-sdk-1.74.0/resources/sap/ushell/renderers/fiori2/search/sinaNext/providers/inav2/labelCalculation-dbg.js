// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../core/LabelCalculator'], function (core, LabelCalculator) {
    "use strict";
    var module = {};

    var splitId = function (id) {
        //CER002~EPM_PD_DEMO~
        if (id[6] !== '~') {
            return {
                system: '__DUMMY',
                client: '__DUMMY'
            };
        }
        return {
            system: id.slice(0, 3),
            client: id.slice(3, 6)
        };
    };

    module.createLabelCalculator = function () {
        return new LabelCalculator({
            key: function (dataSource) {
                var splittedId = splitId(dataSource.id);
                return [dataSource.labelPlural, splittedId.system, splittedId.client];
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
