/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

(function () {
    "use strict";

    var testName = "treeTests-visibility";
    var testFunc = function (assert) {
        var vtm = new sap.ui.vtm.createVtm();
        var panel = vtm.createPanel();
        vtm._addPanel(panel);
        var tree = panel.getTree();

        var treeData = [
            {
                id: "visual1",
                visibility: true,
                includedChildren: [
                    {
                        id: "nonVisual1",
                        includedChildren: [
                            {
                                id: "visual2",
                                visibility: false
                            },
                            {
                                id: "visual3",
                                visibility: true
                            },
                            {
                                id: "nonVisual2",
                                visibility: null
                            }
                        ]
                    }
                ],
                excludedChildren: [
                    {
                        id: "excludedVisual1",
                        visibility: true
                    },
                    {
                        id: "excludedNonVisual1"
                    }

                ]
            }
        ];

        var cloneTreeData = function (treeData) {
            return sap.ui.vtm.TreeItemUtilities.mapTree(treeData, function (treeItem) {
                return JSON.parse(JSON.stringify(treeItem));
            });
        };

        var testTreeData, visual1, visual2, visual3, nonVisual1, nonVisual2, excludedVisual1, excludedNonVisual1;

        var prepareTest = function () {
            testTreeData = cloneTreeData(treeData);
            visual1 = testTreeData[0];
            nonVisual1 = visual1.includedChildren[0];
            visual2 = nonVisual1.includedChildren[0];
            visual3 = nonVisual1.includedChildren[1];
            nonVisual2 = nonVisual1.includedChildren[2];
            excludedVisual1 = visual1.excludedChildren[0];
            excludedNonVisual1 = visual1.excludedChildren[1];

            tree.setRootItems(testTreeData);
            tree.updateCollections();
            tree.updateModel();
        };

        // visibility tests

        prepareTest();

        var actual, expected, message;

        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [true, undefined, false, true, null, true, undefined];
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        expected = true;
        actual = tree.getVisibility(visual1);
        message = "\r\nInitial visibility (tree items object): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], false, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [false, undefined, false, false, null, false, undefined];
        // Expectation: visibility of visual items set to false, visibility of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], true, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [true, undefined, true, true, null, true, undefined];
        // Expectation: visibility of visual items set to true, visibility of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], false, false, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [false, false, false, false, false, false, false];
        // Expectation: visibility of visual and non visual items set to false 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], true, false, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [true, true, true, true, true, true, true];
        // Expectation: visibility of visual and non visual items set to true 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], null, false, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: visibility property of visual and non visual items removed 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], false, true);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [false, undefined, false, false, null, false, undefined];
        // Expectation: visibility of included and excluded visual items set to false, visibility of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], true, true);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [true, undefined, true, true, null, true, undefined];
        // Expectation: visibility of included and excluded visual items set to true, visibility of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], undefined, true);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, null, undefined, undefined];
        // Expectation: visibility of included and excluded visual items set to undefined, visibility of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], false, true, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [false, false, false, false, false, false, false];
        // Expectation: visibility of included and excluded visual and non visual items set to false 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], true, true, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [true, true, true, true, true, true, true];
        // Expectation: visibility of included and excluded visual and non visual items set to false 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setVisibility([visual1], undefined, true, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: visibility of included and excluded visual and non visual items set to undefined 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        // Same as previous test but with refresh disabled
        tree.setVisibility([visual1], undefined, true, false, false);
        actual = tree.getVisibility([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: visibility of included and excluded visual and non visual items set to undefined 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);
    };

    if (QUnit.config.autostart !== false) {
        QUnit.config.autostart = false;
        QUnit.test(testName, testFunc);
        QUnit.start();
    } else {
        QUnit.test(testName, testFunc);
    }
})();