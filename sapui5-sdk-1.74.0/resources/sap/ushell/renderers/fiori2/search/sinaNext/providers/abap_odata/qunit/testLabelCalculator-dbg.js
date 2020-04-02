// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, QUnit */
sinaDefine(['../LabelCalculator'], function (LabelCalculator) {
    "use strict";

    var test = function (assert, steps) {
        var dataSources = [];
        var labelCalculator = new LabelCalculator();
        for (var i = 0; i < steps.length; ++i) {
            var step = steps[i];
            labelCalculator.calculateLabel(step.dataSource);
            dataSources.push(step.dataSource);
            for (var j = 0; j <= i; ++j) {
                assert.equal(step.labels[j], dataSources[j].label, 'label comparison');
                assert.equal(step.labelsPlural[j], dataSources[j].labelPlural, 'label plural comparison');
            }
        }
    };

    QUnit.test("LabelCalculator 1", function (assert) {

        test(assert, [{
            dataSource: {
                id: 'CER002~EPM_PO_DEMO~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order'],
            labelsPlural: ['Purchase Orders']
        }, {
            dataSource: {
                id: 'CER002~EPM_SO_DEMO~',
                label: 'Sales Order',
                labelPlural: 'Sales Orders'
            },
            labels: ['Purchase Order', 'Sales Order'],
            labelsPlural: ['Purchase Orders', 'Sales Orders']
        }, {
            dataSource: {
                id: 'CES002~EPM_SO_DEMO~',
                label: 'Sales Order',
                labelPlural: 'Sales Orders'
            },
            labels: ['Purchase Order', 'Sales Order CER', 'Sales Order CES'],
            labelsPlural: ['Purchase Orders', 'Sales Orders CER', 'Sales Orders CES']
        }, {
            dataSource: {
                id: 'CES003~EPM_SO_DEMO~',
                label: 'Sales Order',
                labelPlural: 'Sales Orders'
            },
            labels: ['Purchase Order', 'Sales Order CER', 'Sales Order CES 002', 'Sales Order CES 003'],
            labelsPlural: ['Purchase Orders', 'Sales Orders CER', 'Sales Orders CES 002', 'Sales Orders CES 003']
        }]);


    });

    QUnit.test("LabelCalculator 2", function (assert) {

        test(assert, [{
            dataSource: {
                id: 'CER002~EPM_PO_DEMO~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order'],
            labelsPlural: ['Purchase Orders']
        }, {
            dataSource: {
                id: 'CER003~EPM_PO_DEMO~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order CER 002', 'Purchase Order CER 003'],
            labelsPlural: ['Purchase Orders CER 002', 'Purchase Orders CER 003']
        }, {
            dataSource: {
                id: 'CES003~EPM_PO_DEMO~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order CER 002', 'Purchase Order CER 003', 'Purchase Order CES'],
            labelsPlural: ['Purchase Orders CER 002', 'Purchase Orders CER 003', 'Purchase Orders CES']
        }, {
            dataSource: {
                id: 'CES003~EPM_SO_DEMO~',
                label: 'Sales Order',
                labelPlural: 'Sales Orders'
            },
            labels: ['Purchase Order CER 002', 'Purchase Order CER 003', 'Purchase Order CES', 'Sales Order'],
            labelsPlural: ['Purchase Orders CER 002', 'Purchase Orders CER 003', 'Purchase Orders CES', 'Sales Orders']
        }]);

    });

    QUnit.test("LabelCalculator - system and client not sufficient for unique key", function (assert) {

        test(assert, [{
            dataSource: {
                id: 'CER002~EPM_PO_DEMO~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order'],
            labelsPlural: ['Purchase Orders']
        }, {
            dataSource: {
                id: 'CER002~EPM_PO_DEMO_2~',
                label: 'Purchase Order',
                labelPlural: 'Purchase Orders'
            },
            labels: ['Purchase Order', 'Purchase Order#1'],
            labelsPlural: ['Purchase Orders', 'Purchase Orders#1']
        }]);

    });

    QUnit.test("LabelCalculator - category", function (assert) {

        test(assert, [{
            dataSource: {
                id: 'EPM_Demo',
                label: 'Procurement',
                labelPlural: 'Procurement'
            },
            labels: ['Procurement'],
            labelsPlural: ['Procurement']
        }]);

    });

});
